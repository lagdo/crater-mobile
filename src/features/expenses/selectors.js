import { createSelector } from 'reselect';
import { getEntities } from '~/selectors/schemas';
import { formatExpense, formatExpenseCategoryForSelect } from '~/selectors/format';

const currentCurrency = (state) => state.global.currency;

const expenseList = (state) => state.expenses.expenses;
const filterExpenseList = (state) => state.expenses.filterExpenses;
const categoryList = (state) => state.categories.categories;

export const getExpenses = createSelector(
    [ expenseList, currentCurrency ],
    (expenses, currency) => {
        const entities = getEntities({ expenses });
        return entities.expenses.map((expense) => formatExpense(expense, currency));
    }
);

export const getFilterExpenses = createSelector(
    [ filterExpenseList, currentCurrency ],
    (expenses, currency) => {
        const entities = getEntities({ expenses });
        return entities.expenses.map((expense) => formatExpense(expense, currency));
    },
);

export const getCategories = createSelector(
    [ categoryList ],
    (categories) => {
        const entities = getEntities({ categories });
        return entities.categories.map((category) => formatExpenseCategoryForSelect(category));
    },
);
