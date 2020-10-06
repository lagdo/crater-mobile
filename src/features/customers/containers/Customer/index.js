import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { validate } from './validation';
import { CUSTOMER_FORM, CUSTOMER_ADD } from '../../constants';
import * as customerAction from '../../actions'
import { Customer } from '../../components/Customer';


const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language, currencies, currency },
        customers: {
            countries,
            loading: {
                customerLoading,
                getEditCustomerLoading,
                countriesLoading
            }
        }
    } = state;

    const { customerId = null, type = CUSTOMER_ADD, onSelect = null } = params;

    return {
        id: customerId,
        onSelect,
        formValues: getFormValues(CUSTOMER_FORM)(state) || {},
        type,
        language,
        currencies,
        currency,
        countries,
        customerLoading,
        getEditCustomerLoading,
        countriesLoading,

        initialValues: {
            enable_portal: false,
            currency_id: null,
            id: customerId,
        }
    };
};

const mapDispatchToProps = {
    createCustomer: customerAction.createCustomer,
    editCustomer: customerAction.editCustomer,
    getEditCustomer: customerAction.getEditCustomer,
    removeCustomer: customerAction.removeCustomer,
    getCountries: customerAction.getCountries,
};

//  Redux Forms
const addEditCustomerReduxForm = reduxForm({
    form: CUSTOMER_FORM,
    validate,
})(Customer);

//  connect
const AddEditCustomerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(addEditCustomerReduxForm);

export default AddEditCustomerContainer;
