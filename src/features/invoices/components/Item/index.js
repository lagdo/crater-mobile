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
import { useProductItem } from '~/selectors/product/item';

const InvoiceItemContent = (props) => {
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
        removeInvoiceItem,
        form,
        handleSubmit,
    } = props;

    const product = useProductItem(form.getState().values);

    const formValues = form.getState().values || {};

    const isCreateItem = (type === ITEM_ADD);

    useEffect(() => {
        !itemId && getItemUnits && getItemUnits();
    }, []);

    const setFormField = (field, value) => form.change(field, value);

    const onSaveItem = () => {
        if (product.amounts.final < 0) {
            alert(Lng.t("items.lessAmount"))
            return;
        }

        // Add additional data to the form
        setFormField('final_total', product.amounts.final);
        setFormField('total', product.amounts.total);
        setFormField('tax', product.amounts.tax);
        setFormField('taxes', product.taxes.all);
        setFormField('discount_val', product.amounts.discount);

        handleSubmit();
    };

    const addTax = () => navigation.navigate(ROUTES.TAX, {
        type: ADD_TAX,
        onSelect: (taxes) => {
            return form.change('taxes', [...taxes, ...formValues.taxes]);
        }
    });

    const removeItem = () => {
        alertMe({
            title: Lng.t("alert.title"),
            showCancel: true,
            okPress: () => {
                navigation.navigate(ROUTES.INVOICE);
                removeInvoiceItem({ id: itemId });
            }
        })
    }

    const getAmountView = ({ label, amount }, index) => (
        <View style={styles.subContainer} key={index}>
            <View>
                <Text style={styles.label}>{label}</Text>
            </View>
            <View>
                <CurrencyFormat
                    amount={amount}
                    currency={currency}
                    style={styles.price}
                />
            </View>
        </View>
    );

    const FINAL_AMOUNT = () => {
        const { price = 0, quantity = 0 } = formValues;
        return (
            <View style={styles.amountContainer}>
                <View style={styles.subContainer}>
                    <View>
                        <CurrencyFormat
                            amount={price}
                            currency={currency}
                            preText={`${quantity} x `}
                            style={styles.label}
                        />
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={product.amounts.gross}
                            currency={currency}
                            style={styles.price}
                        />
                    </View>
                </View>

                {discountPerItem === 'YES' && getAmountView({
                    label: Lng.t("items.finalDiscount"),
                    amount: product.amounts.discount,
                })}

                {product.taxes.all && product.taxes.all.map((tax, index) => getAmountView(tax, index))}

                <CtDivider dividerStyle={styles.divider} />

                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.label}>{Lng.t("items.finalAmount")}</Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={product.amounts.final}
                            currency={currency}
                            style={styles.totalPrice}
                        />
                    </View>
                </View>
            </View>
        )
    };

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={onSaveItem}
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

    const itemRefs = {};

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: navigation.goBack,
                title: isCreateItem ? Lng.t("header.addItem") : Lng.t("header.editItem"),
                placement: "center",
                rightIcon: 'save',
                rightIconProps: { solid: true },
                rightIconPress: onSaveItem,
            }}
            loadingProps={{ is: loading }}
            bottomAction={BOTTOM_ACTION()}
        >
            <View style={styles.bodyContainer}>
                <Field
                    name="name"
                    isRequired
                    component={InputField}
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
                            component={InputField}
                            isRequired
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

                {(formValues.unit || !itemId) && (
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
                            initialValue={formValues.discount_type}
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
                            disabled={formValues.discount_type === 'none'}
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
                        isInternalSearch
                        isMultiSelect
                        concurrentMultiSelect
                        compareField="id"
                        valueCompareField="tax_type_id"
                        listViewProps={{ contentContainerStyle: { flex: 3 } }}
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
}

export const InvoiceItem = (props: IProps) => {
    const {
        initialValues,
        navigation,
        type,
        itemId,
        addItem,
        removeInvoiceItem,
        setInvoiceItems,
    } = props;

    const onSaveItem = (item) => {
        if (type === ITEM_ADD) {
            addItem({ item, onResult: () => navigation.goBack() });
            return;
        }

        const invoiceItem = [{ ...item, item_id: itemId }];
        removeInvoiceItem({ id: itemId });
        setInvoiceItems({ invoiceItem });
        navigation.navigate(ROUTES.INVOICE);
    };

    return (
        <Form
            validate={validate}
            initialValues={initialValues}
            onSubmit={onSaveItem}
        >
            { ({ handleSubmit, form }) => (
                <InvoiceItemContent
                    {...props}
                    form={form}
                    handleSubmit={handleSubmit}
                />
            )}
        </Form>
    );
}
