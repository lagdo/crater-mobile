import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { validate } from './validation';
import * as PaymentAction from '../../actions';
import { PAYMENT_FORM, PAYMENT_ADD } from '../../constants';
import { Payment } from '../../components/Payment';
import { getCustomers } from '../../../customers/actions';

const mapStateToProps = (state, { route: { params = {} } }) => {

    const {
        customers: { customers },
        global: { language },
        payments: {
            loading: {
                initPaymentLoading,
                paymentLoading,
                getUnpaidInvoicesLoading,
            }
        }
    } = state

    const { id = null, type = PAYMENT_ADD, invoice = null, hasRecordPayment = false } = params;

    return {
        id,
        type,
        customers,
        language: language,
        invoice,
        hasRecordPayment,
        initPaymentLoading,
        paymentLoading,
        getUnpaidInvoicesLoading,
        formValues: getFormValues(PAYMENT_FORM)(state) || {},

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
    getCustomers: getCustomers,
};


//  Redux Forms
const addEditPaymentReduxForm = reduxForm({
    form: PAYMENT_FORM,
    validate: (val) => validate(val),
})(Payment);

//  connect
const AddEditPaymentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(addEditPaymentReduxForm);

export default AddEditPaymentContainer;
