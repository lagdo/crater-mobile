import React from 'react';
import { connect } from 'react-redux';
import * as PaymentActions from '../../actions';
import { Payments } from '../../components/Payments';
import { getCustomers } from '~/features/customers/actions';
import { getPaymentModes } from '~/features/settings/actions';
import { getPayments, getFilterPayments } from '../../selectors';

const mapStateToProps = (state) => {
    const {
        global: { language },
        customers: { customers },
        payments: {
            loading: { paymentsLoading }
        },
        settings: {
            paymentMethods,
            loading: { paymentModesLoading }
        }
    } = state;

    return {
        payments: getPayments(state),
        filterPayments: getFilterPayments(state),
        loading: paymentsLoading,
        paymentModesLoading,
        language,
        customers,
        paymentMethods,
    };
};

const mapDispatchToProps = {
    getPayments: PaymentActions.getPayments,
    getCustomers: getCustomers,
    getPaymentModes: getPaymentModes
};

//  connect
const PaymentsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Payments);

export default PaymentsContainer;
