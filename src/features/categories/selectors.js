import { createSelector } from 'reselect';
import { formatExpenseCategory } from '~/selectors/format';

const categoryList = (state) => state.categories.categories;

export const getCategories = createSelector(
    [ categoryList ],
    (categories) => categories.map((category) => formatExpenseCategory(category))
);
