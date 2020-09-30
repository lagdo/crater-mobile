import queryString from 'query-string';
import Lng from "../../api/lang/i18n";
import { colors } from "../../styles/colors";
import Lng from '../../api/lang/i18n';

//  Forms
// -----------------------------------------
export const INVOICE_SEARCH = 'invoiceForm/INVOICE_SEARCH';
export const INVOICE_FORM = 'invoiceForm/INVOICE_EDIT';
export const ITEM_FORM = 'item/ITEM_FORM';

// Type
// -----------------------------------------
export const INVOICE_ADD = 'invoiceForm/INVOICE_ADD';
export const INVOICE_EDIT = 'invoiceForm/INVOICE_EDIT';

// Actions
// -----------------------------------------
export const INVOICES_TRIGGER_SPINNER = 'invoice/INVOICES_TRIGGER_SPINNER';
export const GET_INVOICES = 'invoice/GET_INVOICES';
export const SET_INVOICES = 'invoice/SET_INVOICES';

export const CLEAR_INVOICES = 'invoice/CLEAR_INVOICES';
export const CLEAR_INVOICE = 'invoice/CLEAR_INVOICE';
export const GET_CREATE_INVOICE = 'invoice/GET_CREATE_INVOICE';
export const GET_EDIT_INVOICE = 'invoice/GET_EDIT_INVOICE';
export const SET_INVOICE = 'invoice/SET_INVOICE';
export const SET_EDIT_INVOICE = 'invoice/SET_EDIT_INVOICE';
export const CREATE_INVOICE = 'invoice/CREATE_INVOICE';
export const EDIT_INVOICE = 'invoice/EDIT_INVOICE';
export const REMOVE_INVOICE = 'invoice/REMOVE_INVOICE';
export const REMOVE_FROM_INVOICES = 'invoice/REMOVE_FROM_INVOICES';
export const CHANGE_INVOICE_STATUS = 'invoice/CHANGE_INVOICE_STATUS';
export const SET_ACTIVE_TAB = 'invoice/SET_ACTIVE_TAB';

// Items
// -----------------------------------------
export const SET_EDIT_INVOICE_ITEMS = 'invoice/SET_EDIT_INVOICE_ITEMS';
export const REMOVE_INVOICE_ITEM = 'invoice/REMOVE_INVOICE_ITEM';
export const REMOVE_INVOICE_ITEMS = 'invoice/REMOVE_INVOICE_ITEMS';
export const ADD_ITEM = 'invoice/ADD_ITEM';
export const EDIT_ITEM = 'invoice/EDIT_ITEM';
export const GET_ITEMS = 'invoice/GET_ITEMS';
export const SET_ITEMS = 'invoice/SET_ITEMS';
export const SET_INVOICE_ITEMS = 'invoice/SET_INVOICE_ITEMS';
export const REMOVE_ITEM = 'invoice/REMOVE_ITEM';
export const ITEM_ADD = 'invoice/ITEM_ADD';
export const ITEM_EDIT = 'invoice/ITEM_EDIT';

export const ITEM_DISCOUNT_OPTION = [
    {
        key: 'none',
        label: 'None',
    },
    {
        key: 'fixed',
        label: 'Fixed',
    },
    {
        key: 'percentage',
        label: 'Percentage',
    },
];

export const INVOICE_DISCOUNT_OPTION = [
    {
        value: 'percentage',
        label: 'Percentage',
        displayLabel: '%',
    },
];


export const INVOICES_TABS = {
    DUE: 'DUE',
    DRAFT: 'DRAFT',
    ALL: 'ALL',
};

export const TAB_NAME = (name) => {
    return Lng.t(`invoices.tabs.${name}`)
};

// Filter Invoice Mode
// -----------------------------------------
export const FILTER_INVOICE_STATUS = [
    { label: 'DRAFT', value: 'DRAFT' },
    { label: 'SENT', value: 'SENT' },
    { label: 'VIEWED', value: 'VIEWED' },
    { label: 'OVERDUE', value: 'DUE' },
    { label: 'COMPLETED', value: 'COMPLETED' },
]

