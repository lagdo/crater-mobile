import React from 'react';
import queryString from 'query-string';
import Lng from '~/api/lang/i18n';

// Forms
// -----------------------------------------
export const CUSTOMER_SEARCH = 'customers/CUSTOMER_SEARCH';
export const CUSTOMER_FORM = 'customers/CUSTOMER_FORM';
export const CUSTOMER_ADDRESS = 'customers/CUSTOMER_ADDRESS';

// Type
// -----------------------------------------
export const CUSTOMER_ADD = 'customers/CUSTOMER_ADD';
export const CUSTOMER_EDIT = 'customers/CUSTOMER_EDIT';

// Actions
// -----------------------------------------
export const GET_CUSTOMERS = 'customers/GET_CUSTOMERS';
export const SET_CUSTOMERS = 'customers/SET_CUSTOMERS';
export const SET_FILTER_CUSTOMERS = 'customers/SET_FILTER_CUSTOMERS';
export const CREATE_CUSTOMER = 'customers/CREATE_CUSTOMER';
export const SET_CREATE_CUSTOMER = 'customers/SET_CREATE_CUSTOMER';
export const EDIT_CUSTOMER = 'customers/EDIT_CUSTOMER';
export const SET_EDIT_CUSTOMER = 'customers/SET_EDIT_CUSTOMER';
export const SET_REMOVE_CUSTOMER = 'customers/SET_REMOVE_CUSTOMER';
export const GET_EDIT_CUSTOMER = 'customers/GET_EDIT_CUSTOMER';

export const CUSTOMERS_TRIGGER_SPINNER = 'customers/CUSTOMERS_TRIGGER_SPINNER';
export const REMOVE_CUSTOMER = 'customers/REMOVE_CUSTOMER';


// Address Country
// -----------------------------------------
export const GET_COUNTRIES = 'address/GET_COUNTRIES';
export const SET_COUNTRIES = 'address/SET_COUNTRIES';


export const ACTIONS_VALUE = {
    REMOVE: 'remove',

}

export const CUSTOMER_ACTIONS = () => {
    return [
        {
            label: Lng.t("customers.removeCustomer")
            ,
            value: ACTIONS_VALUE.REMOVE
        }
    ];
}


// Endpoint Api URL
// -----------------------------------------

export const GET_CUSTOMERS_URL = (param) => `customers?${queryString.stringify({
    ...param,
    orderByField: 'created_at',
    orderBy: 'desc'
})}`

export const GET_EDIT_CUSTOMER_URL = (id) => `customers/${id}/edit`
export const GET_COUNTRIES_URL = () => `countries`

export const CREATE_CUSTOMER_URL = () => `customers`
export const EDIT_CUSTOMER_URL = (id) => `customers/${id}`
export const REMOVE_CUSTOMER_URL = (id) => `customers/${id}`
