import { schema, normalize } from 'normalizr';

// Normalizr schemas
const country = new schema.Entity('countries');
const currency = new schema.Entity('currencies');
const payment_method = new schema.Entity('payment_methods');
const taxType = new schema.Entity('taxTypes');

const company_address = new schema.Entity('company_addresses', { country });
const company = new schema.Entity('company', { address: company_address });

const customer_address = new schema.Entity('customer_addresses', { country });
const customer = new schema.Entity('customers',
    { currency, billing_address: customer_address, shipping_address: customer_address });

const unit = new schema.Entity('units');
const item = new schema.Entity('items', { unit });
// const item_tax = new schema.Entity('item_taxes', { taxType },
//     { idAttribute: rate => `${rate.item_id}_${rate.tax_id}` });

const invoice_template = new schema.Entity('invoice_templates');
const invoice_item_tax = new schema.Entity('invoice_item_taxes', { taxType },
    { idAttribute: rate => `${rate.invoice_item_id}_${rate.tax_id}` });
const invoice_item = new schema.Entity('invoice_items', { item, taxes: [invoice_item_tax] });
const invoice_tax = new schema.Entity('invoice_taxes', { taxType },
    { idAttribute: rate => `${rate.invoice_id}_${rate.tax_id}` });

const invoiceEntities = {
    currency,
    customer,
    template: invoice_template,
    items: [invoice_item],
    taxes: [invoice_tax],
};
const invoiceOptions = {};
const invoice = new schema.Entity('invoices', invoiceEntities, invoiceOptions);

const estimate_template = new schema.Entity('estimate_templates');
const estimate_item_tax = new schema.Entity('estimate_item_taxes', { taxType },
    { idAttribute: rate => `${rate.estimate_item_id}_${rate.tax_id}` });
const estimate_item = new schema.Entity('estimate_items', { item, taxes: [estimate_item_tax] });
const estimate_tax = new schema.Entity('estimate_taxes', { taxType },
    { idAttribute: rate => `${rate.estimate_id}_${rate.tax_id}` });

const estimateEntities = {
    currency,
    customer,
    template: estimate_template,
    items: [estimate_item],
    taxes: [estimate_tax],
};
const estimateOptions = {};
const estimate = new schema.Entity('estimates', estimateEntities, estimateOptions);

const payment = new schema.Entity('payments', { customer, invoice, payment_method });

const expense_category = new schema.Entity('expense_categories');
const expense = new schema.Entity('expenses', { category: expense_category });

export const schemas = {
    company,
    taxTypes: [taxType],
    units: [unit],
    paymentMethods: [payment_method],
    customers: [customer],
    items: [item],
    invoices: [invoice],
    payments: [payment],
    estimates: [estimate],
    expenses: [expense],
    categories: [expense_category],
    currencies: [currency],
    countries: [country],
    invoice_templates: [invoice_template],
    estimate_templates: [estimate_template],
};

export const storage = {};

export const saveCountries = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    storage.entities.countries = entities.countries;
    return result;
}

/*
 * Global bootstrap
 */
export const saveGlobalBootstrap = (payload) => {
    const { entities, result } = normalize(payload, schemas.global);

    // Initial setup for entities
    storage.entities = entities;
    return result;
};

/*
 * Preferences
 */
export const savePreferences = ({ preferences }) => {
    const { entities, result } = normalize(preferences, schemas);

    storage.entities.currencies = { ...storage.entities.currencies, ...entities.currencies };
    return result;
};

/*
 * Get a currency by id
 */
export const getCurrency = (id) => storage.entities.currencies[id] || null;

/*
 * Taxes
 */
const mergeTaxes = ({ taxTypes }) => {
    storage.entities.taxTypes = { ...storage.entities.taxTypes, ...taxTypes };
};

export const saveTaxes = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    mergeTaxes(entities);
    return result;
};

export const saveTax = (taxType) => {
    const { entities } = normalize({ taxTypes: [ taxType ] }, schemas);

    mergeTaxes(entities);
};

export const deleteTax = (id) => {
    storage.entities.taxTypes[id] = null;
};

/*
 * Items
 */
const mergeItems = ({ items/*, units*/ }) => {
    storage.entities.items = { ...storage.entities.items, ...items };
    // storage.entities.units = { ...storage.entities.units, ...units };
};

export const saveItems = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    mergeItems(entities);
    return result;
};

export const saveItem = (item) => {
    const { entities } = normalize({ items: [ item ] }, schemas);

    mergeItems(entities);
};

export const deleteItem = (id) => {
    storage.entities.items[id] = null;
};

