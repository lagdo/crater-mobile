import React from 'react';
import { connect } from 'react-redux';
import * as ItemsAction from '../../actions'
import { Items } from '../../components/Items';
import { getItemUnits } from '~/features/settings/actions';
import { getProducts, getFilterProducts } from '../../selectors';
import { getUnitsForSelect } from '~/selectors/index';

const mapStateToProps = (state) => {
    const {
        more: {
            loading: {
                itemsLoading
            }
        },
        global: { currency, language },
        settings: {
            loading: { itemUnitsLoading }
        }
    } = state;

    return {
        items: getProducts(state),
        filterItems: getFilterProducts(state),
        loading: itemsLoading,
        language,
        currency,
        units: getUnitsForSelect(state),
        itemUnitsLoading,
    };
};

const mapDispatchToProps = {
    getItems: ItemsAction.getItems,
    getItemUnits: getItemUnits,
};

//  connect
const ItemsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Items);

export default ItemsContainer;
