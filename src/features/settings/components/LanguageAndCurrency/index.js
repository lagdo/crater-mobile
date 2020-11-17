// @flow

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import {
    DefaultLayout,
    CtButton,
    SelectField,
} from '~/components';
import Lng from '~/api/lang/i18n';
import { SymbolStyle } from '~/components/CurrencyFormat/styles';
import { headerTitle } from '~/api/helper';
import { validate } from '../../containers/LanguageAndCurrency/validation';

type IProps = {
    navigation: Object,
    handleSubmit: Function,
    handleSubmit: Function,
    languages: Object,
    timezones: Object,
    dateFormats: Object,
    currencies: Object,
    getPreferencesLoading: Boolean,
    getSettingItemLoading: Boolean
}

export const LanguageAndCurrency = (props: IProps) => {
    const {
        navigation,
        getPreferences,
        editPreferences,
        clearPreferences,
        editPreferencesLoading,
        currencies,
        languages,
        isLoading,
        initialValues,
    } = props;

    useEffect(() => {
        if (currencies.length === 0 || languages.length === 0) {
            getPreferences({ onResult: null });
        }
    }, []);

    const onSubmit = (values) => {
        clearPreferences()
        editPreferences({ params: values, navigation })
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("button.save")}
                    loading={editPreferencesLoading}
                />
            </View>
        )
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
        <Form validate={validate} initialValues={initialValues} onSubmit={onSubmit}>
        { ({ form, handleSubmit }) => (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: Lng.t("header.setting.LanguageAndCurrency"),
                    placement: "center",
                    rightIcon: "save",
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                    titleStyle: styles.titleStyle
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{
                    is: isLoading || currencies.length === 0 || languages.length === 0
                }}
            >
                <View style={styles.mainContainer}>
                    <Field
                        name="language"
                        items={languages}
                        component={SelectField}
                        label={Lng.t("settings.preferences.language")}
                        icon='language'
                        rightIcon='angle-right'
                        displayName="name"
                        placeholder={form.getState().values?.language ?
                            getSelectedField(languages, form.getState().values.language, 'code') :
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
                            form.change('language', val.code)
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
                        items={currencies}
                        displayName="name"
                        component={SelectField}
                        label={Lng.t("settings.preferences.currency")}
                        icon='dollar-sign'
                        rightIcon='angle-right'
                        placeholder={form.getState().values?.currency ?
                            getSelectedField(currencies, form.getState().values.currency, 'id') :
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
                            form.change('currency', val.id)
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
        )}
        </Form>
    );
}
