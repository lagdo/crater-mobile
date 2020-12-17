import { createSelector } from 'reselect';
import { getEntities } from '~/selectors/schemas';
import { formatExpenseCategory } from '~/selectors/format';

const categoryList = (state) => state.categories.categories;

export const getCategories = createSelector(
    [ categoryList ],
    (categories) => {
        const entities = getEntities({ categories });
        return entities.categories.map((category) => formatExpenseCategory(category));
    },
);
