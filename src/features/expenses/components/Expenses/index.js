// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { MainLayout, ListView } from '~/components';
import { ROUTES } from '~/navigation/routes';
import { IMAGES } from '~/config';
import Lng from '~/api/lang/i18n';
import { EXPENSE_ADD, EXPENSE_EDIT } from '../../constants';

const defaultParams = {
    search: '',
    expense_category_id: '',
    from_date: '',
    to_date: '',
};

let filterRefs = {};

type IProps = {
    navigation: Object,
    getExpenses: Function,
    expenses: Object,
    loading: Boolean,
}

export const Expenses = (props: IProps) => {
    const {
        navigation,
        expenses,
        filterExpenses,
        loading,
        currency,
        categories,
        getExpenses,
    } = props

    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, lastPage: 1 });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [selectedFromDateValue, setSelectedFromDateValue] = useState('');
    const [selectedToDateValue, setSelectedToDateValue] = useState('');

    useEffect(() => {
        const { getCategories } = props;

        getCategories();

        getItems({ fresh: true });
    }, []);

    const onAddExpense = () => {
        navigation.navigate(ROUTES.EXPENSE, { type: EXPENSE_ADD });
        onResetFilter();
    };

    const onExpenseSelect = ({ id }) => {
        navigation.navigate(ROUTES.EXPENSE, { type: EXPENSE_EDIT, id });
        onResetFilter();
    };

    const getItems = ({ fresh = false, onResult, filter = false, params } = {}) => {
        if (refreshing) {
            return;
        }

        setRefreshing(true);
        setFresh(fresh);

        const paginationParams = fresh ? { ...pagination, page: 1 } : pagination;

        if (!fresh && paginationParams.lastPage < paginationParams.page) {
            return;
        }

        getExpenses({
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

    const onSearch = (keywords) => {
        onResetFilter();
        setSearch(keywords);
        getItems({ fresh: true, params: { ...defaultParams, search: keywords } });
    };

    const onResetFilter = () => setFilter(false);

    const onSubmitFilter = ({ from_date, to_date, expense_category_id }) => {
        if (from_date || to_date || expense_category_id) {
            setFilter(true);

            filterRefs.params = {
                expense_category_id,
                from_date,
                to_date,
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

    const getExpensesList = (expenses) => {
        let expensesList = []

        if (typeof expenses !== 'undefined' && expenses.length != 0) {
            expensesList = expenses.map((expense) => {
                const {
                    notes,
                    formattedExpenseDate,
                    amount,
                    category
                } = expense;

                return {
                    title: category.name ? category.name[0].toUpperCase() +
                        category.name.slice(1) : '',
                    subtitle: {
                        title: notes,
                    },
                    amount,
                    currency,
                    rightSubtitle: formattedExpenseDate,
                    fullItem: expense,
                };
            });
        }
        return expensesList
    }

    const getCategoriesList = (categories) => {
        let CategoriesList = []
        if (typeof categories !== 'undefined' && categories.length != 0) {
            CategoriesList = categories.map((category) => {
                return {
                    label: category.name,
                    value: category.id
                }
            })
        }
        return CategoriesList
    }

    const { lastPage, page } = pagination;

    const canLoadMore = lastPage >= page;

    let expensesItem = getExpensesList(expenses);
    let filterExpensesItem = getExpensesList(filterExpenses);
    let CategoriesList = getCategoriesList(categories);

    let dropdownFields = [
        {
            name: "expense_category_id",
            label: Lng.t("expenses.category"),
            fieldIcon: 'align-center',
            items: CategoriesList,
            onChangeCallback: setSelectedCategory,
            defaultPickerOptions: {
                label: Lng.t("expenses.categoryPlaceholder"),
                value: '',
            },
            selectedItem: selectedCategory,
            containerStyle: styles.selectPicker
        }
    ];
    let datePickerFields = [
        {
            name: "from_date",
            label: Lng.t("expenses.fromDate"),
            onChangeCallback: (formDate, displayDate) => {
                setSelectedFromDate(displayDate);
                setSelectedFromDateValue(formDate);
            },
            selectedDate: selectedFromDate,
            selectedDateValue: selectedFromDateValue
        },
        {
            name: "to_date",
            label: Lng.t("expenses.toDate"),
            onChangeCallback: (formDate, displayDate) => {
                setSelectedToDate(displayDate);
                setSelectedToDateValue(formDate);
            },
            selectedDate: selectedToDate,
            selectedDateValue: selectedToDateValue
        }
    ];

    const empty = (!filter && !search) ? {
        description: Lng.t("expenses.empty.description"),
        buttonTitle: Lng.t("expenses.empty.buttonTitle"),
        buttonPress: onAddExpense,
    } : {};

    const emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("expenses.empty.title") :
            Lng.t("filter.empty.filterTitle")

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    rightIcon: "plus",
                    rightIconPress: onAddExpense,
                    title: Lng.t("header.expenses")
                }}
                onSearch={onSearch}
                bottomDivider
                filterProps={{
                    onSubmitFilter: onSubmitFilter,
                    datePickerFields: datePickerFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    onResetFilter: () => onResetFilter()
                }}
                loadingProps={{ is: loading && fresh }}
            >
                <View style={styles.listViewContainer} >
                    <ListView
                        items={!filter ? expensesItem : filterExpensesItem}
                        onPress={onExpenseSelect}
                        refreshing={refreshing}
                        loading={loading}
                        isEmpty={!filter ? expensesItem.length <= 0 :
                            filterExpensesItem.length <= 0
                        }
                        canLoadMore={canLoadMore}
                        getFreshItems={(onHide) => {
                            onResetFilter()
                            getItems({
                                fresh: true,
                                onResult: onHide,
                                params: { ...defaultParams, search }
                            });
                        }}
                        getItems={loadMoreItems}
                        contentContainerStyle={{ flex: 1 }}
                        bottomDivider
                        emptyContentProps={{
                            title: emptyTitle,
                            image: IMAGES.EMPTY_EXPENSES,
                            ...empty
                        }}
                        leftSubTitleStyle={{ textAlign: "justify" }}
                    />
                </View>
            </MainLayout>
        </View>
    );
}
