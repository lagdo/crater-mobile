import React from 'react';
import { connect } from 'react-redux';
import * as ItemsAction from '../../actions'
import { Items } from '../../components/Items';
import { getItemUnits } from '../../../settings/actions';

const mapStateToProps = (state) => {
    const {
        more: { loading },
        items: { items, filterItems },
        global: { currency, language },
        settings: {
            units,
            loading: { itemUnitsLoading }
        }
    } = state;

    return {
        items,
        filterItems,
        loading: loading.itemsLoading,
        language,
        currency,
        units,
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
