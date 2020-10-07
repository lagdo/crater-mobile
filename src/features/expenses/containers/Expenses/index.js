import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import * as ExpensesAction from '../../actions'
import * as CategoriesAction from '../../../categories/actions';
import { Expenses } from '../../components/Expenses';
import { EXPENSE_SEARCH } from '../../constants';

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
        formValues: getFormValues(EXPENSE_SEARCH)(state) || {},
    };
};

const mapDispatchToProps = {
    getExpenses: ExpensesAction.getExpenses,
    getCategories: CategoriesAction.getExpenseCategories,
};
//  Redux Forms
const ExpensesSearchReduxForm = reduxForm({
    form: EXPENSE_SEARCH
})(Expenses);

//  connect
const ExpensesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ExpensesSearchReduxForm);

export default ExpensesContainer;
