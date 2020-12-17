import { createSelector } from 'reselect';
import { getEntities } from '~/selectors/schemas';
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
    (invoices) => {
        const entities = getEntities({ invoices });
        return entities.invoices.map((invoice) => formatInvoice(invoice));
    },
);

export const getFilterInvoices = createSelector(
    [ filterInvoiceList ],
    (invoices) => {
        const entities = getEntities({ invoices });
        return entities.invoices.map((invoice) => formatInvoice(invoice));
    },
);
