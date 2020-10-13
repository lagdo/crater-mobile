import React from 'react';
import { connect } from 'react-redux';
import * as ExpensesAction from '../../actions'
import * as CategoriesAction from '~/features/categories/actions';
import { Expenses } from '../../components/Expenses';

const mapStateToProps = (state) => {
    const {
        global: { language, currency },
        expenses: {
            expenses,
            filterExpenses,
            loading: { expensesLoading }
        },
        settings: { categories }
    } = state;

    return {
        loading: expensesLoading,
        expenses,
        filterExpenses,
        language,
        currency,
        categories,
    };
};

const mapDispatchToProps = {
    getExpenses: ExpensesAction.getExpenses,
    getCategories: CategoriesAction.getExpenseCategories,
};

//  connect
const ExpensesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Expenses);

export default ExpensesContainer;
