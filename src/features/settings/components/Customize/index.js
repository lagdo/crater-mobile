// @flow

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Field, change } from 'redux-form';
import styles from './styles';
import {
    CtButton,
    DefaultLayout,
    InputField,
    ToggleSwitch,
    CtDivider,
    Tabs,
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { CUSTOMIZE_FORM, CUSTOMIZE_TYPE, PAYMENT_TABS } from '../../constants';
import Lng from '../../../../api/lang/i18n';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { headerTitle } from '../../../../api/helper';
import { PaymentModes } from './PaymentModes'
import { Units } from './Units';
import { hasObjectLength } from '../../../../api/global';

type IProps = {
    navigation: Object,
    formValues: Object,
    language: String,
    type: String,
    loading: Boolean,
    isLoading: Boolean,
    handleSubmit: Function,
}

export const Customize = (props: IProps) =>  {
    const {
        navigation,
        language,
        type,
        isLoading,
        loading,
        handleSubmit,
        formValues,
        editSettingItem,
        getCustomizeSettings,
        setCustomizeSettings,
        editCustomizeSettings,
        customizes,
    } = props;

    const paymentChild = useRef(null);
    const itemChild = useRef(null);

    const [data, setData] = useState({});
    const [isUpdateAutoGenerate, setUpdateAutoGenerate] = useState(false);
    const [activeTab, setActiveTab] = useState(PAYMENT_TABS.MODE);

    useEffect(() => {
        let hasCustomizeApiCalled = customizes ?
            (typeof customizes === 'undefined' || customizes === null) : true

        hasCustomizeApiCalled && getCustomizeSettings()

        setData(setParams())

        goBack(MOUNT, navigation)

        return () => {
            isUpdateAutoGenerate &&
                setCustomizeSettings({ customizes: null })
            goBack(UNMOUNT)
        }
    }, []);

    const toastMsg = navigation.getParam('toastMsg', null);

    useEffect(() => {
        toastMsg &&
            setTimeout(() => {
                navigation.setParams({ 'toastMsg': null })
            }, 2500);
    }, [toastMsg]);

    const setParams = (values = null) => {
        let params = {}

        switch (type) {

            case CUSTOMIZE_TYPE.INVOICES:
                if (values) {
                    params = {
                        invoice_prefix: values.invoice_prefix,
                        type: "INVOICES"
                    }
                }
                else {
                    params = {
                        headerTitle: "header.invoices",
                        prefixLabel: "customizes.prefix.invoice",
                        prefixName: "invoice_prefix",
                        autoGenerateTitle: "customizes.autoGenerate.invoice",
                        autoGenerateName: "invoice_auto_generate",
                        autoGenerateDescription: "customizes.autoGenerate.invoiceDescription",
                        settingLabel: "customizes.setting.invoice",
                    }
                }
                break;

            case CUSTOMIZE_TYPE.ESTIMATES:
                if (values) {
                    params = {
                        estimate_prefix: values.estimate_prefix,
                        type: "ESTIMATES"
                    }
                }
                else {
                    params = {
                        headerTitle: "header.estimates",
                        prefixLabel: "customizes.prefix.estimate",
                        prefixName: "estimate_prefix",
                        autoGenerateTitle: "customizes.autoGenerate.estimate",
                        autoGenerateName: "estimate_auto_generate",
                        autoGenerateDescription: "customizes.autoGenerate.estimateDescription",
                        settingLabel: "customizes.setting.estimate",
                    }
                }
                break;

            case CUSTOMIZE_TYPE.PAYMENTS:
                if (values) {
                    params = {
                        payment_prefix: values.payment_prefix,
                        type: "PAYMENTS"
                    }
                }
                else {
                    params = {
                        headerTitle: "header.payments",
                        prefixLabel: "customizes.prefix.payment",
                        prefixName: "payment_prefix",
                        autoGenerateTitle: "customizes.autoGenerate.payment",
                        autoGenerateName: "payment_auto_generate",
                        autoGenerateDescription: "customizes.autoGenerate.paymentDescription",
                        settingLabel: "customizes.setting.payment"
                    }
                }
                break;

            case CUSTOMIZE_TYPE.ITEMS:
                params = {
                    headerTitle: "header.units",
                }
                break;

            default:
                break;
        }

        return params
    }

    const setFormField = (field, value) => {
        props.dispatch(change(CUSTOMIZE_FORM, field, value));
    };

    const changeAutoGenerateStatus = (field, status) => {
        setFormField(field, status)

        editSettingItem({
            params: {
                key: autoGenerateName,
                value: status === true ? 'YES' : 'NO'
            },
            hasCustomize: true,
            onResult: () => {
                toggleToast()
                setUpdateAutoGenerate(true)
            }
        })
    }

    const onSave = (values) => {
        const params = setParams(values)

        editCustomizeSettings({ params, navigation })
    }

    const toggleToast = () => {
        navigation.setParams({
            "toastMsg": "settings.preferences.settingUpdate"
        })
    }

    const BOTTOM_ACTION = () => {
        let isPaymentMode = (type === CUSTOMIZE_TYPE.PAYMENTS && activeTab === PAYMENT_TABS.MODE)
        let isItemScreen = type === CUSTOMIZE_TYPE.ITEMS

        let title = (isPaymentMode || isItemScreen) ? "button.add" : "button.save"

        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={() => isPaymentMode ?
                            paymentChild.current.openModal() :
                            isItemScreen ?
                                itemChild.current.openModal()
                                : handleSubmit(onSave)()
                        }
                        btnTitle={Lng.t(title, { locale: language })}
                        containerStyle={styles.handleBtn}
                        loading={loading}
                    />
                </View>
            </View>
        )
    }

    const TOGGLE_FIELD_VIEW = () => {
        return (
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <CtDivider dividerStyle={styles.dividerLine} />

                <Text style={styles.autoGenerateHeader}>
                    {Lng.t(data.settingLabel, { locale: language })}
                </Text>
                <Field
                    name={data.autoGenerateName}
                    component={ToggleSwitch}
                    hint={Lng.t(data.autoGenerateTitle, { locale: language })}
                    description={Lng.t(data.autoGenerateDescription, { locale: language })}
                    onChangeCallback={(val) =>
                        changeAutoGenerateStatus(data.autoGenerateName, val)
                    }
                />
            </ScrollView>
        )
    }

    const PREFIX_FIELD = () => {
        return (
            <Field
                name={data.prefixName}
                component={InputField}
                hint={Lng.t(data.prefixLabel, { locale: language })}
                inputProps={{
                    returnKeyType: 'next',
                    autoCorrect: true,
                    autoCapitalize: 'characters',
                    maxLength: 5
                }}
                fieldName={Lng.t("customizes.prefix.title", { locale: language })}
                maxCharacter={5}
                isRequired
            />
        )
    }

    const PAYMENT_CUSTOMIZE_TAB = () => {
        return (
            <Tabs
                activeTab={activeTab}
                style={styles.tabs}
                tabStyle={styles.tabView}
                setActiveTab={setActiveTab}
                tabs={[
                    {
                        Title: PAYMENT_TABS.MODE,
                        tabName: Lng.t("payments.modes", { locale: language }),
                        render: (
                            <ScrollView keyboardShouldPersistTaps='handled'>
                                <PaymentModes
                                    ref={paymentChild}
                                    props={props}
                                    setFormField={(field, value) => setFormField(field, value)}
                                />
                            </ScrollView>
                        )
                    },
                    {
                        Title: PAYMENT_TABS.PREFIX,
                        tabName: Lng.t("payments.prefix", { locale: language }),
                        render: (
                            <View style={styles.bodyContainer}>

                                {PREFIX_FIELD(language, data)}

                                {TOGGLE_FIELD_VIEW(language, data)}

                            </View>
                        )
                    }
                ]}
            />
        )
    }

    let toastMessage = navigation.getParam('toastMsg', '')
    let isItemsScreen = (type === CUSTOMIZE_TYPE.ITEMS)
    let isPaymentsScreen = (type === CUSTOMIZE_TYPE.PAYMENTS)

    let dataLoading = isItemsScreen ? !hasObjectLength(data) :
        !hasObjectLength(data) || isLoading || !hasObjectLength(formValues)

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.navigate(ROUTES.CUSTOMIZES),
                title: Lng.t(data.headerTitle, { locale: language }),
                titleStyle: headerTitle({ marginLeft: -26, marginRight: -50 }),
                rightIconPress: null,
                placement: "center",
            }}
            bottomAction={BOTTOM_ACTION()}
            toastProps={{
                message: Lng.t(toastMessage, { locale: language }),
                visible: toastMessage
            }}
            loadingProps={{ is: dataLoading }}
            hideScrollView
        >

            {isPaymentsScreen && PAYMENT_CUSTOMIZE_TAB()}

            {isItemsScreen && (
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Units
                        ref={itemChild}
                        props={props}
                        setFormField={(field, value) => setFormField(field, value)}
                    />
                </ScrollView>
            )}

            {!isPaymentsScreen && !isItemsScreen && (
                <View style={styles.bodyContainer}>

                    {PREFIX_FIELD()}

                    {TOGGLE_FIELD_VIEW()}

                </View>
            )}

        </DefaultLayout>
    );
}
