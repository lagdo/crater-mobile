import React from 'react';
import { connect } from 'react-redux';
import * as PaymentsAction from '../../actions';
import { Payments } from '../../components/Payments';
import { getCustomers } from '~/features/customers/actions';
import { getPaymentModes } from '~/features/settings/actions';

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
    };
};

const mapDispatchToProps = {
    getPayments: PaymentsAction.getPayments,
    getCustomers: getCustomers,
    getPaymentModes: getPaymentModes
};

//  connect
const PaymentsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Payments);

export default PaymentsContainer;
