// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import {
    InputField,
    CtButton,
    DefaultLayout,
    SelectField,
} from '~/components';
import { CUSTOMER_EDIT, CUSTOMER_ADD, CUSTOMER_ACTIONS, ACTIONS_VALUE } from '../../constants';
import AddressContainer from '../../containers/Address';
import Lng from '~/api/lang/i18n';
import { colors } from '~/styles/colors';
import { SymbolStyle } from '~/components/CurrencyFormat/styles';
import { headerTitle } from '~/api/helper';
import { alertMe, hasValue } from '~/api/global';
import { validate } from '../../containers/Customer/validation';

let customerField = [
    "name",
    "contact_name",
    "email",
    "phone",
    "website",
    "enable_portal",
]

type IProps = {
    navigation: Object,
    type: String,
    getEditCustomer: Function,
    createCustomer: Function,
    editCustomer: Function,
    customerLoading: Boolean,
    getEditCustomerLoading: Boolean,
    formValues: Object,
}

let customerRefs = {}

export const Customer = (props: IProps) =>  {
    const {
        navigation,
        getEditCustomer,
        createCustomer,
        editCustomer,
        removeCustomer,
        id,
        type,
        onSelect,
        currencies,
        currency,
        getEditCustomerLoading,
        customerLoading,
        initialValues,
    } = props;

    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [portal, setPortal] = useState(false);
    // const [currencyList, setCurrencyList] = useState(currencies);

    useEffect(() => {
        if (type === CUSTOMER_EDIT) {
            getEditCustomer({
                id,
                onResult: (customer) => {
                    // let { currency_id, enable_portal } = customer
                    let { currency_id } = customer

                    customerField.map((field) => {
                        setFormField(field, customer[field])
                    })

                    setFormField('billingAddress',
                        customer.billing_address ?
                            customer.billing_address : []
                    )
                    setFormField('shippingAddress',
                        customer.shipping_address ?
                            customer.shipping_address : []
                    )

                    if (currency_id) {
                        let { name, code } = customer.currency
                        setFormField('currency_id',
                            customer.currency ?
                                customer.currency.id : null)
                                setSelectedCurrency(`${name}`)
                    }
                    // setPortal(enable_portal === 1 ? true : false)
                }
            });
        }
        else {
            if (hasValue(currency)) {
                const { name, id } = currency
                setFormField('currency_id', id)
                setSelectedCurrency(name)
            }
        }
    }, []);

    const setFormField = (field, value) => {
        customerRefs.form.change(field, value);
    };

    const onTogglePortal = (status) => {
        setFormField('enable_portal', status)
        setPortal(status)

        if (!status)
            setFormField('password', '')
    }

    const onCustomerSubmit = (values) => {
        if (type === CUSTOMER_ADD)
            createCustomer({
                params: values,
                onResult: (res) => {
                    onSelect && onSelect(res)
                    navigation.goBack(null)
                }
            })
        else
            editCustomer({ params: values, navigation })
    };

    const onRemoveCustomer = () => {
        alertMe({
            title: Lng.t("alert.title"),
            desc: Lng.t("customers.alertDescription"),
            showCancel: true,
            okPress: () => removeCustomer({
                id,
                navigation
            })
        })
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={ Lng.t("button.save")}
                    loading={customerLoading}
                />
            </View>
        )
    }

    const getCurrenciesList = () => {
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

    const onOptionSelect = (action) => {
        if (action == ACTIONS_VALUE.REMOVE)
            onRemoveCustomer();
    };

    const drownDownProps = type === CUSTOMER_EDIT ? {
        options: CUSTOMER_ACTIONS(),
        onSelect: onOptionSelect,
        cancelButtonIndex: 1,
        destructiveButtonIndex: 2,
    } : null;

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={onCustomerSubmit}>
        { ({ handleSubmit, form }) => {
            customerRefs.form = form;
            const formValues = form.getState().values || {};
            const {
                billingAddress,
                shippingAddress,
                enable_portal,
                // currency_id,
            } = formValues;

            return (
            <DefaultLayout
                headerProps={{
                    leftIcon: 'long-arrow-alt-left',
                    leftIconStyle: styles.leftIcon,
                    leftIconPress: navigation.goBack,
                    title: type === CUSTOMER_EDIT ?
                        Lng.t("header.editCustomer") :
                        Lng.t("header.addCustomer"),
                    titleStyle: styles.headerTitle,
                    placement: "center",
                    rightIcon: type !== CUSTOMER_EDIT ? "save" : null,
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{
                    is: getEditCustomerLoading || typeof enable_portal === 'undefined'
                }}
                dropdownProps={drownDownProps}
            >
                <View style={styles.bodyContainer}>
                    <Field
                        name="name"
                        component={InputField}
                        isRequired
                        hint={Lng.t("customers.displayName")}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            autoFocus: true,
                            keyboardType: "ascii-capable",
                            onSubmitEditing: () => {
                                customerRefs.contactName.focus();
                            }
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <Field
                        name="contact_name"
                        component={InputField}
                        hint={Lng.t("customers.contactName")}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            keyboardType: "ascii-capable",
                            onSubmitEditing: () => {
                                customerRefs.email.focus();
                            }
                        }}
                        refLinkFn={(ref) => {
                            customerRefs.contactName = ref;
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <Field
                        name="email"
                        component={InputField}
                        hint={Lng.t("customers.email")}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            keyboardType: "email-address",
                            onSubmitEditing: () => {
                                customerRefs.phone.focus();
                            }
                        }}
                        refLinkFn={(ref) => {
                            customerRefs.email = ref;
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <Field
                        name="phone"
                        component={InputField}
                        hint={Lng.t("customers.phone")}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            keyboardType: 'phone-pad',
                            onSubmitEditing: () => {
                                customerRefs.website.focus();
                            }
                        }}
                        refLinkFn={(ref) => {
                            customerRefs.phone = ref;
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <Field
                        name="website"
                        component={InputField}
                        hint={Lng.t("customers.website")}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            keyboardType: "url"
                        }}
                        refLinkFn={(ref) => {
                            customerRefs.website = ref;
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <View style={styles.inputGroup}>


                        <Field
                            name="currency_id"
                            items={getCurrenciesList()}
                            displayName="name"
                            component={SelectField}
                            icon='dollar-sign'
                            rightIcon='angle-right'
                            placeholder={selectedCurrency ? selectedCurrency : Lng.t("customers.currency")}
                            navigation={navigation}
                            searchFields={['name']}
                            compareField="id"
                            onSelect={(val) => {
                                form.change('currency_id', val.id)
                            }}
                            headerProps={{
                                title: Lng.t("currencies.title"),
                                titleStyle: headerTitle({ marginLeft: -30, marginRight: -65 }),
                                rightIconPress: null
                            }}
                            listViewProps={{
                                contentContainerStyle: { flex: 5 },
                                rightTitleStyle: SymbolStyle
                            }}
                            emptyContentProps={{
                                contentType: "currencies",
                            }}
                        />

                        <Field
                            name="billingAddress"
                            component={AddressContainer}
                            hasBillingAddress
                            addressValue={billingAddress}
                            icon='map-marker-alt'
                            rightIcon='angle-right'
                            placeholder={Lng.t("customers.billingAddress")}
                            navigation={navigation}
                            onChangeCallback={(val) =>
                                form.change('billingAddress', val)
                            }
                            containerStyle={styles.addressField}
                            type={type}
                            fakeInputProps={{
                                color: billingAddress && (Object.keys(billingAddress).length !== 0) ? colors.primaryLight : null,
                            }}
                        />

                        <Field
                            name="shippingAddress"
                            component={AddressContainer}
                            addressValue={shippingAddress}
                            autoFillValue={billingAddress}
                            icon='map-marker-alt'
                            rightIcon='angle-right'
                            placeholder={Lng.t("customers.shippingAddress")}
                            navigation={navigation}
                            onChangeCallback={(val) =>
                                form.change('shippingAddress', val)
                            }
                            containerStyle={styles.addressField}
                            type={type}
                            fakeInputProps={{
                                color: shippingAddress && (Object.keys(shippingAddress).length !== 0) ? colors.primaryLight : null,
                            }}
                        />

                    </View>

                    {/*
                    <CtDivider dividerStyle={styles.dividerStyle} />

                    <Field
                        name="enable_portal"
                        component={ToggleSwitch}
                        status={enable_portal === 1 ? true : false}
                        hint={Lng.t("customers.enablePortal")}
                        onChangeCallback={(val) =>
                            onTogglePortal(val)
                        }
                    />

                    {portal && (
                        <Field
                            name={'password'}
                            component={InputField}
                            hint={Lng.t("customers.password")}
                            inputProps={{
                                returnKeyType: 'go',
                                autoCapitalize: 'none',
                                autoCorrect: true,
                            }}
                            secureTextEntry
                        />
                    )} */}
                </View>
            </DefaultLayout>
            );
        }}
        </Form>
    );
}
