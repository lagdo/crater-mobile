import React from 'react';
import { connect } from 'react-redux';
import { Customers } from '../../components/Customers';
import * as CustomersAction from '../../actions';
import { reduxForm, getFormValues } from 'redux-form';
import { CUSTOMER_SEARCH } from '../../constants';

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
        formValues: getFormValues(CUSTOMER_SEARCH)(state) || {},
    };
};

const mapDispatchToProps = {
    getCustomer: CustomersAction.getCustomers
};

//  Redux Forms
const customerSearchReduxForm = reduxForm({
    form: CUSTOMER_SEARCH,
})(Customers);

//  connect
const CustomersContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(customerSearchReduxForm);

export default CustomersContainer;
