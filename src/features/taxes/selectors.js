import { createSelector } from 'reselect';
import { formatTaxTypes } from '~/api/global';

const taxTypeList = (state) => state.global.taxTypes;

export const getTaxTypes = createSelector(
    [ taxTypeList ],
    (taxTypes) => formatTaxTypes(taxTypes)
);
