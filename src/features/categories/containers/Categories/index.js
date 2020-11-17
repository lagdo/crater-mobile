import React from 'react';
import { connect } from 'react-redux';
import * as CategoriesAction from '../../actions';
import { Categories } from '../../components/Categories';
import { getCategories } from '../../selectors';

const mapStateToProps = (state) => {
    const {
        global: {
            language
        },
        settings: {
            loading: {
                expensesCategoryLoading
            }
        },
    } = state;

    return {
        language,
        loading: expensesCategoryLoading,
        categories: getCategories(state),
    };
};

const mapDispatchToProps = {
    getExpenseCategories: CategoriesAction.getExpenseCategories,
};

//  connect
const CategoriesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Categories);

export default CategoriesContainer;
