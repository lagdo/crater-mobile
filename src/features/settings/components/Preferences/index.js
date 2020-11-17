// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import {
    DefaultLayout,
    CtButton,
    SelectField,
    ToggleSwitch,
    CtDivider
} from '~/components';
import Lng from '~/api/lang/i18n';
import { headerTitle } from '~/api/helper';
import { validate } from '../../containers/Preferences/validation';

type IProps = {
    navigation: Object,
    handleSubmit: Function,
    handleSubmit: Function,
    languages: Object,
    timezones: Object,
    dateFormats: Object,
    currencies: Object,
}

export const Preferences = (props: IProps) => {
    const {
        navigation,
        isLoading,
        timezones,
        dateFormats,
        fiscalYears,
        getPreferences,
        getSettingItem,
        editPreferences,
        clearPreferences,
        editPreferencesLoading,
        editSettingItemLoading,
        editSettingItem,
        initialValues,
    } = props

    const [discountPerItem, setDiscountPerItem] = useState(null);
    const [taxPerItem, setTaxPerItem] = useState(null);
    const [visibleToast, setVisibleToast] = useState(false);

    const hasEmptyList = timezones.length === 0 || dateFormats.length === 0 || fiscalYears.length === 0;

    useEffect(() => {
        if (hasEmptyList) {
            getPreferences({ onResult: null });
        }

        getSettingItem({
            key: 'discount_per_item',
            onResult: (val) => setDiscountPerItem(val !== null ? val : 'NO')
        });

        getSettingItem({
            key: 'tax_per_item',
            onResult: (val) => setTaxPerItem(val !== null ? val : 'NO')
        });
    }, []);

    const onSubmitPreferences = (values) => {
        if (!(editPreferencesLoading || editSettingItemLoading)) {
            clearPreferences()
            editPreferences({ params: values, navigation })
        }
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

    const saveDiscountPerItem = (val) => {
        editSettingItem({
            params: {
                key: 'discount_per_item',
                value: val === true ? 'YES' : 'NO'
            },
            onResult: toggleToast
        })
    }

    const saveTaxPerItem = (val) => {
        editSettingItem({
            params: {
                key: 'tax_per_item',
                value: val === true ? 'YES' : 'NO'
            },
            onResult: toggleToast
        })
    }

    const toggleToast = () => setVisibleToast(true)

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={onSubmitPreferences}>
            { ({ form, handleSubmit }) => (
                <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: Lng.t("header.setting.preferences"),
                    placement: "center",
                    rightIcon: "save",
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{
                    is: isLoading || hasEmptyList || discountPerItem === null || taxPerItem === null
                }}
                toastProps={{
                    message: Lng.t("settings.preferences.settingUpdate"),
                    visible: visibleToast
                }}
            >
                <View style={styles.mainContainer}>
                    <Field
                        name="time_zone"
                        items={timezones}
                        displayName="key"
                        component={SelectField}
                        label={Lng.t("settings.preferences.timeZone")}
                        icon='clock'
                        rightIcon='angle-right'
                        placeholder={form.getState().values?.time_zone ?
                            form.getState().values.time_zone :
                            Lng.t("settings.preferences.timeZonePlaceholder")
                        }
                        fakeInputProps={{
                            valueStyle: styles.selectedField,
                            placeholderStyle: styles.selectedField,
                        }}
                        navigation={navigation}
                        searchFields={['key']}
                        compareField="value"
                        onSelect={({ value }) => form.change('time_zone', value)}
                        headerProps={{
                            title: Lng.t("timeZones.title"),
                            titleStyle: headerTitle({ marginLeft: -23, marginRight: -40 }),
                            rightIconPress: null
                        }}
                        emptyContentProps={{
                            contentType: "timeZones",
                        }}
                        isRequired
                    />

                    <Field
                        name="date_format"
                        items={dateFormats}
                        displayName="display_date"
                        component={SelectField}
                        label={Lng.t("settings.preferences.dateFormat")}
                        icon='calendar-alt'
                        rightIcon='angle-right'
                        placeholder={Lng.t("settings.preferences.dateFormatPlaceholder")}
                        fakeInputProps={{
                            valueStyle: styles.selectedField,
                            placeholderStyle: styles.selectedField,
                        }}
                        navigation={navigation}
                        searchFields={['display_date']}
                        compareField="carbon_format_value"
                        onSelect={({ carbon_format_value, moment_format_value }) => {
                            form.change('carbon_date_format', carbon_format_value)
                            form.change('moment_date_format', moment_format_value)
                            form.change('date_format', carbon_format_value)
                        }}
                        headerProps={{
                            title: Lng.t("dateFormats.title"),
                            titleStyle: headerTitle({ marginLeft: -20, marginRight: -55 }),
                            rightIconPress: null
                        }}
                        emptyContentProps={{
                            contentType: "dateFormats",
                        }}
                        isRequired
                    />

                    <Field
                        name="fiscal_year"
                        items={fiscalYears}
                        displayName="key"
                        component={SelectField}
                        label={Lng.t("settings.preferences.fiscalYear")}
                        icon='calendar-alt'
                        rightIcon='angle-right'
                        placeholder={Lng.t("settings.preferences.fiscalYearPlaceholder")}
                        fakeInputProps={{
                            valueStyle: styles.selectedField,
                            placeholderStyle: styles.selectedField,
                        }}
                        navigation={navigation}
                        searchFields={['key']}
                        compareField="value"
                        onSelect={({ value }) => form.change('fiscal_year', value)}
                        headerProps={{
                            title: Lng.t("fiscalYears.title"),
                            titleStyle: headerTitle({ marginLeft: -15, marginRight: -35 }),
                            rightIconPress: null
                        }}
                        emptyContentProps={{
                            contentType: "fiscalYears",
                        }}
                        isRequired
                    />
                    <CtDivider
                        dividerStyle={styles.dividerLine}
                    />

                    <Field
                        name="discount_per_item"
                        component={ToggleSwitch}
                        status={discountPerItem === 'YES' ? true : false}
                        hint={Lng.t("settings.preferences.discountPerItem")}
                        description={Lng.t("settings.preferences.discountPerItemPlaceholder")}
                        onChangeCallback={(val) => saveDiscountPerItem(val)}
                    />

                    <Field
                        name="tax_per_item"
                        component={ToggleSwitch}
                        status={taxPerItem === 'YES' ? true : false}
                        hint={Lng.t("settings.preferences.taxPerItem")}
                        description={Lng.t("settings.preferences.taxPerItemPlaceholder")}
                        onChangeCallback={(val) => saveTaxPerItem(val)}
                        mainContainerStyle={{ marginVertical: 12 }}
                    />

                </View>
            </DefaultLayout>
        )}
        </Form>
    );
}
