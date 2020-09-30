// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import {
    DefaultLayout,
    CtButton,
    SelectField,
    ToggleSwitch,
    CtDivider
} from '../../../../components';
import { Field, change } from 'redux-form';
import Lng from '../../../../api/lang/i18n';
import { EDIT_PREFERENCES } from '../../constants';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { headerTitle } from '../../../../api/helper';

type IProps = {
    navigation: Object,
    language: String,
    handleSubmit: Function,
    handleSubmit: Function,
    formValues: Object,
    languages: Object,
    timezones: Object,
    dateFormats: Object,
    currencies: Object,
}

export const Preferences = (props: IProps) => {
    const {
        navigation,
        language,
        isLoading,
        getPreferences,
        getSettingItem,
        editPreferences,
        clearPreferences,
        currencies,
        editPreferencesLoading,
        editSettingItemLoading,
        editSettingItem,
        handleSubmit,
        formValues: {
            time_zone,
        },
        dateFormats,
    } = props

    const [timezoneList, setTimezoneList] = useState([]);
    const [dateFormatList, setDateFormatList] = useState([]);
    const [fiscalYearList, setFiscalYearList] = useState([]);
    const [discountPerItem, setDiscountPerItem] = useState(null);
    const [taxPerItem, setTaxPerItem] = useState(null);
    const [visibleToast, setVisibleToast] = useState(false);

    useEffect(() => {
        getPreferences({
            onResult: (val) => {
                const { time_zones, date_formats, fiscal_years } = val
                setTimezoneList(getTimeZoneList(time_zones))
                setDateFormatList(getDateFormatList(date_formats))
                setFiscalYearList(getFiscalYearList(fiscal_years))
            }
        })
        getSettingItem({
            key: 'discount_per_item',
            onResult: (val) => {
                setDiscountPerItem(val !== null ? val : 'NO')
            }
        })

        getSettingItem({
            key: 'tax_per_item',
            onResult: (val) => {
                setTaxPerItem(val !== null ? val : 'NO')
            }
        })

        goBack(MOUNT, navigation);

        return () => goBack(UNMOUNT);
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(EDIT_PREFERENCES, field, value));
    };

    const onSubmitPreferences = (values) => {
        if (!(editPreferencesLoading || editSettingItemLoading)) {
            clearPreferences()
            editPreferences({ params: values, navigation, currencies })
        }
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(onSubmitPreferences)}
                    btnTitle={Lng.t("button.save", { locale: language })}
                    loading={editPreferencesLoading}
                />
            </View>
        )
    }

    const getTimeZoneList = (timezones) => {
        let timeZoneList = []
        if (typeof timezones !== 'undefined') {

            timeZoneList = timezones.map((timezone) => {

                return {
                    title: timezone.key,
                    fullItem: timezone
                }
            })
        }

        return timeZoneList
    }

    const getFiscalYearList = (fiscalYears) => {
        let years = []
        if (typeof fiscalYears !== 'undefined') {
            years = fiscalYears.map((year) => {

                const { key } = year
                return {
                    title: key,
                    fullItem: year
                }
            })
        }
        return years
    }

    const getDateFormatList = (dateFormats) => {
        let dateFormatList = []
        if (typeof dateFormats !== 'undefined') {
            dateFormatList = dateFormats.map((dateformat) => {

                const { display_date } = dateformat
                return {
                    title: display_date,
                    fullItem: dateformat
                }
            })
        }
        return dateFormatList
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
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: Lng.t("header.setting.preferences", { locale: language }),
                placement: "center",
                rightIcon: "save",
                rightIconProps: {
                    solid: true,
                },
                rightIconPress: handleSubmit(onSubmitPreferences),
            }}
            bottomAction={BOTTOM_ACTION(handleSubmit)}
            loadingProps={{
                is: isLoading ||
                    timezoneList.length === 0 || dateFormatList.length === 0 ||
                    discountPerItem === null || taxPerItem === null
            }}
            toastProps={{
                message: Lng.t("settings.preferences.settingUpdate", { locale: language }),
                visible: visibleToast
            }}
        >

            <View style={styles.mainContainer}>

                <Field
                    name="time_zone"
                    items={timezoneList}
                    displayName="key"
                    component={SelectField}
                    label={Lng.t("settings.preferences.timeZone", { locale: language })}
                    icon='clock'
                    rightIcon='angle-right'
                    placeholder={time_zone ?
                        time_zone :
                        Lng.t("settings.preferences.timeZonePlaceholder", { locale: language })
                    }
                    fakeInputProps={{
                        valueStyle: styles.selectedField,
                        placeholderStyle: styles.selectedField,
                    }}
                    navigation={navigation}
                    searchFields={['key']}
                    compareField="value"
                    onSelect={(val) => {
                        setFormField('time_zone', val.value)
                    }}
                    headerProps={{
                        title: Lng.t("timeZones.title", { locale: language }),
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
                    items={dateFormatList}
                    displayName="display_date"
                    component={SelectField}
                    label={Lng.t("settings.preferences.dateFormat", { locale: language })}
                    icon='calendar-alt'
                    rightIcon='angle-right'
                    placeholder={Lng.t("settings.preferences.dateFormatPlaceholder", { locale: language })}
                    fakeInputProps={{
                        valueStyle: styles.selectedField,
                        placeholderStyle: styles.selectedField,
                    }}
                    navigation={navigation}
                    searchFields={['display_date']}
                    compareField="carbon_format_value"
                    onSelect={(val) => {
                        setFormField('carbon_date_format', val.carbon_format_value)
                        setFormField('moment_date_format', val.moment_format_value)
                        setFormField('date_format', val.carbon_format_value)
                    }}
                    headerProps={{
                        title: Lng.t("dateFormats.title", { locale: language }),
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
                    items={fiscalYearList}
                    displayName="key"
                    component={SelectField}
                    label={Lng.t("settings.preferences.fiscalYear", { locale: language })}
                    icon='calendar-alt'
                    rightIcon='angle-right'
                    placeholder={Lng.t("settings.preferences.fiscalYearPlaceholder", { locale: language })}
                    fakeInputProps={{
                        valueStyle: styles.selectedField,
                        placeholderStyle: styles.selectedField,
                    }}
                    navigation={navigation}
                    searchFields={['key']}
                    compareField="value"
                    onSelect={(val) => {
                        setFormField('fiscal_year', val.value)
                    }}
                    headerProps={{
                        title: Lng.t("fiscalYears.title", { locale: language }),
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
                    hint={Lng.t("settings.preferences.discountPerItem", { locale: language })}
                    description={Lng.t("settings.preferences.discountPerItemPlaceholder", { locale: language })}
                    onChangeCallback={(val) => saveDiscountPerItem(val)
                    }
                />

                <Field
                    name="tax_per_item"
                    component={ToggleSwitch}
                    status={taxPerItem === 'YES' ? true : false}
                    hint={Lng.t("settings.preferences.taxPerItem", { locale: language })}
                    description={Lng.t("settings.preferences.taxPerItemPlaceholder", { locale: language })}
                    onChangeCallback={(val) => saveTaxPerItem(val)
                    }
                    mainContainerStyle={{ marginVertical: 12 }}
                />

            </View>
        </DefaultLayout>
    );
}
