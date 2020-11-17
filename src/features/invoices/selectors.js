import React from 'react';
import { createSelector } from 'reselect';
import { formatInvoice } from '~/selectors/format';

const templateList = (state) => state.global.templates.invoice;

const invoiceList = (state) => state.invoices.invoices;
const filterInvoiceList = (state) => state.invoices.filterInvoices;

export const getTemplates = createSelector(
    [ templateList ],
    (templates) => templates || []
);

export const getInvoices = createSelector(
    [ invoiceList ],
    (invoices) => invoices.map((invoice) => formatInvoice(invoice))
);

export const getFilterInvoices = createSelector(
    [ filterInvoiceList ],
    (invoices) => invoices.map((invoice) => formatInvoice(invoice))
);
