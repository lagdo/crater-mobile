import { createSelector } from 'reselect';
import { getEntities } from '~/selectors/index';
import { formatProduct } from '~/selectors/format';

const currentCurrency = (state) => state.global.currency;
const itemList = (state) => state.items.items;
const filterItemList = (state) => state.items.filterItems;

export const getProducts = createSelector(
    [ itemList, currentCurrency ],
    (items, currency) => {
        if(items === null) {
            return [];
        }
        const entities = getEntities({ items });
        return entities.items.map((item) => formatProduct(item, currency));
    }
);

export const getFilterProducts = createSelector(
    [ filterItemList, currentCurrency ],
    (items, currency) => {
        if(items === null) {
            return [];
        }
        const entities = getEntities({ items });
        return entities.items.map((item) => formatProduct(item, currency));
    }
);
