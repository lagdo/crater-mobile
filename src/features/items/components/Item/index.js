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
import { MAX_LENGTH, alertMe, hasValue } from '~/api/global';
import { validate } from '../../containers/Item/validation';
import { useProductItem } from '~/selectors/product/item';

export const ItemContent = (props) => {
    const {
        navigation,
        type,
        currency,
        loading,
        getEditItem,
        clearItem,
        removeItem,
        itemId,
        getItemUnits,
        getSettingItem,
        units,
        taxTypes,
        form,
        handleSubmit,
    } = props;

    const product = useProductItem(form.getState().values);

    const formValues = form.getState().values || {};
    const { taxes = [], price = 0 } = formValues;

    const isCreateItem = (type === ADD_ITEM)

    const [isTaxPerItem, setTaxPerItem] = useState(true);

    const setFormField = (field, value) => form.change(field, value);

    useEffect(() => {
        getItemUnits();

        type === ADD_ITEM && getSettingItem({
            key: 'tax_per_item',
            onResult: (res) => setTaxPerItem(res === 'YES')
        });

        const isEdit = (type === EDIT_ITEM);
        isEdit && getEditItem({ id: itemId });

        return () => clearItem();
    }, []);

    const onSaveItem = () => {
        if (product.amounts.final < 0) {
            alert(Lng.t("items.lessAmount"));
            return;
        }

        // Add additional data to the form
        setFormField('total', product.amounts.final);
        setFormField('tax', product.amounts.tax);
        setFormField('taxes', product.taxes.all);

        handleSubmit();
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

    const onCreateTax = () => navigation.navigate(ROUTES.TAX, {
        type: ADD_TAX,
        onSelect: (tax) => form.change('taxes', [...tax, ...taxes])
    });

    const getAmountView = ({ label, amount }) => (
        <View style={styles.subContainer}>
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
        return (
            <View style={styles.amountContainer}>
                {getAmountView({ label: Lng.t("items.subTotal"), amount: price })}

                {product.taxes.simple && product.taxes.simple.map(tax => getAmountView(tax))}

                {product.taxes.compound && product.taxes.compound.map(tax => getAmountView(tax))}

                <CtDivider dividerStyle={styles.divider} />

                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.label}>
                            {Lng.t("items.finalAmount")}
                        </Text>
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

    const TAX_FIELD_VIEW = () => {
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
                rightIconPress={onCreateTax}
                emptyContentProps={{
                    contentType: "taxes",
                }}
            />
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
            bottomAction={BOTTOM_ACTION()}
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
                    items={units}
                    fieldIcon={'balance-scale'}
                    containerStyle={styles.selectPicker}
                    defaultPickerOptions={{
                        label: Lng.t("items.unitPlaceholder"),
                        value: '',
                    }}
                />

                {isTaxPerItem && TAX_FIELD_VIEW()}

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
}

export const Item = (props: IProps) => {
    const {
        initialValues,
        navigation,
        type,
        itemId,
        addItem,
        editItem,
    } = props;

    const onResult = () => navigation.goBack();

    const onSaveItem = (item) => {
        if (type === ADD_ITEM) {
            addItem({ item, onResult });
            return;
        }

        editItem({ item, id: itemId, onResult });
    };

    return (
        <Form
            validate={validate}
            initialValues={initialValues}
            onSubmit={onSaveItem}
        >
            { ({ handleSubmit, form }) => (
                <ItemContent
                    {...props}
                    form={form}
                    handleSubmit={handleSubmit}
                />
            )}
        </Form>
    );
}
