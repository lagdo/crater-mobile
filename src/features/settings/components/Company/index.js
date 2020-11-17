// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import { DefaultLayout, CtButton, InputField, FilePicker, AssetImage, SelectField } from '~/components';
import Lng from '~/api/lang/i18n';
import { MAX_LENGTH } from '~/api/global';
import { validate } from '../../containers/Company/validation';

type IProps = {
    navigation: Object,
    getCompanyInformation: Function,
    getCountries: Function,
    editCompanyInformation: Function,
    handleSubmit: Function,
    editCompanyLoading: Boolean,
    getCompanyInfoLoading: Boolean,
    countriesLoading: Boolean,
}

let companyField = [
    "country_id",
    "state",
    "city",
    "zip",
    "address_street_1",
    "address_street_2",
    "phone",
];

export const Company = (props: IProps) => {
    const {
        navigation,
        getCompanyInfoLoading,
        countriesLoading,
        countries,
        getCountries,
        getCompanyInformation,
        editCompanyInformation,
        editCompanyLoading,
    } = props

    const [image, setImage] = useState(null);
    const [logo, setLogo] = useState(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [company, setCompany] = useState({});

    useEffect(() => {
        countries || getCountries();

        getCompanyInformation({
            onResult: (company) => {
                let companyValues = {
                    name: company.company_id ? company.company.name : '',
                };
                if (company.addresses[0]) {
                    companyField.map((field) => {
                        companyValues[field] = company.addresses[0][field];
                    })
                }
                setCompany(companyValues);

                if (company.company.logo) {
                    setImage(company.company.logo)
                }
            }
        });
    }, []);

    const onCompanyUpdate = (params) => {
        if (!fileLoading && !editCompanyLoading) {
            editCompanyInformation({
                params,
                logo,
                navigation
            })
        }
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("button.save")}
                    loading={editCompanyLoading || fileLoading}
                />
            </View>
        )
    }

    let companyRefs = {}

    return (
        <Form validate={validate} initialValues={company} onSubmit={onCompanyUpdate}>
        { ({ form, handleSubmit }) => (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: Lng.t("header.setting.company"),
                    titleStyle: styles.titleStyle,
                    placement: "center",
                    rightIcon: "save",
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{
                    is: getCompanyInfoLoading || countriesLoading
                }}
            >
                <View style={styles.mainContainer}>

                    <Field
                        name={"logo"}
                        component={FilePicker}
                        label={Lng.t("settings.company.logo")}
                        navigation={navigation}
                        onChangeCallback={(val) => setLogo(val)}
                        imageUrl={image}
                        containerStyle={{
                            marginTop: 15,
                        }}
                        fileLoading={(val) =>  setFileLoading(val)}
                    />

                    <Field
                        name={"name"}
                        component={InputField}
                        isRequired
                        hint={Lng.t("settings.company.name")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            onFocus: true,
                            autoFocus: true,
                            onSubmitEditing: () => companyRefs.phone.focus()
                        }}
                    />

                    <Field
                        name={"phone"}
                        component={InputField}
                        hint={Lng.t("settings.company.phone")}
                        inputProps={{
                            returnKeyType: 'next',
                            keyboardType: 'phone-pad'
                        }}
                        refLinkFn={(ref) => {
                            companyRefs.phone = ref;
                        }}
                    />

                    <Field
                        name={"country_id"}
                        items={countries}
                        displayName="name"
                        component={SelectField}
                        label={Lng.t("customers.address.country")}
                        placeholder={" "}
                        rightIcon='angle-right'
                        navigation={navigation}
                        searchFields={['name']}
                        compareField="id"
                        onSelect={({ id }) => form.change("country_id", id)}
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
                        isRequired
                    />

                    <Field
                        name={"state"}
                        component={InputField}
                        hint={Lng.t("customers.address.state")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            onSubmitEditing: () => companyRefs.city.focus()
                        }}
                    />

                    <Field
                        name={"city"}
                        component={InputField}
                        hint={Lng.t("customers.address.city")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            onSubmitEditing: () => companyRefs.street1.focus()
                        }}
                        refLinkFn={(ref) => {
                            companyRefs.city = ref;
                        }}
                    />

                    <Field
                        name={"address_street_1"}
                        component={InputField}
                        hint={Lng.t("settings.company.address")}
                        inputProps={{
                            returnKeyType: 'next',
                            placeholder: Lng.t("settings.company.street1"),
                            autoCorrect: true,
                            multiline: true,
                            maxLength: MAX_LENGTH
                        }}
                        height={60}
                        autoCorrect={true}
                        refLinkFn={(ref) => companyRefs.street1 = ref}
                    />

                    <Field
                        name={"address_street_2"}
                        component={InputField}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            placeholder: Lng.t("settings.company.street2"),
                            autoCorrect: true,
                            multiline: true,
                            maxLength: MAX_LENGTH
                        }}
                        height={60}
                        autoCorrect={true}
                        containerStyle={styles.addressStreetField}
                    />

                    <Field
                        name={"zip"}
                        component={InputField}
                        hint={Lng.t("settings.company.zipcode")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            onSubmitEditing: handleSubmit
                        }}
                    />

                </View>
            </DefaultLayout>
        )}
        </Form>
    );
}
