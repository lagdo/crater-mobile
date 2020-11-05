// @flow

import React, { Fragment } from 'react';
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
} from '@/components';
import {
    CUSTOMIZE_FORM,
    CUSTOMIZE_TYPE,
    PAYMENT_TABS,
    CUSTOMIZE_ADDRESSES,
    TERMS_CONDITION_INSERT_FIELDS
} from '../../constants';
import Lng from '@/lang/i18n';
import { goBack, MOUNT, UNMOUNT, ROUTES } from '@/navigation';
import { PaymentModes } from './PaymentModes'
import { Units } from './Units';
import { CustomizeAddresses } from '../CustomizeAddresses';
import { headerTitle } from '@/styles';
import { hasObjectLength, MAX_LENGTH } from '@/constants';

type IProps = {
    navigation: Object,
    formValues: Object,
    locale: String,
    type: String,
    loading: Boolean,
    isLoading: Boolean,
    handleSubmit: Function,
    getCustomizeSettings: Function,
    customizes: Object,
    setCustomizeSettings: Function
}

export class Customize extends React.Component<IProps> {
    constructor(props) {
        super(props);

        this.paymentChild = React.createRef();
        this.itemChild = React.createRef();

        this.state = {
            data: {},
            isUpdateAutoGenerate: false,
            activeTab: PAYMENT_TABS.MODE,
        }
    }

    componentDidMount() {

        const {
            getCustomizeSettings,
            customizes,
            navigation,
        } = this.props

        let hasCustomizeApiCalled = customizes ? (typeof customizes === 'undefined' || customizes === null) : true

        hasCustomizeApiCalled && getCustomizeSettings()

        this.setState({ data: this.setParams() })

        goBack(MOUNT, navigation)
    }

    componentWillUpdate(nextProps, nextState) {

        const { navigation } = nextProps
        const toastMsg = navigation.getParam('toastMsg', null)

        toastMsg &&
            setTimeout(() => {
                navigation.setParams({ 'toastMsg': null })
            }, 2500);
    }

    componentWillUnmount() {
        this.state.isUpdateAutoGenerate &&
            this.props.setCustomizeSettings({ customizes: null })
        goBack(UNMOUNT)
    }

