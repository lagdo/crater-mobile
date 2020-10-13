import React from 'react';
import { connect } from 'react-redux';
import { Invoices } from '../../components/Invoices';
import * as InvoicesAction from '../../actions';
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
    };
};

const mapDispatchToProps = {
    getInvoices: InvoicesAction.getInvoices,
    clearInvoices: InvoicesAction.clearInvoices,
    setInvoiceActiveTab: InvoicesAction.setInvoiceActiveTab,
    getCustomers: getCustomers
};

//  connect
const InvoicesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Invoices);

export default InvoicesContainer;
