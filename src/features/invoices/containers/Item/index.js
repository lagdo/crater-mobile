import React from 'react';
import { connect } from 'react-redux';
import { InvoiceItem } from '../../components/Item';
import * as InvoicesAction from '../../actions';
import { getItemUnits } from '~/features/settings/actions';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language, taxTypes },
        settings: {
            units,
            loading: { itemUnitsLoading, editItemLoading, removeItemLoading }
        }
    } = state;

    const {
        item = {},
        type,
        currency,
        discount_per_item: discountPerItem,
        tax_per_item: taxPerItem,
    } = params;

    const isLoading = editItemLoading || removeItemLoading || itemUnitsLoading

    return {
        loading: isLoading,
        itemId: item && (item.item_id || item.id),
        taxTypes,
        currency,
        language,
        discountPerItem,
        taxPerItem,
        type,
        units,
        initialValues: {
            price: null,
            quantity: 1,
            discount_type: 'none',
            discount: 0,
            taxes: [],
            ...item
        },
    };
};

const mapDispatchToProps = {
    getItemUnits: getItemUnits,
    addItem: InvoicesAction.addItem,
    setInvoiceItems: InvoicesAction.setInvoiceItems,
    removeInvoiceItem: InvoicesAction.removeInvoiceItem,
};

//  connect
const InvoiceItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(InvoiceItem);

export default InvoiceItemContainer;
