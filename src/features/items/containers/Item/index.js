import React from 'react';
import { connect } from 'react-redux';
import { Item } from '../../components/Item';
import * as ItemAction from '../../actions';
import { EDIT_ITEM } from '../../constants';
import { getItemUnits, getSettingItem } from '~/features/settings/actions';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        more: { loading },
        items: { item },
        settings: {
            taxByItems,
            units,
            loading: { itemUnitsLoading, itemLoading }
        },
        global: { language, currency, taxTypes },
    } = state;

    const { id: itemId = {}, type } = params;

    const isLoading = itemLoading || itemUnitsLoading || (type === EDIT_ITEM && !item)

    return {
        loading: isLoading,
        itemId,
        taxTypes,
        taxByItems,
        language,
        type,
        currency,
        units,
        initialValues: {
            taxes: [],
            quantity: 1,
            discount_type: 'none',
            ...item
        },
    };
};

const mapDispatchToProps = {
    addItem: ItemAction.addItem,
    editItem: ItemAction.editItem,
    getEditItem: ItemAction.getEditItem,
    removeItem: ItemAction.removeItem,
    clearItem: ItemAction.clearItem,
    getItemUnits: getItemUnits,
    getSettingItem: getSettingItem,
};

//  connect
const ItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Item);

export default ItemContainer;
