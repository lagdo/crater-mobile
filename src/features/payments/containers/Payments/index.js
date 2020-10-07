import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import * as PaymentsAction from '../../actions';
import { Payments } from '../../components/Payments';
import { PAYMENT_SEARCH } from '../../constants';
import { getCustomers } from '../../../customers/actions';
import { getPaymentModes } from '../../../settings/actions';


const mapStateToProps = (state) => {

    const {
        global: { language },
        customers: { customers },
        payments: {
            payments,
            filterPayments,
            loading: { paymentsLoading }
        },
        settings: {
            paymentMethods,
            loading: { paymentModesLoading }
        }
    } = state;

    return {
        payments,
        filterPayments,
        loading: paymentsLoading,
        paymentModesLoading,
        language,
        customers,
        paymentMethods,

        formValues: getFormValues(PAYMENT_SEARCH)(state) || {},
    };
};


const mapDispatchToProps = {
    getPayments: PaymentsAction.getPayments,
    getCustomers: getCustomers,
    getPaymentModes: getPaymentModes
};

//  Redux Forms
const paymentSearchReduxForm = reduxForm({
    form: PAYMENT_SEARCH,
})(Payments);

//  connect
const PaymentsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(paymentSearchReduxForm);

export default PaymentsContainer;
