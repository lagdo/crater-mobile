import { createSelector } from 'reselect';
import { formatExpense, formatExpenseCategoryForSelect } from '~/selectors/format';

const currentCurrency = (state) => state.global.currency;

const expenseList = (state) => state.expenses.expenses;
const filterExpenseList = (state) => state.expenses.filterExpenses;
const categoryList = (state) => state.settings.categories;

export const getExpenses = createSelector(
    [ expenseList, currentCurrency ],
    (expenses, currency) => expenses.map((expense) => formatExpense(expense, currency))
);

export const getFilterExpenses = createSelector(
    [ filterExpenseList, currentCurrency ],
    (expenses, currency) => expenses.map((expense) => formatExpense(expense, currency))
);

export const getCategories = createSelector(
    [ categoryList ],
    (categories) => categories.map((category) => formatExpenseCategoryForSelect(category))
);
