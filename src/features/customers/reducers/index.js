import {
    CUSTOMERS_TRIGGER_SPINNER,
    SET_CUSTOMERS,
    SET_COUNTRIES,
    SET_CREATE_CUSTOMER,
    SET_EDIT_CUSTOMER,
    SET_REMOVE_CUSTOMER,
    SET_FILTER_CUSTOMERS
} from '../constants';
import { saveCustomers, saveCustomer, deleteCustomer } from '~/selectors/schemas';


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
        {
            const { customers, fresh } = saveCustomers(payload);
            if (!fresh) {
                return {
                    ...state,
                    customers: [...state.customers, ...customers]
                };
            }

            return { ...state, customers: customers };
        }
        case SET_FILTER_CUSTOMERS:
        {
            const { customers, fresh } = saveCustomers(payload);
            if (!fresh) {
                return {
                    ...state,
                    filterCustomers: [...state.filterCustomers, ...customers]
                };
            }

            return { ...state, filterCustomers: customers };
        }
        case SET_EDIT_CUSTOMER:
        {
            const { customer } = payload;
            saveCustomer(customer);

            return {
                ...state,
                customers: [ ...state.customers ],
            };
        }
        case SET_CREATE_CUSTOMER:
        {
            const { customer } = payload;
            saveCustomer(customer);

            return {
                ...state,
                customers: [ customer.id, ...state.customers ],
            };
        }
        case SET_REMOVE_CUSTOMER:
        {
            const { id } = payload;
            deleteCustomer(id);

            return { ...state, customers: state.customers.filter(cId => cId !== id) };
        }
        case SET_COUNTRIES:
        {
            const entities = saveCountries(payload);
            return { ...state, countries: entities.countries };
        }
        case CUSTOMERS_TRIGGER_SPINNER:
            return { ...state, loading: { ...payload } };

        default:
            return state;
    }
}