/*
 * Customers
 */
const mergeCustomers = ({ customers, /*currencies, */customer_addresses }) => {
    storage.entities.customers = {...storage.entities.customers, ...customers };
    // storage.entities.currencies = {...storage.entities.currencies, ...currencies };
    storage.entities.customer_addresses = { ...storage.entities.customer_address, ...customer_addresses };
};

export const saveCustomers = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    mergeCustomers(entities);
    return result;
};

export const saveCustomer = (customer) => {
    const { entities } = normalize({ customers: [customer] }, schemas);

    mergeCustomers(entities);
};

export const deleteCustomer = (id) => {
    if (storage.entities.customers[id]) {
        storage.entities.customers[id] = null;
    }
};

/*
 * Invoices
 */
const mergeInvoices = (entities) => {
    const { invoices, /*items, taxTypes, customers, currencies, templates,*/
        invoice_items, invoice_item_taxes, invoice_taxes } = entities;
    storage.entities.invoices = { ...storage.entities.invoices, ...invoices };
    // storage.entities.items = { ...storage.entities.items, ...items };
    // storage.entities.taxes = { ...storage.entities.taxes, ...taxes };
    // storage.entities.customers = { ...storage.entities.customers, ...customers };
    // storage.entities.currencies = { ...storage.entities.currencies, ...currencies };
    // storage.entities.templates = { ...storage.entities.templates, ...templates };
    storage.entities.invoice_items = { ...storage.entities.invoice_items, ...invoice_items };
    storage.entities.invoice_item_taxes = { ...storage.entities.invoice_item_taxes, ...invoice_item_taxes };
    storage.entities.invoice_taxes = { ...storage.entities.invoice_taxes, ...invoice_taxes };
};

export const saveInvoices = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    mergeInvoices(entities);
    return result;
};

export const saveInvoice = (invoice) => {
    const { entities } = normalize({ invoices: [ invoice ] }, schemas);

    mergeInvoices(entities);
};

export const deleteInvoice = (id) => {
    if (storage.entities.invoices[id]) {
        storage.entities.invoices[id] = null;
    }
};

/*
 * Payments
 */
const mergePayments = ({ payments, invoices/*, customers, currencies, payment_methods*/ }) => {
    storage.entities.payments = { ...storage.entities.payments, ...payments };
    storage.entities.invoices = { ...invoices, ...storage.entities.invoices }; // !! Don't replace existing invoices.
    // storage.entities.customers = { ...storage.entities.customers, ...customers };
    // storage.entities.currencies = { ...storage.entities.currencies, ...currencies };
    // storage.entities.payment_methods = { ...storage.entities.payment_methods, ...payment_methods };
};

export const savePayments = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    mergePayments(entities);
    return result;
};

export const savePayment = (payment, invoice) => {
    const { entities } = normalize({ payments: [ payment ] }, schemas);

    mergePayments(entities);
    invoice && saveInvoice(invoice);
};

export const deletePayment = (id, invoice) => {
    if (storage.entities.payments[id]) {
        storage.entities.payments[id] = null;
    }
    invoice && saveInvoice(invoice);
};

/*
 * Estimates
 */
const mergeEstimates = (entities) => {
    const { estimates, /*items, taxes, customers, currencies, templates,*/
        estimate_items, estimate_item_taxes, estimate_taxes } = entities;
    storage.entities.estimates = { ...storage.entities.estimates, ...estimates };
    // storage.entities.items = { ...storage.entities.items, ...items };
    // storage.entities.taxes = { ...storage.entities.taxes, ...taxes };
    // storage.entities.customers = { ...storage.entities.customers, ...customers };
    // storage.entities.currencies = { ...storage.entities.currencies, ...currencies };
    // storage.entities.templates = { ...storage.entities.templates, ...templates };
    storage.entities.estimate_items = { ...storage.entities.estimate_items, ...estimate_items };
    storage.entities.estimate_item_taxes = { ...storage.entities.estimate_item_taxes, ...estimate_item_taxes };
    storage.entities.estimate_taxes = { ...storage.entities.estimate_taxes, ...estimate_taxes };
};

export const saveEstimates = (payload) => {
    const { entities, result } = normalize(payload, schemas);

    mergeEstimates(entities);
    return result;
};

export const saveEstimate = (estimate) => {
    const { entities } = normalize({ estimates: [ estimate ] }, schemas);

    mergeEstimates(entities);
};

export const deleteEstimate = (id) => {
    if (storage.entities.estimates[id]) {
        storage.entities.estimates[id] = null;
    }
};
