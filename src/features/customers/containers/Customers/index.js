import React from 'react';
import { connect } from 'react-redux';
import { Customers } from '../../components/Customers';
import * as CustomersAction from '../../actions';
import { getCustomers, getFilterCustomers } from '../../selectors';

const mapStateToProps = (state) => {
    const {
        global: { language },
        customers: {
            loading: {
                customersLoading,
            }
        },
    } = state;

    return {
        customers: getCustomers(state),
        filterCustomers: getFilterCustomers(state),
        loading: customersLoading,
        language,
    };
};

const mapDispatchToProps = {
    getCustomer: CustomersAction.getCustomers
};

//  connect
const CustomersContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Customers);

export default CustomersContainer;
