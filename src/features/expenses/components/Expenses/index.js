// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { change } from 'redux-form';
import styles from './styles';
import { MainLayout, ListView } from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { IMAGES } from '../../../../config';
import Lng from '../../../../api/lang/i18n';
import { EXPENSE_ADD, EXPENSE_EDIT, EXPENSE_SEARCH } from '../../constants';

let params = {
    search: '',
    expense_category_id: '',
    from_date: '',
    to_date: '',
}

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
        handleSubmit,
        categories,
        getExpenses,
        formValues: {
            from_date = '',
            to_date = '',
            expense_category_id = ''
        },
        route: { params = {} },
    } = props

    const [refreshing, setRefreshing] = useState(false);
    const [fresh, setFresh] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        lastPage: 1,
    });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [selectedFromDateValue, setSelectedFromDateValue] = useState('');
    const [selectedToDateValue, setSelectedToDateValue] = useState('');

    useEffect(() => {
        const { getCategories, navigation } = props

        getCategories()

        getItems({ fresh: true });
    }, []);

    const onExpenseSelect = ({ id }) => {
        navigation.navigate(ROUTES.EXPENSE, { type: EXPENSE_EDIT, id })
        onResetFilter()
    }

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

    const setFormField = (field, value) => {
        props.dispatch(change(EXPENSE_SEARCH, field, value));

        if (field === 'expense_category_id')
            setSelectedCategory(value)
    };

    const onSearch = (keywords) => {
        onResetFilter()
        setSearch(keywords)
        getItems({ fresh: true, params: { ...params, search: keywords } })
    };

    const onResetFilter = () => setFilter(false);

    const onSubmitFilter = ({ from_date, to_date, expense_category_id }) => {
        if (from_date || to_date || expense_category_id) {
            setFilter(true);

            getItems({
                fresh: true,
                params: {
                    ...params,
                    expense_category_id,
                    from_date,
                    to_date,
                },
                filter: true
            });
            return;
        }

        onResetFilter();
    }

    const loadMoreItems = () => {
        if (!filter) {
            getItems({ params: { ...params, search } });
            return;
        }

        getItems({
            params: {
                ...params,
                expense_category_id,
                from_date,
                to_date,
            },
            filter: true
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

    const {
        lastPage,
        page,
    } = pagination;

    const canLoadMore = lastPage >= page;

    let expensesItem = getExpensesList(expenses);
    let filterExpensesItem = getExpensesList(filterExpenses);
    let CategoriesList = getCategoriesList(categories)
    let dropdownFields = [{
        name: "expense_category_id",
        label: Lng.t("expenses.category"),
        fieldIcon: 'align-center',
        items: CategoriesList,
        onChangeCallback: (val) => {
            setFormField('expense_category_id', val)
        },
        defaultPickerOptions: {
            label: Lng.t("expenses.categoryPlaceholder"),
            value: '',
        },
        selectedItem: selectedCategory,
        containerStyle: styles.selectPicker
    }]

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
    ]

    let empty = (!filter && !search) ? {
        description: Lng.t("expenses.empty.description"),
        buttonTitle: Lng.t("expenses.empty.buttonTitle"),
        buttonPress: () => {
            navigation.navigate(ROUTES.EXPENSE, { type: EXPENSE_ADD })
            onResetFilter()
        }
    } : {}

    let emptyTitle = search ? Lng.t("search.noResult", { search })
        : (!filter) ? Lng.t("expenses.empty.title") :
            Lng.t("filter.empty.filterTitle")

    const { isLoading } = params;

    return (
        <View style={styles.container}>
            <MainLayout
                headerProps={{
                    rightIcon: "plus",
                    rightIconPress: () => {
                        navigation.navigate(ROUTES.EXPENSE, { type: EXPENSE_ADD })
                        onResetFilter()
                    },
                    title: Lng.t("header.expenses")
                }}
                onSearch={onSearch}
                bottomDivider
                filterProps={{
                    onSubmitFilter: handleSubmit(onSubmitFilter),
                    datePickerFields: datePickerFields,
                    dropdownFields: dropdownFields,
                    clearFilter: props,
                    onResetFilter: () => onResetFilter()
                }}
                loadingProps={{ is: isLoading || (loading && fresh) }}
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
                                params: { ...params, search }
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
