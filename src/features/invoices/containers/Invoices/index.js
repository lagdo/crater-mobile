import React from 'react';
import { connect } from 'react-redux';
import { Invoices } from '../../components/Invoices';
import { reduxForm, getFormValues } from 'redux-form';
import * as InvoicesAction from '../../actions';
import { INVOICE_SEARCH } from '../../constants';
import { getCustomers } from '../../../customers/actions';

const mapStateToProps = (state) => {

    const {
        global: { language },
        customers: { customers },
        invoices: {
            invoices,
            loading: { invoicesLoading }
        }
    } = state;

    return {
        invoices,
        loading: invoicesLoading,
        language,
        customers,
        formValues: getFormValues(INVOICE_SEARCH)(state) || {},

    };
};

const mapDispatchToProps = {
    getInvoices: InvoicesAction.getInvoices,
    clearInvoices: InvoicesAction.clearInvoices,
    setInvoiceActiveTab: InvoicesAction.setInvoiceActiveTab,
    getCustomers: getCustomers
};

//  Redux Forms
const invoiceSearchReduxForm = reduxForm({
    form: INVOICE_SEARCH,
})(Invoices);

//  connect
const InvoicesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(invoiceSearchReduxForm);

export default InvoicesContainer;
