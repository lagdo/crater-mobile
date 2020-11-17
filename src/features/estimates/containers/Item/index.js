import React from 'react';
import { connect } from 'react-redux';
import { EstimateItem } from '../../components/Item';
import * as EstimatesAction from '../../actions';
import { getItemUnits } from '~/features/settings/actions';
import { getTaxTypes } from '~/features/taxes/selectors';
import { getUnitsForSelect } from '~/selectors/index';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language },
        settings: {
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
        taxTypes: getTaxTypes(state),
        currency,
        language,
        discountPerItem,
        taxPerItem,
        type,
        units: getUnitsForSelect(state),
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
    addItem: EstimatesAction.addItem,
    setEstimateItems: EstimatesAction.setEstimateItems,
    removeEstimateItem: EstimatesAction.removeEstimateItem,
};

//  connect
const EstimateItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EstimateItem);

export default EstimateItemContainer;
