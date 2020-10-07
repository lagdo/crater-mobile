// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import { DefaultLayout, CtButton, InputField, FilePicker, AssetImage, SelectField } from '../../../../components';
import { Field, change } from 'redux-form';
import Lng from '../../../../api/lang/i18n';
import { EDIT_COMPANY } from '../../constants';
import { MAX_LENGTH, formatCountries } from '../../../../api/global';


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
]
export const Company = (props: IProps) =>  {
    const {
        navigation,
        handleSubmit,
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

    useEffect(() => {
        let hasCountryApiCalled = countries ?
            (typeof countries === 'undefined' || countries.length === 0) : true

        hasCountryApiCalled && getCountries()

        getCompanyInformation({
            onResult: (company) => {

                setFormField("name", company.company_id ?
                    company.company.name : ''
                )

                if (company.addresses[0]) {
                    companyField.map((field) => {
                        setFormField(field, company.addresses[0][field])
                    })
                }
                if (company.company.logo) {
                    setImage(company.company.logo)
                }
            }
        });
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(EDIT_COMPANY, field, value));
    };

    const onCompanyUpdate = (value) => {
        if (!fileLoading && !editCompanyLoading) {
            editCompanyInformation({
                params: value,
                logo,
                navigation
            })
        }
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(onCompanyUpdate)}
                    btnTitle={Lng.t("button.save")}
                    loading={editCompanyLoading || fileLoading}
                />
            </View>
        )
    }

    let companyRefs = {}

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: Lng.t("header.setting.company"),
                titleStyle: styles.titleStyle,
                placement: "center",
                rightIcon: "save",
                rightIconProps: {
                    solid: true,
                },
                rightIconPress: handleSubmit(onCompanyUpdate),
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
                        onSubmitEditing: () => {
                            companyRefs.phone.focus();
                        }
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
                    items={formatCountries(countries)}
                    displayName="name"
                    component={SelectField}
                    label={Lng.t("customers.address.country")}
                    placeholder={" "}
                    rightIcon='angle-right'
                    navigation={navigation}
                    searchFields={['name']}
                    compareField="id"
                    onSelect={({ id }) => {
                        setFormField("country_id", id)
                    }}
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
                        onSubmitEditing: () => {
                            companyRefs.city.focus();
                        }
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
                        onSubmitEditing: () => {
                            companyRefs.street1.focus();
                        }
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
                    refLinkFn={(ref) => {
                        companyRefs.street1 = ref;
                    }}
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
                        onSubmitEditing: handleSubmit(onCompanyUpdate)
                    }}
                />

            </View>
        </DefaultLayout>
    );
}