    setParams = (values = null) => {

        const { type } = this.props
        let params = {}

        switch (type) {

            case CUSTOMIZE_TYPE.ADDRESSES:
                if (values) {
                    const {
                        billing_address_format,
                        company_address_format,
                        shipping_address_format,
                    } = values

                    params = {
                        billing_address_format,
                        company_address_format,
                        shipping_address_format,
                        large: true,
                        type: "ADDRESSES"
                    }
                }
                else {
                    params = {
                        headerTitle: "header.addresses",
                    }
                }
                break;

            case CUSTOMIZE_TYPE.INVOICES:
                if (values) {
                    const {
                        invoice_prefix,
                        invoice_notes,
                        invoice_terms_and_conditions,
                    } = values

                    params = {
                        invoice_prefix,
                        invoice_notes,
                        invoice_terms_and_conditions,
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
                        notesName: "invoice_notes",
                        termsConditionName: "invoice_terms_and_conditions"
                    }
                }
                break;

            case CUSTOMIZE_TYPE.ESTIMATES:
                if (values) {
                    const {
                        estimate_prefix,
                        estimate_notes,
                        estimate_terms_and_conditions,
                    } = values

                    params = {
                        estimate_prefix,
                        estimate_notes,
                        estimate_terms_and_conditions,
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
                        keyName: "estimateAutoGenerate",
                        autoGenerateDescription: "customizes.autoGenerate.estimateDescription",
                        settingLabel: "customizes.setting.estimate",
                        notesName: "estimate_notes",
                        termsConditionName: "estimate_terms_and_conditions"
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

    setFormField = (field, value) => {
        this.props.dispatch(change(CUSTOMIZE_FORM, field, value));
    };

    changeAutoGenerateStatus = (field, status) => {

        this.setFormField(field, status)

        const { editSettingItem } = this.props

        const settings = {
            [field] : status === true ? 'YES' : 'NO',
        }

        editSettingItem({
            params: {
                settings
            },
            hasCustomize: true,
            onResult: () => {
                this.toggleToast()
                this.setState({ isUpdateAutoGenerate: true })
            }
        })
    }

    onSave = (values) => {

        const { editCustomizeSettings, navigation } = this.props
        const params = this.setParams(values)

        editCustomizeSettings({ params, navigation })
    }

    toggleToast = () => {
        this.props.navigation.setParams({
            "toastMsg": "settings.preferences.settingUpdate"
        })
    }

    BOTTOM_ACTION = () => {
        const { locale, loading, handleSubmit, type } = this.props
        const { activeTab } = this.state

        let isPaymentMode = (type === CUSTOMIZE_TYPE.PAYMENTS && activeTab === PAYMENT_TABS.MODE)
        let isItemScreen = type === CUSTOMIZE_TYPE.ITEMS

        let title = (isPaymentMode || isItemScreen) ? "button.add" : "button.save"

        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={() => isPaymentMode ?
                            this.paymentChild.current.openModal() :
                            isItemScreen ?
                                this.itemChild.current.openModal()
                                : handleSubmit(this.onSave)()
                        }
                        btnTitle={Lng.t(title, { locale })}
                        containerStyle={styles.handleBtn}
                        loading={loading}
                    />
                </View>
            </View>
        )
    }

    TOGGLE_FIELD_VIEW = (locale, data) => {

        return (
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <CtDivider dividerStyle={styles.dividerLine} />

                <Text style={styles.autoGenerateHeader}>
                    {Lng.t(data.settingLabel, { locale })}
                </Text>
                <Field
                    name={data.autoGenerateName}
                    component={ToggleSwitch}
                    hint={Lng.t(data.autoGenerateTitle, { locale })}
                    description={Lng.t(data.autoGenerateDescription, { locale })}
                    onChangeCallback={(val) =>
                        this.changeAutoGenerateStatus(data.autoGenerateName, val)
                    }
                />
            </ScrollView>
        )
    }

    PREFIX_FIELD = (locale, data) => {

        return (
            <Field
                name={data.prefixName}
                component={InputField}
                hint={Lng.t(data.prefixLabel, { locale })}
                inputProps={{
                    returnKeyType: 'next',
                    autoCorrect: true,
                    autoCapitalize: 'characters',
                    maxLength: 5
                }}
                fieldName={Lng.t("customizes.prefix.title", { locale })}
                maxCharacter={5}
                isRequired
            />
        )
    }

    setActiveTab = (activeTab) => {
        this.setState({ activeTab });
    }

    PAYMENT_CUSTOMIZE_TAB = () => {
        const { locale } = this.props
        const { activeTab, data } = this.state

        return (
            <Tabs
                activeTab={activeTab}
                style={styles.tabs}
                tabStyle={styles.tabView}
                setActiveTab={this.setActiveTab}
                tabs={[
                    {
                        Title: PAYMENT_TABS.MODE,
                        tabName: Lng.t("payments.modes", { locale }),
                        render: (
                                <PaymentModes
                                    ref={this.paymentChild}
                                    props={this.props}
                                    setFormField={(field, value) => this.setFormField(field, value)}
                                />
                        )
                    },
                    {
                        Title: PAYMENT_TABS.PREFIX,
                        tabName: Lng.t("payments.prefix", { locale }),
                        render: (
                            <View style={styles.bodyContainer}>

                                {this.PREFIX_FIELD(locale, data)}

                                {this.TOGGLE_FIELD_VIEW(locale, data)}

                            </View>
                        )
                    }
                ]}
            />
        )
    }

    TextAreaFieldView = (data, locale) => {
        return (
            <View>
                <Field
                    name={data.notesName}
                    component={InputField}
                    hint={Lng.t("invoices.notes", { locale })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={160}
                    autoCorrect={true}
                />

                <CustomizeAddresses
                    customizeProps={this.props}
                    addresses={TERMS_CONDITION_INSERT_FIELDS(data.termsConditionName)}
                    addressesProps={{
                        insertFieldContainerStyle: styles.insertFieldContainer,
                        hintStyle: styles.label
                    }}
                    bodyContainerStyle={styles.bodyContainerStyle}
                />
            </View>
        )
    }

    render() {
        const {
            navigation,
            locale,
            type,
            isLoading,
            formValues,
            getItemUnits
        } = this.props;

        const { data } = this.state
        const showTextAreaField = (
            type === CUSTOMIZE_TYPE.INVOICES ||
            type === CUSTOMIZE_TYPE.ESTIMATES
        )

        let toastMessage = navigation.getParam('toastMsg', '')
        let isItemsScreen = (type === CUSTOMIZE_TYPE.ITEMS)
        let isPaymentsScreen = (type === CUSTOMIZE_TYPE.PAYMENTS)
        let isAddressScreen = (type === CUSTOMIZE_TYPE.ADDRESSES)

        let loading = isItemsScreen ? !hasObjectLength(data) :
            !hasObjectLength(data) || isLoading || !hasObjectLength(formValues)

        return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: () => navigation.navigate(ROUTES.CUSTOMIZES),
                    title: Lng.t(data.headerTitle, { locale }),
                    titleStyle: headerTitle({
                        marginLeft: -26,
                        marginRight: -50
                    }),
                    rightIconPress: null,
                    placement: 'center'
                }}
                bottomAction={this.BOTTOM_ACTION()}
                toastProps={{
                    message: Lng.t(toastMessage, { locale }),
                    visible: toastMessage
                }}
                loadingProps={{ is: loading }}
                hideScrollView
            >
                {isPaymentsScreen && this.PAYMENT_CUSTOMIZE_TAB()}

                {isItemsScreen && (
                        <Units
                            ref={this.itemChild}
                            props={this.props}
                            setFormField={(field, value) =>
                                this.setFormField(field, value)
                            }
                        />
                )}

                {isAddressScreen && (
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <CustomizeAddresses
                            customizeProps={this.props}
                            addresses={CUSTOMIZE_ADDRESSES()}
                        />
                    </ScrollView>
                )}

                {!isPaymentsScreen && !isItemsScreen && !isAddressScreen && (
                    <View style={styles.bodyContainer}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {this.PREFIX_FIELD(locale, data)}

                            {showTextAreaField &&
                                this.TextAreaFieldView(data, locale)}

                            {this.TOGGLE_FIELD_VIEW(locale, data)}
                        </ScrollView>
                    </View>
                )}
            </DefaultLayout>
        );
    }
}
