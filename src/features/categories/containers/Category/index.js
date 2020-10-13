import React from 'react';
import { connect } from 'react-redux';
import * as CategoryAction from '../../actions';
import { Category } from '../../components/Category';
import { CATEGORY_ADD } from '../../constants';

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
    };
};

const mapDispatchToProps = {
    createCategory: CategoryAction.createExpenseCategory,
    getEditCategory: CategoryAction.getEditExpenseCategory,
    editCategory: CategoryAction.editExpenseCategory,
    removeCategory: CategoryAction.removeExpenseCategory
};

//  connect
const AddEditCategoryContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Category);

export default AddEditCategoryContainer;
