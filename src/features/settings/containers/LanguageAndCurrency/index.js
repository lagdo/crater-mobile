import React from 'react';
import { connect } from 'react-redux';
import * as PreferencesAction from '../../actions';
import { LanguageAndCurrency } from '../../components/LanguageAndCurrency';

const mapStateToProps = (state) => {
    const {
        settings: {
            loading: {
                getPreferencesLoading,
                editPreferencesLoading,
            },
            preferences
        },
        global: { language, currencies }
    } = state

    let isLoading = getPreferencesLoading || typeof preferences === 'undefined' || preferences === null

    return {
        language,
        isLoading,
        currencies,
        editPreferencesLoading,
        initialValues: !isLoading ? {
            currency: preferences.selectedCurrency,
            language: preferences.selectedLanguage,
            time_zone: preferences.time_zone,
            date_format: preferences.carbon_date_format,
            carbon_date_format: preferences.carbon_date_format,
            moment_date_format: preferences.moment_date_format,
            fiscal_year: preferences.fiscal_year
        } : null
    };
};

const mapDispatchToProps = {
    getPreferences: PreferencesAction.getPreferences,
    editPreferences: PreferencesAction.editPreferences,
    clearPreferences: PreferencesAction.clearPreferences,
};

//  connect
const LanguageAndCurrencyContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(LanguageAndCurrency);

export default LanguageAndCurrencyContainer;