export const FILTER_INVOICE_PAID_STATUS = [
    { label: 'UNPAID', value: 'UNPAID' },
    { label: 'PAID', value: 'PAID' },
    { label: 'PARTIALLY PAID', value: 'PARTIALLY_PAID' },
]

export const INVOICES_STATUS = {
    OVERDUE: 'danger',
    DRAFT: 'warning',
    PAID: 'success',
};

export const INVOICES_STATUS_BG_COLOR = {
    DRAFT: colors.warningLight,
    SENT: colors.warningLight2,
    VIEWED: colors.infoLight,
    OVERDUE: colors.dangerLight,
    COMPLETED: colors.successLight2,
    UNPAID: colors.warningLight,
    PAID: colors.successLight2,
    PARTIALLY_PAID: colors.infoLight,
};

export const INVOICES_STATUS_TEXT_COLOR = {
    DRAFT: colors.warningDark,
    SENT: colors.warningDark2,
    VIEWED: colors.infoDark,
    OVERDUE: colors.dangerDark,
    COMPLETED: colors.successDark,
    UNPAID: colors.warningDark,
    PAID: colors.successDark,
    PARTIALLY_PAID: colors.infoDark,
};

// ActionSheet Actions
// -----------------------------------------

export const INVOICE_ACTIONS = {
    VIEW: 'download',
    SEND: 'send',
    EDIT: 'edit',
    DELETE: 'delete',
    RECORD_PAYMENT: 'recordPayment',
    MARK_AS_SENT: 'markAsSent',
    CLONE: 'clone',
}

export const EDIT_INVOICE_ACTIONS = (SentStatus = false, completeStatus = false) => {

    const markActions = [
        {
            label: Lng.t("invoices.actions.sendInvoice"),
            value: INVOICE_ACTIONS.SEND
        },
        {
            label: Lng.t("invoices.actions.markAsSent"),
            value: INVOICE_ACTIONS.MARK_AS_SENT
        }
    ]

    const paymentAction = [{
        label: Lng.t("invoices.actions.recordPayment"),
        value: INVOICE_ACTIONS.RECORD_PAYMENT
    }]

    const deleteAction = [{
        label: Lng.t("invoices.actions.delete"),
        value: INVOICE_ACTIONS.DELETE
    }]

    const cloneAction = [{
        label: Lng.t("invoices.actions.clone"),
        value: INVOICE_ACTIONS.CLONE
    }]

    if (SentStatus) {
        return [
            ...cloneAction,
            ...paymentAction,
            ...deleteAction
        ]
    }
    else if (completeStatus) {
        return [
            ...cloneAction,
            ...deleteAction
        ]
    }
    else {
        return [
            ...markActions,
            ...cloneAction,
            ...paymentAction,
            ...deleteAction
        ]
    }

};

// Endpoint Api URL
// -----------------------------------------

export const GET_INVOICES_URL = (type, param) => `invoices?status=${type}&${queryString.stringify({
    ...param,
    orderByField: 'created_at',
    orderBy: 'desc'
})}`

export const GET_ITEMS_URL = (q, search, page, limit) => `items?search=${q ? q : search}&page=${page}&limit=${limit}`

export const CREATE_INVOICE_URL = () => `invoices`
export const EDIT_INVOICE_URL = (invoice) => `invoices/${invoice.id}`
export const REMOVE_INVOICE_URL = (id) => `invoices/${id}`

export const CREATE_ITEM_URL = () => `items`
export const EDIT_ITEM_URL = (item_id) => `items/${item_id}`

export const GET_EDIT_INVOICE_URL = (id) => `invoices/${id}/edit`
export const GET_CREATE_INVOICE_URL = () => `invoices/create`

export const CHANGE_INVOICE_STATUS_URL = (action) => `invoices/${action}`
