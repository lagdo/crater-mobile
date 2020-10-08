import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Expense } from '../../components/Expense';
import * as ExpensesAction from '../../actions';
import { EXPENSE_EDIT, EXPENSE_ADD } from '../../constants';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { company, endpointURL, language },
        expenses: { loading, categories, expense } = {}
    } = state;

    const { id = null, type = EXPENSE_ADD } = params;
    const isLoading = loading.initExpenseLoading || (type === EXPENSE_EDIT && !expense)
        || !categories || categories.length <= 0

    return {
        id,
        language,
        categories,
        company,
        endpointURL,
        initLoading: isLoading,
        loading: loading.expenseLoading,
        type,
        initialValues: !isLoading && {
            expense_date: moment(),
            ...expense
        }
    };
};

const mapDispatchToProps = {
    getCategories: ExpensesAction.getCategories,
    createExpense: ExpensesAction.createExpense,
    editExpense: ExpensesAction.editExpense,
    getEditExpense: ExpensesAction.getEditExpense,
    getCreateExpense: ExpensesAction.getCreateExpense,
    clearExpense: ExpensesAction.clearExpense,
    removeExpense: ExpensesAction.removeExpense,
    getReceipt: ExpensesAction.getReceipt,
};

//  connect
const ExpenseContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Expense);

export default ExpenseContainer;
