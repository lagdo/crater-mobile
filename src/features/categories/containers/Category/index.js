import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { validate } from './validation';
import * as CategoryAction from '../../actions';
import { Category } from '../../components/Category';
import { CATEGORY_FORM, CATEGORY_ADD } from '../../constants';

const mapStateToProps = (state, { route: { params = {} } }) => {

    const {
        global: { language },
        settings: {
            loading: {
                expenseCategoryLoading,
                initExpenseCategoryLoading,
            }
        }
    } = state;

    const {
        categoryId: id = null,
        type = CATEGORY_ADD,
        onSelect: onFirstTimeCreateExpense = null,
    } = params;

    return {
        id,
        type,
        language,
        categoryLoading: expenseCategoryLoading,
        getEditCategoryLoading: initExpenseCategoryLoading,
        onFirstTimeCreateExpense,
        formValues: getFormValues(CATEGORY_FORM)(state) || {},
    };
};

const mapDispatchToProps = {
    createCategory: CategoryAction.createExpenseCategory,
    getEditCategory: CategoryAction.getEditExpenseCategory,
    editCategory: CategoryAction.editExpenseCategory,
    removeCategory: CategoryAction.removeExpenseCategory
};

//  Redux Forms
const addEditPaymentReduxForm = reduxForm({
    form: CATEGORY_FORM,
    validate,
})(Category);

//  connect
const AddEditCategoryContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(addEditPaymentReduxForm);

export default AddEditCategoryContainer;
