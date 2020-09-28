// @flow

import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import styles from './styles';
import { SlideModal, FakeInput } from '..';
import { change } from 'redux-form';
import { CtButton } from '../Button';
import Lng from '../../api/lang/i18n';
import { connect } from 'react-redux';
import { IProps } from './type';
import { headerTitle } from '../../api/helper';

export const SelectFieldComponent = (props: IProps) => {
    const {
        language,
        containerStyle,
        items,
        getItems,
        loading,
        label,
        icon,
        placeholder,
        meta,
        headerProps,
        hasPagination,
        fakeInputProps,
        listViewProps,
        valueCompareField,
        compareField,
        concurrentMultiSelect,
        emptyContentProps,
        apiSearch,
        searchInputProps,
        isRequired,
        isInternalSearch,
        onSelect,
        isMultiSelect,
        input: { name, value, onChange },
        hasFirstItem = true,
        displayName,
        isEditable = true,
        onlyPlaceholder,
        isCompareField = true,
        searchFields,
        onSearch,
        rightIconPress,
        emptyContentProps: { contentType },
        pagination: pg,
    } = props;

    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState(pg || { page: 1, limit: 10, lastPage: 1 });
    const [search, setSearch] = useState('');
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [oldItems, setOldItems] = useState([]);
    const [defaultItems, setDefaultItems] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const [oldValue, setOldValue] = useState();

    useEffect(() => {
        if (typeof items !== 'undefined') {
            let newValue = ''

            for (const key in items) {
                if (key !== 'undefined' && items[key]['fullItem'][compareField] === value) {
                    newValue = items[key]['fullItem'][displayName]
                }
            }
            if (concurrentMultiSelect) {
                setSelectedItems(value);
                setOldItems(value);
            }

            setValues(compareField ? newValue : value[displayName]);
            setDefaultItems(items || []);
            setSearchItems(items || []);
            setOldValue(compareField ? value : value[displayName]);
        }

        apiSearch && onGetItems({
            fresh: true,
            onResult: () => {
                if (typeof items !== 'undefined' && items.length !== 0 && hasFirstItem) {

                    firstItem = items[0]['fullItem']

                    setValues(compareField && firstItem[displayName]);
                    setOldValue(compareField ? firstItem[compareField] : firstItem[displayName]);

                    /*  if (!value) {
                         if (!onSelect) {
                             isMultiSelect ?
                                 onChange([
                                     ...[{ ...firstItem, [valueCompareField]: firstItem[compareField] }]
                                 ]) : onChange(firstItem)
                         } else {
                             onSelect(firstItem)
                         }
                     } */
                }
            }
        })
    }, []);

    useEffect(() => {
        if (concurrentMultiSelect && !search && oldItems.length < value.length) {
            setSelectedItems(value);
            setOldItems(value);
        }

        if (typeof items !== 'undefined' && !search) {

            let newValue = ''

            for (const key in items) {
                if (key !== 'undefined' && items[key]['fullItem'][compareField] === value) {
                    newValue = items[key]['fullItem'][displayName]
                }
            }

            if (value && (oldValue !== value)) {
                setOldValue(compareField ? value : value[displayName]);
                setValues(compareField ? newValue : value[displayName]);
            }
        }
    }, [search, value, oldValue]);

    const onGetItems = ({ fresh = false, onResult, q = '' } = {}) => {
        if (refreshing) {
            return;
        }

        const paginationParams = fresh ? { ...pagination, page: 1 } : pagination

        if (!fresh && paginationParams.lastPage < paginationParams.page) {
            return
        }

        setRefreshing(true);

        getItems && getItems({
            fresh,
            pagination: paginationParams,
            params: { search: q },
            q,
            onMeta: ({ last_page, current_page }) => {
                setPagination({
                    ...paginationParams,

                    lastPage: last_page,
                    page: current_page + 1
                });
            },
            onResult: () => {
                setRefreshing(false);
                onResult && onResult();
            },
        });

    }

    const onToggle = () => {
        if (isEditable) {
            visible && setSearchItems(defaultItems);

            setVisible(!visible);

            meta.dispatch(change(meta.form, 'search', ''));
        }
    }

    const onItemSelect = (item) => {
        concurrentMultiSelect ? toggleItem(item) : getAlert(item)
    }

    const toggleItem = (item) => {
        const newItem = [{ ...item, [valueCompareField]: item[compareField] }]

        if (selectedItems) {
            let hasSameItem = selectedItems.filter(val =>
                JSON.parse(val[valueCompareField]) === JSON.parse(item[compareField])
            )

            if (hasSameItem.length > 0) {
                const removedItems = selectedItems.filter(val =>
                    JSON.parse(val[valueCompareField]) !== JSON.parse(item[compareField])
                )

                setSelectedItems(removedItems);
            } else {
                setSelectedItems([...selectedItems, ...newItem]);
            }
        } else {
            setSelectedItems(newItem);
        }
    }

    const getAlert = (item) => {
        if (!isMultiSelect && value) {
            const hasCompare = compareField ? value === item[compareField] :
                JSON.parse(value.id) === JSON.parse(item.id)

            if (hasCompare) {
                // alert(`The ${item[displayName]} already added`)
                onToggle()
                return
            }
        }

        if (isMultiSelect && value) {
            let hasSameItem = value.filter(val => JSON.parse(val[valueCompareField]) === JSON.parse(item[compareField]))

            if (hasSameItem.length > 0) {
                // alert(`The ${item[displayName]} already added`)
                onToggle()
                return
            }
        }

        !onlyPlaceholder && setValues(item[displayName]);

        if (!onSelect) {
            isMultiSelect ?
                onChange([
                    ...value,
                    ...[{ ...item, [valueCompareField]: item[compareField] }]
                ]) : onChange(item)
        } else {
            onSelect(item)
        }

        !onlyPlaceholder && setOldValue(item[compareField]);

        onToggle()
    }

    const onSearchItems = (search) => {
        setSearch(search);

        apiSearch && !isInternalSearch ? onGetItems({ fresh: true, q: search }) : internalSearch(search)
    }

    const internalSearch = (search) => {
        let newData = [];
        let searchItems = isInternalSearch ? items : defaultItems

        if (typeof searchItems !== 'undefined' && searchItems.length != 0) {
            newData = searchItems.filter((item) => {
                let filterData = false

                searchFields.filter((field) => {
                    let itemField = item.fullItem[field]

                    if (typeof itemField === 'number') {
                        itemField = itemField.toString()
                    }

                    if (itemField !== null && typeof itemField !== 'undefined') {
                        itemField = itemField.toLowerCase()

                        let searchData = search.toString().toLowerCase()

                        if (itemField.indexOf(searchData) > -1) {
                            filterData = true
                        }
                    }
                })
                return filterData
            });
        }

        setSearchItems(newData);
    }

    const onSubmit = () => {
        onChange(selectedItems)

        setOldItems(selectedItems);

        onToggle()
    }

    const onRightIconPress = () => {
        onToggle()
        rightIconPress && rightIconPress()
    }

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={onSubmit}
                        btnTitle={Lng.t("button.done", { locale: language })}
                        containerStyle={styles.handleBtn}
                    />
                </View>
            </View>
        )
    }

    const getEmptyTitle = () => {
        let emptyTitle = ''

        if (contentType) {
            emptyTitle = Lng.t(`${contentType}.empty.title`, { locale: language })
        }

        let noSearchResult = Lng.t("search.noSearchResult", { locale: language })

        return search ? `${noSearchResult} "${search}"` : emptyTitle
    }

    const { lastPage, page } = pagination;
    const canLoadMore = (lastPage >= page);

    let paginationContent = {}
    let multiSelectProps = {}
    let bottomActionProps = {}

    if (concurrentMultiSelect) {
        multiSelectProps = {
            hasCheckbox: true,
            compareField,
            valueCompareField,
            checkedItems: selectedItems,
        }
        bottomActionProps = {
            bottomAction: BOTTOM_ACTION()
        }
    }

    if (hasPagination) {
        paginationContent = {
            canLoadMore,
            getFreshItems: (onHide) => {
                onGetItems({
                    fresh: true,
                    onResult: onHide,
                    q: search,
                })
            },
            getItems: () => {
                onGetItems({
                    q: search,
                });
            },
        }
    }

    let internalSearchItem = (isInternalSearch && !search) ? items : searchItems

    return (
        <View style={styles.container}>

            <FakeInput
                label={label}
                icon={icon}
                isRequired={isRequired}
                values={value && (values || placeholder)}
                // values={value && values}
                placeholder={placeholder}
                onChangeCallback={onToggle}
                containerStyle={containerStyle}
                meta={meta}
                rightIcon={'angle-right'}
                {...fakeInputProps}
            />

            <SlideModal
                visible={visible}
                onToggle={onToggle}
                headerProps={{
                    leftIcon: "long-arrow-alt-left",
                    leftIconPress: onToggle,
                    titleStyle: headerTitle({}),
                    placement: "center",
                    rightIcon: "plus",
                    hasCircle: false,
                    noBorder: false,
                    transparent: false,
                    rightIconPress: onRightIconPress,
                    ...headerProps
                }}
                searchInputProps={searchInputProps && searchInputProps}
                onSearch={onSearchItems}
                bottomDivider
                {...paginationContent}
                {...bottomActionProps}
                listViewProps={{
                    items: apiSearch ? items : internalSearchItem,
                    onPress: onItemSelect,
                    refreshing: refreshing,
                    loading: loading,
                    isEmpty: typeof items == 'undefined' || (apiSearch ?
                        items.length <= 0 : internalSearchItem.length <= 0),
                    bottomDivider: true,
                    emptyContentProps: {
                        title: getEmptyTitle(),
                        ...emptyContentProps
                    },
                    itemContainer: {
                        paddingVertical: 16
                    },
                    ...listViewProps,
                    ...multiSelectProps,
                    ...paginationContent
                }}
            />
        </View>
    );
}

const mapStateToProps = ({ global }) => ({
    language: global.language,
});

const mapDispatchToProps = {};

export const SelectField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectFieldComponent);
