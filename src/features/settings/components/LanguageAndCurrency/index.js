// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import {
    DefaultLayout,
    CtButton,
    SelectField,
} from '../../../../components';
import { Field, change } from 'redux-form';
import Lng from '../../../../api/lang/i18n';
import { EDIT_LANGUAGE_AND_CURRENCY } from '../../constants';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { SymbolStyle } from '../../../../components/CurrencyFormat/styles';
import { headerTitle } from '../../../../api/helper';

type IProps = {
    navigation: Object,
    handleSubmit: Function,
    handleSubmit: Function,
    formValues: Object,
    languages: Object,
    timezones: Object,
    dateFormats: Object,
    currencies: Object,
    getPreferencesLoading: Boolean,
    getSettingItemLoading: Boolean
}

export const LanguageAndCurrency = (props: IProps) =>  {
    const {
        navigation,
        getPreferences,
        editPreferences,
        clearPreferences,
        editPreferencesLoading,
        currencies,
        handleSubmit,
        formValues: {
            currency,
        },
        formValues,
        isLoading,
    } = props;

    const [currencyList, setCurrencyList] = useState([]);
    const [languageList, setLanguageList] = useState([]);

    useEffect(() => {
        getPreferences({
            onResult: (val) => {
                const { currencies, languages } = val
                setCurrencyList(getCurrenciesList(currencies))
                setLanguageList(getLanguagesList(languages))
            }
        })

        goBack(MOUNT, navigation);

        return () => goBack(UNMOUNT);
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(EDIT_LANGUAGE_AND_CURRENCY, field, value));
    };

    const onSubmit = (values) => {
        clearPreferences()
        editPreferences({ params: values, navigation, currencies })
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(onSubmit)}
                    btnTitle={Lng.t("button.save")}
                    loading={editPreferencesLoading}
                />
            </View>
        )
    }

    const getCurrenciesList = (currencies) => {
        let currencyList = []
        if (typeof currencies !== 'undefined' && currencies.length != 0) {
            currencyList = currencies.map((currency) => {

                const { name, code, symbol } = currency
                return {
                    title: name,
                    subtitle: {
                        title: code,
                    },
                    rightTitle: symbol || '-',
                    fullItem: currency
                }
            })
        }
        return currencyList
    }

    const getLanguagesList = (languages) => {
        let languageList = []
        if (typeof languages !== 'undefined' && languages) {
            languageList = languages.map((language) => {

                let { name } = language
                return {
                    title: name,
                    leftAvatar: name.toUpperCase().charAt(0),
                    fullItem: language
                }
            })
        }
        return languageList
    }

    const getSelectedField = (items, find, field) => {
        let newData = []
        if (typeof items !== 'undefined') {

            newData = items.filter((item) => {
                let filterData = false
                let itemField = item.fullItem ?
                    item.fullItem[field].toString() : item[field].toString()

                if (itemField === find)
                    filterData = true

                return filterData
            });

        }

        if (newData.length !== 0) {
            let { name } = newData[0].fullItem
            return name
        }
        return '  '
    }

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: Lng.t("header.setting.LanguageAndCurrency"),
                placement: "center",
                rightIcon: "save",
                rightIconProps: {
                    solid: true,
                },
                rightIconPress: handleSubmit(onSubmit),
                titleStyle: styles.titleStyle
            }}
            bottomAction={BOTTOM_ACTION(handleSubmit)}
            loadingProps={{
                is: isLoading || currencyList.length === 0 || languageList.length === 0
            }}
        >

            <View style={styles.mainContainer}>

                <Field
                    name="language"
                    items={languageList}
                    component={SelectField}
                    label={Lng.t("settings.preferences.language")}
                    icon='language'
                    rightIcon='angle-right'
                    displayName="name"
                    placeholder={formValues.language ?
                        getSelectedField(languageList, formValues.language, 'code') :
                        Lng.t("settings.preferences.languagePlaceholder")
                    }
                    navigation={navigation}
                    fakeInputProps={{
                        valueStyle: styles.selectedField,
                        placeholderStyle: styles.selectedField,
                    }}
                    searchFields={['name']}
                    compareField="code"
                    onSelect={(val) => {
                        setFormField('language', val.code)
                    }}
                    headerProps={{
                        title: Lng.t("languages.title"),
                        rightIconPress: null
                    }}
                    listViewProps={{
                        hasAvatar: true,
                    }}
                    emptyContentProps={{
                        contentType: "languages",
                    }}
                    isRequired
                />

                <Field
                    name="currency"
                    items={currencyList}
                    displayName="name"
                    component={SelectField}
                    label={Lng.t("settings.preferences.currency")}
                    icon='dollar-sign'
                    rightIcon='angle-right'
                    placeholder={currency ?
                        getSelectedField(currencyList, currency, 'id') :
                        Lng.t("settings.preferences.currencyPlaceholder")
                    }
                    navigation={navigation}
                    searchFields={['name']}
                    compareField="id"
                    fakeInputProps={{
                        valueStyle: styles.selectedField,
                        placeholderStyle: styles.selectedField,
                    }}
                    searchInputProps={{
                        autoFocus: true
                    }}
                    onSelect={(val) => {
                        setFormField('currency', val.id)
                    }}
                    headerProps={{
                        title: Lng.t("currencies.title"),
                        titleStyle: headerTitle({ marginLeft: -20, marginRight: -52 }),
                        rightIconPress: null
                    }}
                    emptyContentProps={{
                        contentType: "currencies",
                    }}
                    isRequired
                    listViewProps={{
                        contentContainerStyle: { flex: 5 },
                        rightTitleStyle: SymbolStyle
                    }}
                />

            </View>
        </DefaultLayout>
    );
}
