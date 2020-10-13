// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import {
    MainLayout,
    ListView
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { IMAGES } from '../../../../config';
import Lng from '../../../../api/lang/i18n';
import { ADD_ITEM, EDIT_ITEM } from '../../constants';
import { itemsDescriptionStyle } from '../../../invoices/components/Invoice/styles';
import { formatSelectPickerName } from '../../../../api/global';

type IProps = {
    navigation: Object,
    getItems: Function,
    items: Object,
    loading: Boolean,
}

const defaultParams = {
    search: '',
    unit_id: '',
    price: '',
}

let filterRefs = {};

export const Items = (props: IProps) => {
    const {
        navigation,
        loading,
        currency,
        items,
        filterItems,
        getItems: getProducts,
        units,
        itemUnitsLoading = false,
        getItemUnits,
    } = props;

    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, lastPage: 1 });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);

    const [selectedUnitId, setSelectedUnitId] = useState('');

    useEffect(() => {
        getItems({ fresh: true });
        getItemUnits()
    }, []);

    const onItemSelect = ({ id }) => {
        navigation.navigate(ROUTES.GLOBAL_ITEM, { type: EDIT_ITEM, id })
        onResetFilter()
    }

    const getItems = ({ fresh = false, onResult, params, filter = false } = {}) => {
        if (refreshing) {
            return;
        }

        setRefreshing(true);
        setFresh(fresh);

        const paginationParams = fresh ? { ...pagination, page: 1 } : pagination;

        if (!fresh && paginationParams.lastPage < paginationParams.page) {
            return;
        }

        getProducts({
            fresh,
            pagination: paginationParams,
            params,
            filter,
            onMeta: ({ last_page, current_page }) => {
                setPagination({
                    ...paginationParams,
                    lastPage: last_page,
                    page: current_page + 1,
                });
            },
            onResult: (val) => {
                setRefreshing(false);
                setFresh(!val);
                onResult && onResult();
            },
        });
    };

    const onResetFilter = () => setFilter(false);

    const onSubmitFilter = ({ unit_id = '', name = '', price = '' }) => {
        if (unit_id || name || price) {
            setFilter(true);

            filterRefs.params = {
                search: name,
                unit_id,
                price,
            };
            getItems({
                fresh: true,
                params: {
                    ...defaultParams,
                    ...filterRefs.params,
                },
                filter: true,
            });
            return;
        }

        onResetFilter();
    }

    const onSearch = (keywords) => {
        onResetFilter()
        setSearch(keywords)
        getItems({ fresh: true, params: { ...defaultParams, search: keywords } })
    };

    const getItemList = (items) => {
        let itemList = []

        if (typeof items !== 'undefined' && items.length != 0) {

            itemList = items.map((item) => {

                let { name, description, price, title } = item

                return {
                    title: title || name,
                    subtitle: {
                        title: description,
                    },
                    amount: price,
                    currency,
                    fullItem: item,
                };
            });
        }

        return itemList
    }

    const loadMoreItems = () => {
        if (!filter) {
            getItems({ params: { ...defaultParams, search } });
            return;
        }

        getItems({
            params: {
                ...defaultParams,
                ...filterRefs.params,
            },
            filter: true,
        });
    }

    const { lastPage, page } = pagination;

    const canLoadMore = lastPage >= page;

    let inputFields = [
        {
            name: 'name',
            hint: Lng.t("items.name"),
            inputProps: {
                returnKeyType: 'next',
                autoCorrect: true,
                autoFocus: true,
                onSubmitEditing: () => filterRefs.price.focus(),
            },
            refLinkFn: (ref) => filterRefs.name = ref,
        },
        {
            name: 'price',
            hint: Lng.t("items.price"),
            inputProps: {
                returnKeyType: 'next',
                keyboardType: 'numeric',
            },
            isCurrencyInput: true,
            refLinkFn: (ref) => filterRefs.price = ref,
        }
    ]

    let dropdownFields = [{
        name: "unit_id",
        label: Lng.t("items.unit"),
        fieldIcon: 'align-center',
        items: formatSelectPickerName(units),
        onChangeCallback: setSelectedUnitId,
        defaultPickerOptions: {
            label: Lng.t("items.unitPlaceholder"),
            value: '',

        },
        selectedItem: selectedUnitId,
        onDonePress: () => filterRefs.name.focus(),
        containerStyle: styles.selectPicker
    }]

    let empty = (!filter && !search) ? {
        description: Lng.t("items.empty.description"),
        buttonTitle: Lng.t("items.empty.buttonTitle"),
        buttonPress: () => {
            navigation.navigate(ROUTES.GLOBAL_ITEM, { type: ADD_ITEM })
            onResetFilter()
        }
    } : {}

    let emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("items.empty.title") :
            Lng.t("filter.empty.filterTitle")

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    title: Lng.t("header.items"),
                    leftIcon: "long-arrow-alt-left",
                    leftIconPress: () => navigation.navigate(ROUTES.MAIN_MORE),
                    title: Lng.t("header.items"),
                    titleStyle: styles.headerTitle,
                    rightIcon: "plus",
                    placement: "center",
                    rightIcon: "plus",
                    rightIconPress: () => {
                        navigation.navigate(ROUTES.GLOBAL_ITEM, { type: ADD_ITEM })
                        onResetFilter()
                    },
                }}
                onSearch={onSearch}
                bottomDivider
                onFocus={() => { }}
                filterProps={{
                    onSubmitFilter: onSubmitFilter,
                    inputFields: inputFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    onResetFilter: () => onResetFilter()
                }}
                loadingProps={{ is: (loading && fresh) || itemUnitsLoading }}
            >
                <View style={styles.listViewContainer} >
                    <ListView
                        items={!filter ? getItemList(items) :
                            getItemList(filterItems)
                        }
                        onPress={onItemSelect}
                        refreshing={refreshing}
                        loading={loading}
                        isEmpty={!filter ? items && items.length <= 0 : filterItems.length <= 0}
                        canLoadMore={canLoadMore}
                        getFreshItems={(onHide) => {
                            onResetFilter()
                            getItems({
                                fresh: true,
                                onResult: onHide,
                                params: { ...defaultParams, search }
                            });
                        }}
                        getItems={() => {
                            loadMoreItems()
                        }}
                        bottomDivider
                        leftSubTitleStyle={itemsDescriptionStyle()}
                        emptyContentProps={{
                            title: emptyTitle,
                            image: IMAGES.EMPTY_ITEMS,
                            ...empty
                        }}
                    />
                </View>

            </MainLayout>
        </View>
    );
}
