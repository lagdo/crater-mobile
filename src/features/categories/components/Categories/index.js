// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import {
    MainLayout,
    ListView
} from '~/components';
import { ROUTES } from '~/navigation/routes';
import Lng from '~/api/lang/i18n';
import { CATEGORY_ADD, CATEGORY_EDIT } from '../../constants';

type IProps = {
    navigation: Object,
    getPayments: Function,
    payments: Object,
    loading: Boolean,
}

export const Categories = (props: IProps) => {
    const {
        navigation,
        loading,
        categories,
        getExpenseCategories,
    } = props;

    const [search, setSearch] = useState('');
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [found, setFound] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getExpenseCategories();
    }, []);

    const onSelectCategory = (category) => {
        navigation.navigate(ROUTES.CATEGORY, { type: CATEGORY_EDIT, categoryId: category.id });
    }

    const onSearch = (keywords) => {
        let searchFields = ['name'];

        if (typeof categories !== 'undefined' && categories.length != 0) {

            let newData = categories.filter(({ fullItem: category }) => {
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

            setCategoriesFilter(newData);
            setFound(categoriesFilter.length != 0 ? true : false);
            setSearch(keywords);
        }
    };

    const getFreshItems = (onHide) => {
        getExpenseCategories()

        setTimeout(() => {
            onHide && onHide()
        }, 400);
    }

    let empty = (!search) ? {
        description: Lng.t("categories.empty.description"),
        buttonTitle: Lng.t("categories.empty.buttonTitle"),
        buttonPress: () => navigation.navigate(ROUTES.CATEGORY, { type: CATEGORY_ADD }),
    } : {}

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    leftIcon: "long-arrow-alt-left",
                    leftIconPress: navigation.goBack,
                    title: Lng.t("header.expenseCategory"),
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
                            categoriesFilter : found ? categories : []
                        }
                        refreshing={refreshing}
                        getFreshItems={(onHide) =>  getFreshItems(onHide)}
                        onPress={onSelectCategory}
                        loading={loading}
                        isEmpty={found ? categories.length <= 0 : true}
                        bottomDivider
                        emptyContentProps={{
                            title: found ?
                                Lng.t("categories.empty.title") :
                                Lng.t("search.noResult", { search }),
                            ...empty
                        }}
                    />
                </View>

            </MainLayout>
        </View>
    );
}
