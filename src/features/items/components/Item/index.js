// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import {
    InputField,
    CtDivider,
    CtButton,
    DefaultLayout,
    SelectField,
    SelectPickerField,
    CurrencyFormat,
} from '~/components';
import { ROUTES } from '~/navigation/routes';
import { EDIT_ITEM, ADD_ITEM } from '../../constants';
import { BUTTON_COLOR } from '~/api/consts/core';
import { colors } from '~/styles/colors';
import Lng from '~/api/lang/i18n';
import { ADD_TAX } from '~/features/settings/constants';
import { MAX_LENGTH, alertMe, formatSelectPickerName, hasValue } from '~/api/global';
import { validate } from '../../containers/Item/validation';

let itemRefs = {
    taxes: [],
    price: 0,
}

export const Item = (props) => {
    const {
        navigation,
        type,
        currency,
        loading,
        getEditItem,
        addItem,
        editItem,
        clearItem,
        removeItem,
        itemId,
        getItemUnits,
        getSettingItem,
        units,
        taxTypes,
        initialValues,
    } = props;

    const isCreateItem = (type === ADD_ITEM)

    const [isTaxPerItem, setTaxPerItem] = useState(true);

    useEffect(() => {
        getItemUnits()

        type === ADD_ITEM && getSettingItem({
            key: 'tax_per_item',
            onResult: (res) => setTaxPerItem(res === 'YES')
        })

        const isEdit = (type === EDIT_ITEM)
        isEdit && getEditItem({ id: itemId })

        return () => clearItem();
    }, []);

    const saveItem = (values) => {
        if (finalAmount() < 0) {
            alert(Lng.t("items.lessAmount"))
            return
        }

        const item = {
            ...values,
            total: finalAmount(),
            tax: itemTax() + itemCompoundTax(),
            taxes: values.taxes && values.taxes.map(val => {
                return {
                    ...val,
                    amount: val.compound_tax ?
                        getCompoundTaxValue(val.percent) :
                        getTaxValue(val.percent),
                }
            }),
        }

        type == ADD_ITEM ? addItem({
            item,
            onResult: navigation.goBack
        }) : editItem({
            item: { ...item },
            id: itemId,
            onResult: navigation.goBack
        })
    };

    const onRemoveItem = () => {
        alertMe({
            title: Lng.t("alert.title"),
            desc: Lng.t("items.alertDescription"),
            showCancel: true,
            okPress: () => removeItem({
                id: itemId,
                onResult: (res) => {
                    res.error && res.error === 'item_attached' ?
                        alertMe({
                            title: Lng.t("items.alreadyAttachTitle"),
                            desc: Lng.t("items.alreadyAttachDescription")
                        })
                        : navigation.goBack()
                }
            })
        })

    }

    const totalAmount = () => {
        return itemRefs.price + itemTax()
    }

    const itemTax = () => {
        let totalTax = 0

        itemRefs.taxes && itemRefs.taxes.map(val => {
            if (!val.compound_tax) {
                totalTax += getTaxValue(val.percent)
            }
        })

        return totalTax
    }

    const itemCompoundTax = () => {
        let totalTax = 0

        itemRefs.taxes && itemRefs.taxes.map(val => {
            if (val.compound_tax) {
                totalTax += getCompoundTaxValue(val.percent)
            }
        })

        return totalTax
    }

    const getTaxValue = (tax) => {
        return (tax * itemRefs.price) / 100
    }

    const getCompoundTaxValue = (tax) => {
        return (tax * JSON.parse(totalAmount())) / 100
    }

    const getTaxName = (tax) => {
        let taxName = ''

        const type = taxTypes && taxTypes.filter(val => val.fullItem.id === tax.tax_type_id)

        if (taxTypes && type.length > 0) {
            taxName = type[0]['fullItem'].name
        }
        return taxName
    }

    const finalAmount = () => {
        return totalAmount() + itemCompoundTax()
    }

    const FINAL_AMOUNT = () => {
        return (
            <View style={styles.amountContainer}>
                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.label}>
                            {Lng.t("items.subTotal")}
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={itemRefs.price}
                            currency={currency}
                            style={styles.price}
                        />
                    </View>
                </View>

                {itemRefs.taxes &&
                    itemRefs.taxes.map(val => !val.compound_tax ? (
                        <View style={styles.subContainer}>
                            <View>
                                <Text style={styles.label}>
                                    {getTaxName(val)} ({val.percent} %)
                            </Text>
                            </View>
                            <View>
                                <CurrencyFormat
                                    amount={getTaxValue(val.percent)}
                                    currency={currency}
                                    style={styles.price}
                                />
                            </View>
                        </View>
                    ) : null)
                }

                {itemRefs.taxes &&
                    itemRefs.taxes.map(val => val.compound_tax ? (
                        <View style={styles.subContainer}>
                            <View>
                                <Text style={styles.label}>
                                    {getTaxName(val)} ({val.percent} %)
                            </Text>
                            </View>
                            <View>
                                <CurrencyFormat
                                    amount={getCompoundTaxValue(val.percent)}
                                    currency={currency}
                                    style={styles.price}
                                />
                            </View>
                        </View>
                    ) : null)
                }

                <CtDivider dividerStyle={styles.divider} />

                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.label}>
                            {Lng.t("items.finalAmount")}
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={finalAmount()}
                            currency={currency}
                            style={styles.totalPrice}
                        />
                    </View>
                </View>
            </View>
        )
    };

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("button.save")}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />
                {!isCreateItem && (
                    <CtButton
                        onPress={onRemoveItem}
                        btnTitle={Lng.t("button.remove")}
                        containerStyle={styles.handleBtn}
                        buttonContainerStyle={styles.buttonContainer}
                        buttonColor={BUTTON_COLOR.DANGER}
                        loading={loading}
                    />
                )}
            </View>
        )
    }

    const TAX_FIELD_VIEW = (form) => {
        return (
            <Field
                name="taxes"
                items={taxTypes}
                displayName="name"
                label={Lng.t("items.taxes")}
                component={SelectField}
                searchFields={['name', 'percent']}
                placeholder={Lng.t("items.selectTax")}
                onlyPlaceholder
                fakeInputProps={{
                    icon: 'percent',
                    rightIcon: 'angle-right',
                    color: colors.gray,
                }}
                navigation={navigation}
                isMultiSelect
                concurrentMultiSelect
                isInternalSearch
                compareField="id"
                valueCompareField="tax_type_id"
                listViewProps={{
                    contentContainerStyle: { flex: 2 }
                }}
                headerProps={{
                    title: Lng.t("taxes.title"),
                }}
                rightIconPress={
                    () => navigation.navigate(ROUTES.TAX, {
                        type: ADD_TAX,
                        onSelect: (val) => form.change('taxes', [...val, ...taxes])
                    })
                }
                emptyContentProps={{
                    contentType: "taxes",
                }}
            />
        )
    }

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={saveItem}>
        { ({ handleSubmit, form }) => {
            const formValues = form.getState().values || {};
            const { taxes = [], price = 0 } = formValues;
            itemRefs.taxes = taxes;
            itemRefs.price = price;

            return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: isCreateItem ? Lng.t("header.addItem") : Lng.t("header.editItem"),
                    placement: "center",
                    rightIcon: 'save',
                    rightIconProps: {
                        solid: true
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{ is: loading || !hasValue(isTaxPerItem) }}
            >
                <View style={styles.bodyContainer}>
                    <Field
                        name="name"
                        component={InputField}
                        isRequired
                        hint={Lng.t("items.name")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            autoFocus: true,
                            onSubmitEditing: () => itemRefs.price.focus()
                        }}
                    />

                    <Field
                        name="price"
                        component={InputField}
                        isRequired
                        hint={Lng.t("items.price")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            keyboardType: 'numeric'
                        }}
                        isCurrencyInput
                        refLinkFn={(ref) => itemRefs.price = ref}
                    />

                    <Field
                        name="unit_id"
                        component={SelectPickerField}
                        label={Lng.t("items.unit")}
                        items={formatSelectPickerName(units)}
                        fieldIcon={'balance-scale'}
                        containerStyle={styles.selectPicker}
                        defaultPickerOptions={{
                            label: Lng.t("items.unitPlaceholder"),
                            value: '',
                        }}
                    />

                    {isTaxPerItem && TAX_FIELD_VIEW(form)}

                    {FINAL_AMOUNT()}

                    <Field
                        name="description"
                        component={InputField}
                        hint={Lng.t("items.description")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            multiline: true,
                            maxLength: MAX_LENGTH
                        }}
                        height={80}
                        refLinkFn={(ref) => itemRefs.description = ref}
                    />
                </View>
            </DefaultLayout>
            );
        }}
        </Form>
    );
}
