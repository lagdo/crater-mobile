import React from 'react';
import { connect } from 'react-redux';
import * as CategoriesAction from '../../actions';
import { Categories } from '../../components/Categories';

const mapStateToProps = ({ global, settings, categories }) => ({
    language: global.language,
    loading: settings.loading.expensesCategoryLoading,
    categories: categories.categories
});

const mapDispatchToProps = {
    getExpenseCategories: CategoriesAction.getExpenseCategories,
};

//  connect
const CategoriesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Categories);

export default CategoriesContainer;
