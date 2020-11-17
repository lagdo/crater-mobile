import React from 'react';
import { connect } from 'react-redux';
import * as PaymentAction from '../../actions';
import { PAYMENT_ADD } from '../../constants';
import { Payment } from '../../components/Payment';
import * as CustomersAction from '~/features/customers/actions';
import { getCustomers } from '~/features/customers/selectors';

const mapStateToProps = (state, { route: { params = {} } }) => {

    const {
        global: { language },
        payments: {
            loading: {
                initPaymentLoading,
                paymentLoading,
                getUnpaidInvoicesLoading,
            }
        }
    } = state;

    const {
        paymentId: id = null,
        type = PAYMENT_ADD,
        invoice = null,
        hasRecordPayment = false,
    } = params;

    return {
        id,
        type,
        customers: getCustomers(state),
        language,
        invoice,
        hasRecordPayment,
        initPaymentLoading,
        paymentLoading,
        getUnpaidInvoicesLoading,
        initialValues: {
            payment_method_id: null
        }
    };

};

const mapDispatchToProps = {
    getCreatePayment: PaymentAction.getCreatePayment,
    createPayment: PaymentAction.createPayment,
    getEditPayment: PaymentAction.getEditPayment,
    getUnpaidInvoices: PaymentAction.getUnpaidInvoices,
    editPayment: PaymentAction.editPayment,
    removePayment: PaymentAction.removePayment,
    sendPaymentReceipt: PaymentAction.sendPaymentReceipt,
    getCustomers: CustomersAction.getCustomers,
};

//  connect
const PaymentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Payment);

export default PaymentContainer;
