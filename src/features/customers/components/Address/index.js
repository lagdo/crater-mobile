// @flow

import React, { useState } from 'react';
import { View } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import {
    SlideModal,
    FakeInput,
    InputField,
    CtButton,
    SelectField,
} from '../../../../components';
import Lng from '../../../../api/lang/i18n';
import { colors } from '../../../../styles/colors';
import { MAX_LENGTH, formatCountries } from '../../../../api/global';

type IProps = {
    label: String,
    icon: String,
    onChangeCallback: Function,
    placeholder: String,
    containerStyle: Object,
    rightIcon: String,
    leftIcon: String,
    color: String,
    value: String,
    items: Object,
    rightIcon: String,
    hasBillingAddress: Boolean,
    meta: Object,
    handleSubmit: Function,
    type: String
};

let country = 'country_id'
let state = 'state'
let city = 'city'

let addressField = [
    "name",
    "address_street_1",
    "address_street_2",
    "phone",
    "zip",
    "country_id",
    "state",
    "city",
    "type"
];

let addressRefs = {}

export const Address = (props: IProps) => {
    const {
        navigation,
        type,
        handleSubmit,
        containerStyle,
        label,
        icon,
        placeholder,
        meta,
        rightIcon,
        hasBillingAddress,
        fakeInputProps,
        addressValue,
        autoFillValue,
        onChangeCallback,
        countries,
    } = props

    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState('');
    const [status, setStatus] = useState(false);

    const fillShippingAddress = (st) => {
        if (st) {
            setStatus(st)
            const { autoFillValue } = props

            if (typeof autoFillValue !== 'undefined') {
                addressField.map((field) => {
                    setFormField(field, autoFillValue[field])
                })
            }
        }
        else {
            setStatus(st)
            clearFormField()
        }
    }

    const onToggle = () => {
        if (!visible) {
            if (typeof addressValue !== 'undefined') {
                addressField.map((field) => {
                    setFormField(field, addressValue[field])
                })
            }

            if (!hasBillingAddress && status === true && typeof addressValue === 'undefined') {
                if (typeof autoFillValue !== 'undefined') {
                    addressField.map((field) => {
                        setFormField(field, autoFillValue[field])
                    })
                }
            }
        }
        else {
            if (typeof addressValue === 'undefined')
                clearFormField()
        }
        setVisible(!visible);
    }

    const setFormField = (field, value) => {
        addressRefs.form.change(field, value);
    };

    const clearFormField = () => {
        addressField.map((field) => setFormField(field, ""));
    };

    const saveAddress = (address) => {
        onToggle();

        onChangeCallback(address);
        clearFormField();
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={handleSubmit}
                        btnTitle={Lng.t("button.done")}
                        containerStyle={styles.handleBtn}
                    />
                </View>
            </View>
        )
    }

    const Screen = (form) => {
        addressRefs.form = form;

        return (
            <View>

                {!hasBillingAddress && (
                    <FakeInput
                        icon={'copy'}
                        color={colors.primaryLight}
                        leftIconSolid={false}
                        values={Lng.t("customers.address.sameAs")}
                        valueStyle={styles.sameAsToggle}
                        onChangeCallback={() => fillShippingAddress(!status)}
                    />
                )}

                <Field
                    name={"name"}
                    component={InputField}
                    hint={Lng.t("customers.address.name")}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        autoFocus: true,
                    }}
                />

                <Field
                    name={country}
                    items={formatCountries(countries)}
                    displayName="name"
                    component={SelectField}
                    label={Lng.t("customers.address.country")}
                    placeholder={" "}
                    rightIcon='angle-right'
                    navigation={navigation}
                    searchFields={['name']}
                    compareField="id"
                    onSelect={({ id }) => setFormField(country, id)}
                    headerProps={{
                        title: Lng.t("header.country"),
                        rightIconPress: null
                    }}
                    listViewProps={{
                        contentContainerStyle: { flex: 7 }
                    }}
                    emptyContentProps={{
                        contentType: "countries",
                    }}
                />

                <Field
                    name={state}
                    component={InputField}
                    hint={Lng.t("customers.address.state")}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        onSubmitEditing: () => addressRefs.city.focus()
                    }}
                />

                <Field
                    name={city}
                    component={InputField}
                    hint={Lng.t("customers.address.city")}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        onSubmitEditing: () => addressRefs.street1.focus()
                    }}
                    refLinkFn={(ref) => addressRefs.city = ref}
                />

                <Field
                    name={"address_street_1"}
                    component={InputField}
                    hint={Lng.t("customers.address.address")}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        placeholder: Lng.t("customers.address.street1"),
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={60}
                    autoCorrect={true}
                    refLinkFn={(ref) => addressRefs.street1 = ref}
                />

                <Field
                    name={"address_street_2"}
                    component={InputField}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        placeholder: Lng.t("customers.address.street2"),
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={60}
                    autoCorrect={true}
                    containerStyle={styles.addressStreetField}
                />

                <Field
                    name={"phone"}
                    component={InputField}
                    hint={Lng.t("customers.address.phone")}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        keyboardType: 'phone-pad'
                    }}
                    refLinkFn={(ref) => addressRefs.phone = ref}
                />

                <Field
                    name={"zip"}
                    component={InputField}
                    hint={Lng.t("customers.address.zipcode")}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        onSubmitEditing: handleSubmit
                    }}
                />
            </View>
        )
    }

    return (
        <Form onSubmit={saveAddress}>
        { ({ handleSubmit, form }) => (
            <View style={styles.container}>
                <FakeInput
                    label={label}
                    icon={icon}
                    rightIcon={rightIcon}
                    values={values || placeholder}
                    placeholder={placeholder}
                    onChangeCallback={onToggle}
                    containerStyle={containerStyle}
                    meta={meta}
                    {...fakeInputProps}
                />

                <SlideModal
                    defaultLayout
                    visible={visible}
                    onToggle={onToggle}
                    headerProps={{
                        leftIcon: "long-arrow-alt-left",
                        leftIconPress: onToggle,
                        title: hasBillingAddress ?
                            Lng.t("header.billingAddress") :
                            Lng.t("header.shippingAddress"),
                        placement: "center",
                        hasCircle: false,
                        noBorder: false,
                        transparent: false,
                    }}
                    bottomAction={BOTTOM_ACTION(handleSubmit)}
                >
                    {Screen(form)}
                </SlideModal>
            </View>
        )}
        </Form>
    );
}
