import React from 'react';
import { connect } from 'react-redux';
import * as PreferencesAction from '../../actions';
import { Preferences } from '../../components/Preferences';
import { getTimezones, getDateFormats, getFiscalYears } from '~/selectors/index';

const mapStateToProps = (state) => {
    const {
        settings: {
            loading: {
                getPreferencesLoading,
                editPreferencesLoading,
                getSettingItemLoading,
                editSettingItemLoading
            },
            preferences,
        },
        global: { language }
    } = state

    let isLoading = getPreferencesLoading || typeof preferences === 'undefined' || preferences === null || getSettingItemLoading

    return {
        language,
        isLoading,
        timezones: getTimezones(state),
        dateFormats: getDateFormats(state),
        fiscalYears: getFiscalYears(state),
        editPreferencesLoading,
        editSettingItemLoading,
        initialValues: !isLoading ? {
            currency: preferences.selectedCurrency,
            language: preferences.selectedLanguage,
            time_zone: preferences.time_zone,
            date_format: preferences.carbon_date_format,
            carbon_date_format: preferences.carbon_date_format,
            moment_date_format: preferences.moment_date_format,
            fiscal_year: preferences.fiscal_year
        } : {},
    };
};

const mapDispatchToProps = {
    getPreferences: PreferencesAction.getPreferences,
    editPreferences: PreferencesAction.editPreferences,
    clearPreferences: PreferencesAction.clearPreferences,
    getSettingItem: PreferencesAction.getSettingItem,
    editSettingItem: PreferencesAction.editSettingItem
};

//  connect
const PreferencesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Preferences);

export default PreferencesContainer;
