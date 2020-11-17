import {
    CUSTOMERS_TRIGGER_SPINNER,
    SET_CUSTOMERS,
    SET_COUNTRIES,
    SET_CREATE_CUSTOMER,
    SET_EDIT_CUSTOMER,
    SET_REMOVE_CUSTOMER,
    SET_FILTER_CUSTOMERS
} from '../constants';

const initialState = {
    customers: [],
    filterCustomers: [],
    countries: [],
    errors: null,
    loading: {
        customersLoading: false,
        customerLoading: false,
        getEditCustomerLoading: false,
        countriesLoading: false
    }
};

export default function customersReducer(state = initialState, action) {
    const { payload, type } = action;

    switch (type) {


        case SET_CUSTOMERS:

            let { customers, fresh } = payload;
            if (!fresh) {
                return {
                    ...state,
                    customers: [...state.customers, ...customers]
                };
            }

            return { ...state, customers: customers };

        case SET_FILTER_CUSTOMERS:
            if (!payload.fresh) {
                return {
                    ...state,
                    filterCustomers: [...state.filterCustomers, ...payload.customers]
                };
            }

            return { ...state, filterCustomers: filterCustomerList };

        case SET_EDIT_CUSTOMER:
            const customersList = state.customers.filter((item) => (item.id !== payload.id));

            return {
                ...state,
                customers: [payload.customer, ...customersList]
            };

        case SET_CREATE_CUSTOMER:
            return {
                ...state,
                customers: [payload.customer, ...state.customers]
            };

        case SET_REMOVE_CUSTOMER:
            const remainCustomers = state.customers.filter(({ fullItem }) =>
                (fullItem.id !== payload.id))

            return { ...state, customers: remainCustomers };

        case SET_COUNTRIES:
            return { ...state, ...payload };

        case CUSTOMERS_TRIGGER_SPINNER:
            return { ...state, loading: { ...payload } };

        default:
            return state;
    }
}
