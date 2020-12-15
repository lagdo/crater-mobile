import { schema, normalize, denormalize } from 'normalizr';

// Normalizr schemas
const country = new schema.Entity('countries');
const currency = new schema.Entity('currencies');
const payment_method = new schema.Entity('payment_methods');

const taxType = new schema.Entity('taxTypes');
const tax = new schema.Entity('taxes', { taxType });

const company = new schema.Entity('company');
const customer = new schema.Entity('customers', { currency });

const unit = new schema.Entity('units');
const item = new schema.Entity('items', { unit, taxes: [tax] });

const invoice_template = new schema.Entity('invoice_templates');
const invoice_item = new schema.Entity('invoice_items', {},
    { idAttribute: item => `${item.invoice_id}_${item.id}` });

const invoiceEntities = {
    user: customer,
    invoiceTemplate: invoice_template,
    items: [invoice_item],
    taxes: [tax],
};
const invoiceOptions = {};
const invoice = new schema.Entity('invoices', invoiceEntities, invoiceOptions);

const estimate_template = new schema.Entity('estimate_templates');
const estimate_item = new schema.Entity('estimate_items', {},
    { idAttribute: item => `${item.estimate_id}_${item.id}` });

const estimateEntities = {
    user: customer,
    estimateTemplate: estimate_template,
    items: [estimate_item],
    taxes: [tax],
};
const estimateOptions = {};
const estimate = new schema.Entity('estimates', estimateEntities, estimateOptions);

const payment = new schema.Entity('payments', {
    user: customer,
    paymentMethod: payment_method,
});

const category = new schema.Entity('categories');
const expense = new schema.Entity('expenses', { category });

const storage = {
    schemas: {
        company,
        taxTypes: [taxType],
        units: [unit],
        payment_methods: [payment_method],
        customers: [customer],
        items: [item],
        invoices: [invoice],
        payments: [payment],
        estimates: [estimate],
        expenses: [expense],
        categories: [category],
        currencies: [currency],
        countries: [country],
        invoice_templates: [invoice_template],
        estimate_templates: [estimate_template],
    },
    entities: {
        company: {},
        taxTypes: {},
        units: {},
        payment_methods: {},
        customers: {},
        items: {},
        invoices: {},
        payments: {},
        estimates: {},
        expenses: {},
        categories: {},
        currencies: {},
        countries: {},
        invoice_templates: {},
        estimate_templates: {},
    },
};

export const getEntities = (ids) => denormalize(ids, storage.schemas, storage.entities);

const storeEntities = (entities) => {
    for (field in entities) {
        storage.entities[field] = { ...storage.entities[field], ...entities[field] };
    }
};

export const saveCountries = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

/*
 * Global bootstrap
 */
export const saveGlobalBootstrap = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

/*
 * Preferences
 */
export const savePreferences = ({ preferences }) => {
    const { entities, result } = normalize(preferences, storage.schemas);
    storeEntities(entities);
    return result;
};

/*
 * Get a currency by id
 */
export const getCurrency = (id) => storage.entities.currencies[id] || null;

/*
 * Taxes
 */
export const saveTaxes = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const saveTax = (taxType) => {
    const { entities } = normalize({ taxTypes: [ taxType ] }, storage.schemas);
    storeEntities(entities);
};

export const deleteTax = (id) => {
    delete storage.entities.taxTypes[id];
};

/*
 * Items
 */
export const saveItems = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    console.log({ storage });
    return result;
};

export const saveItem = (item) => {
    const { entities } = normalize({ items: [ item ] }, storage.schemas);
    storeEntities(entities);
};

export const deleteItem = (id) => {
    delete storage.entities.items[id];
};

/*
 * Customers
 */
export const saveCustomers = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const saveCustomer = (customer) => {
    const { entities } = normalize({ customers: [customer] }, storage.schemas);
    storeEntities(entities);
};

export const deleteCustomer = (id) => {
    delete storage.entities.customers[id];
};

/*
 * Invoices
 */
export const saveInvoices = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const saveInvoice = (invoice) => {
    const { entities } = normalize({ invoices: [ invoice ] }, storage.schemas);
    storeEntities(entities);
};

export const deleteInvoice = (id) => {
    delete storage.entities.invoices[id];
};

/*
 * Payments
 */
export const savePayments = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const savePayment = (payment, invoice) => {
    const { entities } = normalize({ payments: [ payment ] }, storage.schemas);
    storeEntities(entities);
    invoice && saveInvoice(invoice);
};

export const deletePayment = (id, invoice) => {
    delete storage.entities.payments[id];
    invoice && saveInvoice(invoice);
};

/*
 * Estimates
 */
export const saveEstimates = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const saveEstimate = (estimate) => {
    const { entities } = normalize({ estimates: [ estimate ] }, storage.schemas);
    storeEntities(entities);
};

export const deleteEstimate = (id) => {
    delete storage.entities.estimates[id];
};

/*
 * Expenses
 */
export const saveExpenses = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const saveExpense = (expense) => {
    const { entities } = normalize({ expenses: [expense] }, storage.schemas);
    storeEntities(entities);
};

export const deleteExpense = (id) => {
    delete storage.entities.expenses[id];
};

/*
 * Categories
 */
export const saveCategories = (payload) => {
    const { entities, result } = normalize(payload, storage.schemas);
    storeEntities(entities);
    return result;
};

export const saveCategory = (category) => {
    const { entities } = normalize({ categories: [category] }, storage.schemas);
    storeEntities(entities);
};

export const deleteCategory = (id) => {
    delete storage.entities.categories[id];
};
