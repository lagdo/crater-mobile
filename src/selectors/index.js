import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { schemas, storage } from './schemas';
import { formatCountries, formatTaxTypes } from '~/api/global';

const countryList = (state) => state.customers.countries;
const currencyList = (state) => state.global.currencies;
const languageList = (state) => state.global.languages;
const timezoneList = (state) => state.global.timezones;
const dateFormatList = (state) => state.global.dateFormats;
const fiscalYearList = (state) => state.global.fiscalYears;
const taxTypeList = (state) => state.global.taxTypes;
const paymentMethodList = (state) => state.settings.paymentMethods;
const unitList = (state) => state.settings.units;

export const getEntities = (ids) => denormalize(ids, schemas, storage.entities);

export const getCountries = createSelector(
    [ countryList ],
    (countries) => {
        const entities = getEntities({ countries });
        return formatCountries(entities.countries);
    },
);

export const getCurrencies = createSelector(
    [ currencyList ],
    (currencies) => {
        const entities = getEntities({ currencies });
        return entities.currencies.map((currency) => {
            const { name, code, symbol } = currency;
            return {
                title: name,
                subtitle: {
                    title: code,
                },
                rightTitle: symbol || '-',
                fullItem: currency
            };
        });
    }
);

export const getLanguages = createSelector(
    [ languageList ],
    (languages) => languages ? languages.map((language) => {
        const { name } = language;
        return {
            title: name,
            leftAvatar: name.toUpperCase().charAt(0),
            fullItem: language
        };
    }) : []
);

export const getTimezones = createSelector(
    [ timezoneList ],
    (timezones) => timezones ? timezones.map((timezone) => {
        return {
            title: timezone.key,
            fullItem: timezone
        };
    }) : []
);

export const getDateFormats = createSelector(
    [ dateFormatList ],
    (dateFormats) => dateFormats ? dateFormats.map((format) => {
        const { display_date } = format;
        return {
            title: display_date,
            fullItem: format
        };
    }) : []
);

export const getFiscalYears = createSelector(
    [ fiscalYearList ],
    (fiscalYears) => fiscalYears ? fiscalYears.map((year) => {
        const { key } = year;
        return {
            title: key,
            fullItem: year
        };
    }): []
);

export const getPaymentMethods = createSelector(
    [ paymentMethodList ],
    (paymentMethods) => paymentMethods ? paymentMethods.map((method) => {
        const { name } = method;
        return {
            title: name,
            fullItem: method,
        }
    }): []
);

export const getUnits = createSelector(
    [ unitList ],
    (units) => units ? units.map((unit) => {
        const { name } = unit;
        return {
            title: name,
            fullItem: unit,
        };
    }): []
);

export const getUnitsForSelect = createSelector(
    [ unitList ],
    (units) => units ? units.map((unit) => {
        const { id, name } = unit;
        return {
            label: name,
            value: id
        };
    }): []
);

export const getTaxTypes = createSelector(
    [ taxTypeList ],
    (taxTypes) => {
        const entities = getEntities({ taxTypes });
        return formatTaxTypes(entities.taxTypes);
    },
);
