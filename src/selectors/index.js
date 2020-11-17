import { createSelector } from 'reselect';
import { formatCountries } from '~/api/global';

const countryList = (state) => state.customers.countries;
const currencyList = (state) => state.global.currencies;
const languageList = (state) => state.global.languages;

export const getCountries = createSelector(
    [ countryList ],
    (countries) => formatCountries(countries),
);

export const getCurrencies = createSelector(
    [ currencyList ],
    (currencies) => currencies.map((currency) => {
        const { name, code, symbol } = currency;
        return {
            title: name,
            subtitle: {
                title: code,
            },
            rightTitle: symbol || '-',
            fullItem: currency
        };
    })
);

export const getLanguages = createSelector(
    [ languageList ],
    (languages) => languages.map((language) => {
        const { name } = language;
        return {
            title: name,
            leftAvatar: name.toUpperCase().charAt(0),
            fullItem: language
        };
    })
);
