// @flow

import React from 'react';
import { View } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import { DefaultLayout, CtButton, InputField, ToggleSwitch } from '../../../../components';
import { BUTTON_COLOR } from '../../../../api/consts/core';
import Lng from '../../../../api/lang/i18n';
import { ADD_TAX } from '../../constants';
import { MAX_LENGTH, alertMe } from '../../../../api/global';
import { validate } from '../../containers/Tax/validation';

export const Tax = (props: IProps) => {
    const {
        navigation,
        addTax,
        editTax,
        removeTax,
        taxId,
        initialValues,
        initialValues: { name },
        onSelect,
        type,
        loading,
    } = props

    const isCreate = (type === ADD_TAX)

    const onSave = (tax) => {
        if (!loading) {
            isCreate ?
                addTax({
                    tax,
                    onResult: (res) => {
                        onSelect && onSelect([{ ...res, tax_type_id: res.id }])
                        navigation.goBack(null)
                    }
                }) : editTax({
                    tax,
                    onResult: navigation.goBack
                })
        }
    }

    const onRemoveTax = () => {
        alertMe({
            title: Lng.t("alert.title"),
            desc: Lng.t("taxes.alertDescription"),
            showCancel: true,
            okPress: () => removeTax({
                id: taxId,
                onResult: (val) => {
                    val ? navigation.goBack() : alertMe({ title: `${name} ${Lng.t("taxes.alreadyUsed")}` })
                }
            })
        })
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={[styles.submitButton, !isCreate && styles.multipleButton]}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("button.save")}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={!isCreate && styles.buttonContainer}
                    loading={loading}
                />
                {!isCreate &&
                    <CtButton
                        onPress={onRemoveTax}
                        btnTitle={Lng.t("button.remove")}
                        containerStyle={styles.handleBtn}
                        buttonContainerStyle={styles.buttonContainer}
                        buttonColor={BUTTON_COLOR.DANGER}
                        loading={loading}
                    />
                }
            </View>
        )
    }

    let taxRefs = {}

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={onSave}>
        { ({ handleSubmit }) => (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: isCreate ?
                        Lng.t("header.addTaxes") :
                        Lng.t("header.editTaxes"),
                    placement: "center",
                    rightIcon: "save",
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
            >
                <View style={styles.mainContainer}>
                    <Field
                        name="name"
                        component={InputField}
                        isRequired
                        hint={Lng.t("taxes.type")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            autoFocus: true,
                            onSubmitEditing: () => taxRefs.percent.focus()
                        }}
                    />

                    <Field
                        name="percent"
                        isRequired
                        component={InputField}
                        hint={Lng.t("taxes.percentage") + ' (%)'}
                        inputProps={{
                            returnKeyType: 'next',
                            keyboardType: 'numeric',
                            onSubmitEditing: () => taxRefs.description.focus()
                        }}
                        refLinkFn={(ref) => {
                            taxRefs.percent = ref;
                        }}
                        maxNumber={100}
                    />

                    <Field
                        name="description"
                        component={InputField}
                        hint={Lng.t("taxes.description")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            multiline: true,
                            maxLength: MAX_LENGTH
                        }}
                        refLinkFn={(ref) => {
                            taxRefs.description = ref;
                        }}
                        height={80}
                    />

                    <Field
                        name="compound_tax"
                        component={ToggleSwitch}
                        hint={Lng.t("taxes.compoundTax")}
                    />

                </View>
            </DefaultLayout>
        )}
        </Form>
    );
}
