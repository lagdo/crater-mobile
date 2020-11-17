// @flow

import React, { useEffect } from 'react';
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
    RadioButtonGroup,
} from '~/components';
import { ROUTES } from '~/navigation/routes';
import {
    ITEM_DISCOUNT_OPTION,
    ITEM_EDIT,
    ITEM_ADD,
} from '../../constants';
import { BUTTON_COLOR } from '~/api/consts/core';
import { colors } from '~/styles/colors';
import Lng from '~/api/lang/i18n';
import { ADD_TAX } from '~/features/settings/constants';
import { MAX_LENGTH, alertMe } from '~/api/global';
import { validate } from '../../containers/Item/validation';

let itemRefs = {
    quantity: 0,
    price: 0,
    discount: 0,
    discount_type: 'none',
    taxes: [],
};

export const EstimateItem = (props) => {
    const {
        navigation,
        loading,
        type,
        currency,
        discountPerItem,
        taxPerItem,
        taxTypes,
        itemId,
        units,
        getItemUnits,
        addItem,
        removeEstimateItem,
        setEstimateItems,
        initialValues,
    } = props;

    const isCreateItem = (type === ITEM_ADD);

    useEffect(() => {
        !itemId && getItemUnits && getItemUnits();
    }, []);

    const setFormField = (field, value) => {
        itemRefs.form.change(field, value);
    };

    const saveItem = (values) => {
        if (finalAmount() < 0) {
            alert(Lng.t("items.lessAmount"));
            return;
        }

        const item = {
            ...values,
            final_total: finalAmount(),
            total: subTotal(),
            discount_val: totalDiscount(),
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

        const callback = () => addItem({ item, onResult: navigation.goBack });

        if (!itemId) {
            callback();
        } else {
            const estimateItem = [{ ...item, item_id: itemId }];

            if (type === ITEM_EDIT) {
                removeEstimateItem({ id: itemId });
            }

            setEstimateItems({ estimateItem });

            navigation.navigate(ROUTES.ESTIMATE);
        }
    };

    const addTax = () => navigation.navigate(ROUTES.TAX, {
        type: ADD_TAX,
        onSelect: (val) => itemRefs.form.change('taxes', [...val, ...itemRefs.taxes])
    });

    const removeItem = () => {
        alertMe({
            title: Lng.t("alert.title"),
            showCancel: true,
            okPress: () => {
                navigation.navigate(ROUTES.ESTIMATE)
                removeEstimateItem({ id: itemId })
            }
        })
    }

    const totalDiscount = () => {
        let discountPrice = 0

        if (itemRefs.discount_type === 'percentage') {
            discountPrice = ((itemRefs.discount * itemSubTotal()) / 100)
        } else if (itemRefs.discount_type === 'fixed') {
            discountPrice = (itemRefs.discount * 100)
        }
        else if (itemRefs.discount_type === 'none') {
            discountPrice = 0
            setFormField('discount', 0)
        }

        return discountPrice
    }

    const totalAmount = () => {
        return subTotal() + itemTax()
    }

    const itemSubTotal = () => {
        return (itemRefs.price * itemRefs.quantity)
    }

    const subTotal = () => {
        return itemSubTotal() - totalDiscount()
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
        return (tax * JSON.parse(subTotal())) / 100
    }

    const getCompoundTaxValue = (tax) => {
        return (tax * JSON.parse(totalAmount())) / 100
    }

    const getTaxName = (tax) => {
        let taxName = ''

        const type = taxTypes.filter(val => val.fullItem.id === tax.tax_type_id)

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
                        <CurrencyFormat
                            amount={itemRefs.price}
                            currency={currency}
                            preText={`${itemRefs.quantity} x `}
                            style={styles.label}
                        />
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={itemSubTotal()}
                            currency={currency}
                            style={styles.price}
                        />
                    </View>
                </View>
                {discountPerItem === 'YES' && (
                    <View style={styles.subContainer}>
                        <View>
                            <Text style={styles.label}>
                                {Lng.t("items.finalDiscount")}
                            </Text>
                        </View>
                        <View>
                            <CurrencyFormat
                                amount={totalDiscount()}
                                currency={currency}
                                style={styles.price}
                            />
                        </View>
                    </View>
                )}

                {itemRefs.taxes &&
                    itemRefs.taxes.map((val, index) => !val.compound_tax ? (
                        <View
                            style={styles.subContainer}
                            key={index}
                        >
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
                            currencyStyle={styles.finalAmountCurrency}
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
                        onPress={removeItem}
                        btnTitle={Lng.t("button.remove")}
                        containerStyle={styles.handleBtn}
                        buttonColor={BUTTON_COLOR.DANGER}
                        buttonContainerStyle={styles.buttonContainer}
                        loading={loading}
                    />
                )}

            </View>
        )
    }

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={saveItem}>
        {({ handleSubmit, form }) => {
            const formValues = form.getState().values || {};
            const { quantity, price, discount, discount_type, taxes } = formValues;
            itemRefs.form = form;
            itemRefs.quantity = quantity;
            itemRefs.price = price;
            itemRefs.discount = discount;
            itemRefs.discount_type = discount_type;
            itemRefs.taxes = taxes;

            return (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: isCreateItem ? Lng.t("header.addItem") : Lng.t("header.editItem"),
                    placement: "center",
                    rightIcon: 'save',
                    rightIconProps: { solid: true },
                    rightIconPress: handleSubmit,
                }}
                loadingProps={{ is: loading }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
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
                            onSubmitEditing: () => itemRefs.quantity.focus(),
                        }}
                    />

                    <View style={styles.dateFieldContainer}>
                        <View style={styles.dateField}>
                            <Field
                                name={'quantity'}
                                isRequired
                                component={InputField}
                                hint={Lng.t("items.quantity")}
                                inputProps={{
                                    returnKeyType: 'next',
                                    keyboardType: 'numeric',
                                    onSubmitEditing: () => itemRefs.price.focus(),
                                }}
                                refLinkFn={(ref) => itemRefs.quantity = ref}
                            />
                        </View>
                        <View style={styles.dateField}>
                            <Field
                                name="price"
                                isRequired
                                component={InputField}
                                hint={Lng.t("items.price")}
                                inputProps={{
                                    returnKeyType: 'next',
                                    keyboardType: 'numeric'
                                }}
                                refLinkFn={(ref) => itemRefs.price = ref}
                                isCurrencyInput
                            />
                        </View>
                    </View>

                    {(initialValues.unit || !itemId) && (
                        <Field
                            name="unit_id"
                            label={Lng.t("items.unit")}
                            component={SelectPickerField}
                            items={units}
                            defaultPickerOptions={{
                                label: Lng.t("items.unitPlaceholder"),
                                value: '',
                            }}
                            disabled={itemId ? true : false}
                            fieldIcon={'balance-scale'}
                        />
                    )}

                    {discountPerItem == 'YES' && (
                        <View>
                            <Field
                                name="discount_type"
                                component={RadioButtonGroup}
                                hint={Lng.t("items.discountType")}
                                options={ITEM_DISCOUNT_OPTION}
                                initialValue={initialValues.discount_type}
                            />

                            <Field
                                name="discount"
                                component={InputField}
                                hint={Lng.t("items.discount")}
                                inputProps={{
                                    returnKeyType: 'next',
                                    autoCapitalize: 'none',
                                    autoCorrect: true,
                                    keyboardType: 'numeric'
                                }}
                                disabled={initialValues.discount_type === 'none'}
                            />
                        </View>
                    )}

                    {taxPerItem === 'YES' && (
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
                            isInternalSearch
                            concurrentMultiSelect
                            compareField="id"
                            valueCompareField="tax_type_id"
                            listViewProps={{ contentContainerStyle: { flex: 2 } }}
                            headerProps={{ title: Lng.t("taxes.title") }}
                            rightIconPress={addTax}
                            emptyContentProps={{ contentType: "taxes" }}
                        />
                    )}

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
                    />
                </View>
            </DefaultLayout>
            );
        }}
        </Form>
    );
}
