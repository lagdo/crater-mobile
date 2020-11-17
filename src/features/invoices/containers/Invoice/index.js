import React from 'react';
import { connect } from 'react-redux';
import { Invoice } from '../../components/Invoice';
import * as InvoicesAction from '../../actions';
import { INVOICE_EDIT } from '../../constants';
import moment from 'moment';
import * as CustomersAction from '~/features/customers/actions';
import { getCustomers } from '~/features/customers/selectors';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language, taxTypes },
        invoices: { invoiceItems, invoiceData, items },
        customers: {
            loading: { customersLoading, initInvoiceLoading, invoiceLoading, itemsLoading },
        },
    } = state;

    const {
        invoice = null,
        nextInvoiceNumber,
        invoiceTemplates,
        nextInvoiceNumberAttribute
    } = invoiceData;

    const { id = null, type } = params;

    let isLoading = initInvoiceLoading || (type === INVOICE_EDIT && !invoice) || !nextInvoiceNumber;

    return {
        id,
        initLoading: isLoading,
        customersLoading,
        loading: invoiceLoading,
        invoiceItems,
        invoiceData,
        items,
        type,
        customers: getCustomers(state),
        itemsLoading,
        language,
        taxTypes,
        initialValues: !isLoading ? {
            due_date: moment().add(7, 'days'),
            invoice_date: moment(),
            discount_type: 'fixed',
            discount: 0,
            taxes: [],
            invoice_template_id: invoiceTemplates[0] && invoiceTemplates[0].id,
            ...invoice,
            invoice_number: type === INVOICE_EDIT ? nextInvoiceNumber : nextInvoiceNumberAttribute,
            customer: invoice && invoice.user,
            template: invoice && invoice.invoice_template,
        } : null
    };
};

const mapDispatchToProps = {
    getCreateInvoice: InvoicesAction.getCreateInvoice,
    createInvoice: InvoicesAction.createInvoice,
    getItems: InvoicesAction.getItems,
    getEditInvoice: InvoicesAction.getEditInvoice,
    editInvoice: InvoicesAction.editInvoice,
    removeInvoiceItems: InvoicesAction.removeInvoiceItems,
    removeInvoice: InvoicesAction.removeInvoice,
    clearInvoice: InvoicesAction.clearInvoice,
    changeInvoiceStatus: InvoicesAction.changeInvoiceStatus,
    getCustomers: CustomersAction.getCustomers,
};

//  connect
const InvoiceContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Invoice);

export default InvoiceContainer;
