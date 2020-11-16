import { createSelector } from 'reselect';
import { formatCustomer } from '~/selectors/format';

const customerList = (state) => state.customers.customers;
const filterCustomerList = (state) => state.customers.filterCustomers;

export const getCustomers = createSelector(
    [ customerList ],
    (customers) => {
        if(customers === null) {
            return [];
        }
        return customers.map((customer) => formatCustomer(customer));
    }
);

export const getFilterCustomers = createSelector(
    [ filterCustomerList ],
    (customers) => customers.map((customer) => formatCustomer(customer))
);
