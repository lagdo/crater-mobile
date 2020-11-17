import React from 'react';
import { connect } from 'react-redux';
import { CUSTOMER_ADD } from '../../constants';
import * as customerAction from '../../actions'
import { Customer } from '../../components/Customer';
import { getCurrencies } from '~/selectors/index';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language, currency },
        customers: {
            loading: {
                customerLoading,
                getEditCustomerLoading,
            }
        }
    } = state;

    const { customerId = null, type = CUSTOMER_ADD, onSelect = null } = params;

    return {
        id: customerId,
        onSelect,
        type,
        language,
        currencies: getCurrencies(state),
        currency,
        customerLoading,
        getEditCustomerLoading,
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

//  connect
const CustomerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Customer);

export default CustomerContainer;
