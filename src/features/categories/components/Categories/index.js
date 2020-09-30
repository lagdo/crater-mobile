// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import {
    MainLayout,
    ListView
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import Lng from '../../../../api/lang/i18n';
import { CATEGORY_ADD, CATEGORY_EDIT } from '../../constants';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';

type IProps = {
    navigation: Object,
    getPayments: Function,
    payments: Object,
    loading: Boolean,
    language: String,
}

export const Categories = (props: IProps) => {
    const {
        navigation,
        loading,
        language,
        categories,
        getExpenseCategories,
    } = props;

    const [search, setSearch] = useState('');
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [found, setFound] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getExpenseCategories();

        goBack(MOUNT, navigation);

        return () => goBack(UNMOUNT);
    }, []);

    const onSelectCategory = (category) => {
        navigation.navigate(ROUTES.CATEGORY,
            { type: CATEGORY_EDIT, categoryId: category.id }
        )
    }

    const onSearch = (keywords) => {
        let searchFields = ['name'];

        if (typeof categories !== 'undefined' && categories.length != 0) {

            let newData = categories.filter((category) => {
                let filterData = false

                searchFields.filter((field) => {
                    let itemField = category[field] ? category[field] : ''

                    if (itemField !== null && itemField !== 'undefined') {
                        itemField = itemField.toLowerCase()

                        let searchData = keywords.toString().toLowerCase()

                        if (itemField.indexOf(searchData) > -1) {
                            filterData = true
                        }
                    }
                })
                return filterData
            });

            setCategoriesFilter(itemList(newData))
            setFound(categoriesFilter.length != 0 ? true : false)
            setSearch(keywords)
        }
    };

    const itemList = (categories) => {
        let categoriesList = []
        if (typeof categories !== 'undefined' && categories.length != 0) {
            categoriesList = categories.map((category) => {
                const { name, description } = category;

                return {
                    title: name || '',
                    subtitle: {
                        title: description,
                    },
                    fullItem: category,
                };
            });
        }
        return categoriesList
    }

    const getFreshItems = (onHide) => {
        getExpenseCategories()

        setTimeout(() => {
            onHide && onHide()
        }, 400);
    }

    let categoriesList = itemList(categories)

    let empty = (!search) ? {
        description: Lng.t("categories.empty.description", { locale: language }),
        buttonTitle: Lng.t("categories.empty.buttonTitle", { locale: language }),
        buttonPress: () => navigation.navigate(ROUTES.CATEGORY, { type: CATEGORY_ADD }),
    } : {}

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    leftIcon: "long-arrow-alt-left",
                    leftIconPress: () => navigation.navigate(ROUTES.SETTING_LIST),
                    title: Lng.t("header.expenseCategory", { locale: language }),
                    titleStyle: styles.titleStyle,
                    placement: "center",
                    rightIcon: "plus",
                    rightIconPress: () => navigation.navigate(ROUTES.CATEGORY, { type: CATEGORY_ADD }),
                }}
                onSearch={onSearch}
                bottomDivider
                loadingProps={{ is: loading }}
            >

                <View style={styles.listViewContainer}>
                    <ListView
                        items={categoriesFilter.length != 0 ?
                            categoriesFilter : found ? categoriesList : []
                        }
                        refreshing={refreshing}
                        getFreshItems={(onHide) => {
                            getFreshItems(onHide)
                        }}
                        onPress={onSelectCategory}
                        loading={loading}
                        isEmpty={found ? categoriesList.length <= 0 : true}
                        bottomDivider
                        emptyContentProps={{
                            title: found ?
                                Lng.t("categories.empty.title", { locale: language }) :
                                Lng.t("search.noResult", { locale: language, search }),
                            ...empty
                        }}
                    />
                </View>

            </MainLayout>
        </View>
    );
}
