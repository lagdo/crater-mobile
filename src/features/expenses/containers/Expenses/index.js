import React from 'react';
import { connect } from 'react-redux';
import * as ExpensesAction from '../../actions'
import * as CategoriesAction from '~/features/categories/actions';
import { Expenses } from '../../components/Expenses';
import { getExpenses, getFilterExpenses, getCategories } from '../../selectors';

const mapStateToProps = (state) => {
    const {
        global: { language },
        expenses: {
            loading: { expensesLoading }
        },
    } = state;

    return {
        loading: expensesLoading,
        language,
        expenses: getExpenses(state),
        filterExpenses: getFilterExpenses(state),
        categories: getCategories(state),
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
