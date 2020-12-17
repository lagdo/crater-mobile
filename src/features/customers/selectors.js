import { createSelector } from 'reselect';
import { getEntities } from '~/selectors/schemas';
import { formatCustomer } from '~/selectors/format';

const customerList = (state) => state.customers.customers;
const filterCustomerList = (state) => state.customers.filterCustomers;

export const getCustomers = createSelector(
    [ customerList ],
    (customers) => {
        if(customers === null) {
            return [];
        }
        const entities = getEntities({ customers });
        return entities.customers.map((customer) => formatCustomer(customer));
    }
);

export const getFilterCustomers = createSelector(
    [ filterCustomerList ],
    (customers) => {
        if(customers === null) {
            return [];
        }
        const entities = getEntities({ customers });
        return entities.customers.map((customer) => formatCustomer(customer));
    }
);
