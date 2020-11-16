import { ESTIMATES_STATUS_BG_COLOR, ESTIMATES_STATUS_TEXT_COLOR } from '~/features/estimates/constants';
import { INVOICES_STATUS_BG_COLOR, INVOICES_STATUS_TEXT_COLOR } from '~/features/invoices/constants';

export const formatTax = (tax, amount = undefined, currency = undefined) => {
    const { name, percent, description } = tax;

    return {
        title: name,
        subtitle: {
            title: description,
        },
        amount,
        currency,
        rightSubtitle: `${percent} %`,
        fullItem: { ...tax, rate: { name: tax.name, percent: tax.percent, compound: tax.compound } }
    };
};

export const formatCustomer = (customer) => {
    const { name, contact_name } = customer;

    return {
        title: name,
        subtitle: {
            title: contact_name || '',
        },
        leftAvatar: name.toUpperCase().charAt(0),
        fullItem: customer,
    };
};

export const formatEstimate = (estimate) => {
    const {
        estimate_number,
        user: { name, currency } = {},
        status,
        formattedEstimateDate,
        total,
    } = estimate;

    return {
        title: name,
        subtitle: {
            title: estimate_number,
            label: status,
            labelBgColor: ESTIMATES_STATUS_BG_COLOR[status],
            labelTextColor: ESTIMATES_STATUS_TEXT_COLOR[status],
        },
        amount: total,
        currency,
        rightSubtitle: formattedEstimateDate,
        fullItem: estimate,
    };
};

export const formatInvoice = (invoice) => {
    const {
        invoice_number,
        user: { name, currency } = {},
        status,
        formattedInvoiceDate,
        total,
    } = invoice;

    return {
        title: name,
        subtitle: {
            title: invoice_number,
            label: status,
            labelBgColor: INVOICES_STATUS_BG_COLOR[status],
            labelTextColor: INVOICES_STATUS_TEXT_COLOR[status],
        },
        amount: total,
        currency,
        rightSubtitle: formattedInvoiceDate,
        fullItem: invoice,
    };
};

export const formatPayment = (payment) => {
    const {
        notes,
        formattedPaymentDate,
        amount,
        payment_mode,
        user: { name, currency }
    } = payment;

    return {
        title: `${name}`,
        subtitle: {
            title: `${payment_mode ? '(' + payment_mode + ')' : ''}`,
        },
        amount,
        currency,
        rightSubtitle: formattedPaymentDate,
        fullItem: payment,
    };
};

export const formatProduct = (product, currency) => {
    const { name, description, price, title } = product;

    return {
        title: title || name,
        subtitle: {
            title: description,
        },
        amount: price,
        currency,
        fullItem: product,
    };
};

export const formatAvailableProduct = (product, currency) => {
    const { name, description, price } = product;

    return {
        title: name,
        subtitle: {
            title: description,
        },
        amount: price,
        currency,
        fullItem: product,
    };
};

export const formatExpense = (expense, currency) => {
    const {
        notes,
        formattedExpenseDate,
        amount,
        category
    } = expense;

    return {
        title: category.name ? category.name[0].toUpperCase() + category.name.slice(1) : '',
        subtitle: {
            title: notes,
        },
        amount,
        currency,
        rightSubtitle: formattedExpenseDate,
        fullItem: expense,
    };
};

export const formatExpenseCategory = (category) => {
    const { name, description } = category;

    return {
        title: name || '',
        subtitle: {
            title: description,
        },
        fullItem: category,
    };
};

export const formatExpenseCategoryForSelect = (category) => {
    return {
        label: category.name,
        value: category.id
    };
};
