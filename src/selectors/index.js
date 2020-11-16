import { createSelector } from 'reselect';
import { formatCountries } from '~/api/global';

const countryList = (state) => state.customers.countries;

export const getCountries = createSelector(
    [ countryList ],
    (countries) => formatCountries(countries),
);
