import {
    SET_GLOBAL_BOOTSTRAP,
    SET_SETTINGS,
    GLOBAL_TRIGGER_SPINNER,
    DATE_FORMAT,
    SAVE_ENDPOINT_API,
    SET_APP_VERSION,
} from '../api/consts';
import { SET_PREFERENCES } from '../features/settings/constants';
import { SET_TAX, SET_EDIT_TAX, SET_REMOVE_TAX, SET_TAXES, SET_COMPANY_INFO } from '../features/taxes/constants';

const initialState = {
    customers: [],
    currencies: [],
    languages: [],
    timezones: [],
    dateFormats: [],
    fiscalYears: [],
    language: 'en',
    timeZone: null,
    discountPerItem: false,
    taxPerItem: false,
    notifyInvoiceViewed: false,
    notifyEstimateViewed: false,
    currency: null,
    company: null,
    taxTypes: [],
    loading: false,
    dateFormat: DATE_FORMAT,
    endpointApi: null,
    endpointURL: null,
    fiscalYear: '2-1',
    appVersion: '1.0.0'
};

export default function globalReducer(state = initialState, action) {
    const { payload, type } = action;

    switch (type) {
        case GLOBAL_TRIGGER_SPINNER:
            const { appLoginLoading } = payload

            return { ...state, loading: appLoginLoading }

        case SAVE_ENDPOINT_API:

            const { endpointURL = '' } = payload

            return {
                ...state,
                endpointURL,
                endpointApi: endpointURL ? `${endpointURL}/api/` : null
            };

        case SET_COMPANY_INFO:
            return { ...state, company: payload.company }

        case SET_APP_VERSION:

            const { app_version } = payload
            return { ...state, appVersion: app_version }

        case SET_GLOBAL_BOOTSTRAP:
            const {
                currencies,
                customers,
                default_currency,
                company,
                taxTypes,
                moment_date_format,
                fiscal_year,
                default_language = 'en'
            } = payload

            return {
                ...state,
                currencies,
                customers,
                currency: default_currency,
                company,
                dateFormat: moment_date_format,
                taxTypes,
                fiscalYear: fiscal_year,
                language: default_language
            };

        case SET_TAXES:
            return { ...state, taxTypes: payload.taxTypes };

        case SET_TAX:
            return {
                ...state,
                taxTypes: [payload.taxType, ...state.taxTypes]
            };

        case SET_EDIT_TAX:
            const taxTypeList = state.taxTypes.filter((item) => (item.id !== payload.taxId))

            return {
                ...state,
                taxTypes: [payload.taxType, ...taxTypeList]
            };

        case SET_REMOVE_TAX:
            const remainTaxes = state.taxTypes.filter(({ fullItem }) =>
                (fullItem.id !== payload.taxId))

            return { ...state, taxTypes: remainTaxes };

        case SET_SETTINGS:
            const { key, value } = payload.settings;

            if (key) {
                if (key === 'discount_per_item') {
                    return {
                        ...state,
                        discountPerItem: value === 'YES' ? true : false
                    };
                }
                if (key === 'tax_per_item') {
                    return {
                        ...state,
                        taxPerItem: value === 'YES' ? true : false
                    };
                }
                if (key === 'notify_invoice_viewed') {
                    return {
                        ...state,
                        notifyInvoiceViewed: value === 'YES' ? true : false
                    };
                }
                if (key === 'notify_estimate_viewed') {
                    return {
                        ...state,
                        notifyEstimateViewed: value === 'YES' ? true : false
                    };
                }
            }
            else {
                const { settings: { currency, language, time_zone, moment_date_format, fiscal_year } } = payload;
                const newCurrency = state.currencies.find((item) => item.id.toString() === currency.toString());

                return {
                    ...state,
                    language,
                    timeZone: time_zone,
                    dateFormat: moment_date_format,
                    fiscalYear: fiscal_year,
                    currency: newCurrency,
                };
            }

        case SET_PREFERENCES:
            const { preferences } = payload;
            return {
                ...state,
                currencies: preferences.currencies,
                languages: preferences.languages,
                timezones: preferences.time_zones,
                dateFormats: preferences.date_formats,
                fiscalYears: preferences.fiscal_years,
            };

        default:
            return state;
    }
}
