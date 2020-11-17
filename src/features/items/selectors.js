import { createSelector } from 'reselect';
import { formatProduct } from '~/selectors/format';

const currentCurrency = (state) => state.global.currency;
const productList = (state) => state.items.items;
const filterProductList = (state) => state.items.filterItems;

export const getProducts = createSelector(
    [ productList, currentCurrency ],
    (products, currency) => {
        if(products === null) {
            return [];
        }
        return products.map((product) => formatProduct(product, currency));
    }
);

export const getFilterProducts = createSelector(
    [ filterProductList, currentCurrency ],
    (products, currency) => products.map((product) => formatProduct(product, currency))
);
