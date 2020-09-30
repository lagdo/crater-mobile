// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { Field, change } from 'redux-form';
import {
    InputField,
    CtDivider,
    CtButton,
    DefaultLayout,
    SelectField,
    SelectPickerField,
    CurrencyFormat,
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { ITEM_FORM, EDIT_ITEM, ADD_ITEM, ITEM_UNITS } from '../../constants';
import { BUTTON_COLOR } from '../../../../api/consts/core';
import { colors } from '../../../../styles/colors';
import Lng from '../../../../api/lang/i18n';
import { goBack, UNMOUNT, MOUNT } from '../../../../navigation/actions';
import { ADD_TAX } from '../../../settings/constants';
import { MAX_LENGTH, alertMe, formatSelectPickerName, hasValue } from '../../../../api/global';

export const Item = (props) => {
    const {
        navigation,
        type,
        language,
        loading,
        getEditItem,
        addItem,
        editItem,
        clearItem,
        removeItem,
        itemId,
        getItemUnits,
        getSettingItem,
        formValues: { taxes, price },
        handleSubmit,
        units,
        taxTypes,
    } = props;

    const isCreateItem = (type === ADD_ITEM)

    const currency = navigation.getParam('currency')

    const [isTaxPerItem, setTaxPerItem] = useState(true);

    useEffect(() => {
        getItemUnits()

        type === ADD_ITEM && getSettingItem({
            key: 'tax_per_item',
            onResult: (res) => setTaxPerItem(res === 'YES')
        })

        goBack(MOUNT, navigation)

        const isEdit = (type === EDIT_ITEM)
        isEdit && getEditItem({ id: itemId })

        return () => {
            clearItem()
            goBack(UNMOUNT)
        }
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(ITEM_FORM, field, value));
    };

    const saveItem = (values) => {
        if (finalAmount() < 0) {
            alert(Lng.t("items.lessAmount", { locale: language }))
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
            onResult: () => {
                navigation.navigate(ROUTES.GLOBAL_ITEMS)
            }
        }) : editItem({
            item: { ...item },
            id: itemId,
            onResult: () => {
                navigation.navigate(ROUTES.GLOBAL_ITEMS)
            }
        })

    };

    const onRemoveItem = () => {
        alertMe({
            title: Lng.t("alert.title", { locale: language }),
            desc: Lng.t("items.alertDescription", { locale: language }),
            showCancel: true,
            okPress: () => removeItem({
                id: itemId,
                onResult: (res) => {
                    res.error && res.error === 'item_attached' ?
                        alertMe({
                            title: Lng.t("items.alreadyAttachTitle", { locale: language }),
                            desc: Lng.t("items.alreadyAttachDescription", { locale: language })
                        })
                        : navigation.navigate(ROUTES.GLOBAL_ITEMS)
                }
            })
        })

    }

    const totalAmount = () => {
        return price + itemTax()
    }

    const itemTax = () => {
        let totalTax = 0

        taxes && taxes.map(val => {
            if (!val.compound_tax) {
                totalTax += getTaxValue(val.percent)
            }
        })

        return totalTax
    }

    const itemCompoundTax = () => {
        let totalTax = 0

        taxes && taxes.map(val => {
            if (val.compound_tax) {
                totalTax += getCompoundTaxValue(val.percent)
            }
        })

        return totalTax
    }

    const getTaxValue = (tax) => {
        return (tax * price) / 100
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
                            {Lng.t("items.subTotal", { locale: language })}
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={price}
                            currency={currency}
                            style={styles.price}
                        />
                    </View>
                </View>

                {taxes &&
                    taxes.map(val => !val.compound_tax ? (
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

                {taxes &&
                    taxes.map(val => val.compound_tax ? (
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
                            {Lng.t("items.finalAmount", { locale: language })}
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

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(saveItem)}
                    btnTitle={Lng.t("button.save", { locale: language })}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />
                {!isCreateItem && (
                    <CtButton
                        onPress={onRemoveItem}
                        btnTitle={Lng.t("button.remove", { locale: language })}
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
                label={Lng.t("items.taxes", { locale: language })}
                component={SelectField}
                searchFields={['name', 'percent']}
                placeholder={Lng.t("items.selectTax", { locale: language })}
                onlyPlaceholder
                fakeInputProps={{
                    icon: 'percent',
                    rightIcon: 'angle-right',
                    color: colors.gray,
                }}
                navigation={navigation}
                isMultiSelect
                language={language}
                concurrentMultiSelect
                isInternalSearch
                compareField="id"
                valueCompareField="tax_type_id"
                listViewProps={{
                    contentContainerStyle: { flex: 2 }
                }}
                headerProps={{
                    title: Lng.t("taxes.title", { locale: language }),
                }}
                rightIconPress={
                    () => navigation.navigate(ROUTES.TAX, {
                        type: ADD_TAX,
                        onSelect: (val) => {
                            setFormField('taxes',
                                [...val, ...taxes]
                            )
                        }
                    })
                }
                emptyContentProps={{
                    contentType: "taxes",
                }}
            />
        )
    }

    let itemRefs = {}

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.navigate(ROUTES.GLOBAL_ITEMS),
                title: isCreateItem ?
                    Lng.t("header.addItem", { locale: language }) :
                    Lng.t("header.editItem", { locale: language }),
                placement: "center",
                rightIcon: 'save',
                rightIconProps: {
                    solid: true
                },
                rightIconPress: handleSubmit(saveItem),
            }}
            bottomAction={BOTTOM_ACTION()}
            loadingProps={{ is: loading || !hasValue(isTaxPerItem) }}
        >
            <View style={styles.bodyContainer}>
                <Field
                    name="name"
                    component={InputField}
                    isRequired
                    hint={Lng.t("items.name", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        autoFocus: true,
                        onSubmitEditing: () => {
                            itemRefs.price.focus();
                        }
                    }}
                />

                <Field
                    name="price"
                    component={InputField}
                    isRequired
                    hint={Lng.t("items.price", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        keyboardType: 'numeric'
                    }}
                    isCurrencyInput
                    refLinkFn={(ref) => {
                        itemRefs.price = ref;
                    }}
                />

                <Field
                    name="unit_id"
                    component={SelectPickerField}
                    label={Lng.t("items.unit", { locale: language })}
                    items={formatSelectPickerName(units)}
                    fieldIcon={'balance-scale'}
                    containerStyle={styles.selectPicker}
                    defaultPickerOptions={{
                        label: Lng.t("items.unitPlaceholder", { locale: language }),
                        value: '',
                    }}
                />

                {isTaxPerItem && TAX_FIELD_VIEW()}

                {FINAL_AMOUNT()}

                <Field
                    name="description"
                    component={InputField}
                    hint={Lng.t("items.description", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={80}
                    refLinkFn={(ref) => {
                        itemRefs.description = ref;
                    }}
                />
            </View>
        </DefaultLayout>
    );
}
