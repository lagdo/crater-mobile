import {
    EXPENSES_TRIGGER_SPINNER,
    SET_EXPENSES,
    CREATE_EXPENSE,
    SET_FILTER_EXPENSES
} from '../constants';
import { saveExpenses } from '~/selectors/schemas';

const initialState = {
    expenses: [],
    filterExpenses: [],
    categories: [],
    errors: null,
    customers: null,
    loading: {
        expensesLoading: false,
        expenseLoading: false,
        initExpenseLoading: false,
        categoriesLoading: false,
    },
};

export default function expensesReducer(state = initialState, action) {
    const { payload, type } = action;

    switch (type) {

        case SET_EXPENSES:
        {
            const { expenses, fresh } = saveExpenses(payload);

            if (fresh) {
                return { ...state, expenses };
            }

            return { ...state, expenses: [...state.expenses, ...expenses] };
        }
        case SET_FILTER_EXPENSES:
        {
            const { expenses, fresh } = saveExpenses(payload);

            if (fresh) {
                return { ...state, filterExpenses: expenses };
            }

            return { ...state, filterExpenses: [...state.filterExpenses, ...expenses] };
        }
        case CREATE_EXPENSE:
            return { ...state, ...payload };

        case EXPENSES_TRIGGER_SPINNER:
            return { ...state, loading: { ...state.loading, ...payload } };

        default:
            return state;
    }
}
