import React from 'react';
import { connect } from 'react-redux';
import { Customers } from '../../components/Customers';
import * as CustomersAction from '../../actions';

const mapStateToProps = (state) => {

    const {
        customers: { customers, filterCustomers, loading },
        global: { language }
    } = state;

    return {
        customers,
        filterCustomers,
        loading: loading.customersLoading,
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
