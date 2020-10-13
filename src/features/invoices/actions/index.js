import {
    GET_INVOICES,
    SET_INVOICES,
    CLEAR_INVOICES,
    GET_CREATE_INVOICE,
    SET_CREATE_INVOICE,
    INVOICES_TRIGGER_SPINNER,
    ADD_ITEM,
    GET_ITEMS,
    SET_ITEMS,
    SET_INVOICE_ITEMS,
    CREATE_INVOICE,
    EDIT_ITEM,
    SET_EDIT_INVOICE_ITEMS,
    REMOVE_ITEM,
    REMOVE_INVOICE_ITEM,
    GET_EDIT_INVOICE,
    SET_EDIT_INVOICE,
    EDIT_INVOICE,
    REMOVE_INVOICE_ITEMS,
    CLEAR_INVOICE,
    SET_INVOICE,
    REMOVE_INVOICE,
    REMOVE_FROM_INVOICES,
    CHANGE_INVOICE_STATUS,
    SET_ACTIVE_TAB,
} from '../constants';

export const getInvoices = (payload = {}) => ({
    type: GET_INVOICES,
    payload,
});

export const setInvoices = (payload = {}) => ({
    type: SET_INVOICES,
    payload,
});

export const clearInvoices = (payload = {}) => ({
    type: CLEAR_INVOICES,
    payload,
});

export const clearInvoice = (payload = {}) => ({
    type: CLEAR_INVOICE,
    payload,
});

export const getCreateInvoice = (payload = {}) => ({
    type: GET_CREATE_INVOICE,
    payload,
});

export const getEditInvoice = (payload = {}) => ({
    type: GET_EDIT_INVOICE,
    payload,
});

export const createInvoice = (payload = {}) => ({
    type: CREATE_INVOICE,
    payload,
});

export const editInvoice = (payload = {}) => ({
    type: EDIT_INVOICE,
    payload,
});

export const setInvoice = (payload = {}) => ({
    type: SET_INVOICE,
    payload,
});

export const setEditInvoice = (payload = {}) => ({
    type: SET_EDIT_INVOICE,
    payload,
});

export const invoiceTriggerSpinner = (payload) => ({
    type: INVOICES_TRIGGER_SPINNER,
    payload,
});

export const addItem = (payload = {}) => ({
    type: ADD_ITEM,
    payload,
});

export const getItems = (payload = {}) => ({
    type: GET_ITEMS,
    payload,
});

export const setItems = (payload = {}) => ({
    type: SET_ITEMS,
    payload,
});

export const setInvoiceItems = (payload = {}) => ({
    type: SET_INVOICE_ITEMS,
    payload,
});

export const editItem = (payload = {}) => ({
    type: EDIT_ITEM,
    payload,
});

export const setEditInvoiceItem = (payload = {}) => ({
    type: SET_EDIT_INVOICE_ITEMS,
    payload,
});

export const removeInvoice = (payload = {}) => ({
    type: REMOVE_INVOICE,
    payload,
});

export const removeFromInvoices = (payload = {}) => ({
    type: REMOVE_FROM_INVOICES,
    payload,
});

export const removeItem = (payload = {}) => ({
    type: REMOVE_ITEM,
    payload,
});

export const removeInvoiceItem = (payload = {}) => ({
    type: REMOVE_INVOICE_ITEM,
    payload,
});

export const removeInvoiceItems = () => ({
    type: REMOVE_INVOICE_ITEMS
});

export const changeInvoiceStatus = (payload = {}) => ({
    type: CHANGE_INVOICE_STATUS,
    payload,
});

export const setInvoiceActiveTab = (payload = {}) => ({
    type: SET_ACTIVE_TAB,
    payload,
});
