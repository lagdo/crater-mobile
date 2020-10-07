// @flow

import React, { useState, useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Field, change } from 'redux-form';
import styles, { itemsDescriptionStyle } from './styles';
import {
    InputField,
    DatePickerField,
    CtDivider,
    CtButton,
    ListView,
    DefaultLayout,
    SelectField,
    SelectPickerField,
    CurrencyFormat,
    FakeInput
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import {
    INVOICE_ADD,
    INVOICE_EDIT,
    ITEM_ADD,
    ITEM_EDIT,
    INVOICE_FORM,
    INVOICE_ACTIONS,
    EDIT_INVOICE_ACTIONS
} from '../../constants';
import { BUTTON_TYPE } from '../../../../api/consts/core';
import { colors } from '../../../../styles/colors';
import { TemplateField } from '../TemplateField';
import { setOnBackHandler, removeBackHandler } from '../../../../navigation/actions';
import Lng from '../../../../api/lang/i18n';
import { INVOICE_DISCOUNT_OPTION } from '../../constants';
import { CUSTOMER_ADD } from '../../../customers/constants';
import { IMAGES } from '../../../../config';
import { ADD_TAX } from '../../../settings/constants';
import { PAYMENT_ADD } from '../../../payments/constants';
import { MAX_LENGTH, alertMe } from '../../../../api/global';

type IProps = {
    navigation: Object,
    invoiceItems: Object,
    taxTypes: Object,
    customers: Object,
    getCreateInvoice: Function,
    getEditInvoice: Function,
    clearInvoice: Function,
    createInvoice: Function,
    handleSubmit: Function,
    getCustomers: Function,
    getItems: Function,
    editInvoice: Boolean,
    itemsLoading: Boolean,
    initLoading: Boolean,
    loading: Boolean,
    invoiceData: Object,
    invoiceItems: Object,
    items: Object,
    type: String
}

export const Invoice = (props: IProps) => {
    const {
        navigation,
        loading,
        type,
        getCreateInvoice,
        invoiceItems,
        getEditInvoice,
        clearInvoice,
        removeInvoice,
        formValues: {
            id,
            user,
            user_id,
            due_amount,
            invoice_number,
            taxes,
            discount,
            discount_type,
        },
        invoiceData: {
            invoice_prefix = '',
            invoiceTemplates,
            discount_per_item,
            tax_per_item,
        } = {},
        getItems,
        itemsLoading,
        items,
        initLoading,
        getCustomers,
        customers,
        customersLoading,
        taxTypes,
        createInvoice,
        editInvoice,
        changeInvoiceStatus,
        handleSubmit,
    } = props;

    // const [taxTypeList, setTaxTypeList] = useState([]);
    const [currency, setCurrency] = useState({});
    // const [itemList, setItemList] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [markAsStatus, setMarkAsStatus] = useState(null);

    useEffect(() => {
        type === INVOICE_EDIT ?
            getEditInvoice({
                id,
                onResult: ({ user, status }) => {
                    setCurrency(user.currency)
                    setCustomerName(user.name)
                    setMarkAsStatus(status)
                }
            }) :
            getCreateInvoice({
                onResult: (val) => {
                    setCurrency(val.currency)
                }
            });

        getInvoiceItemList(invoiceItems)

        setOnBackHandler(() => onDraft(handleSubmit))

        return () => {
            clearInvoice();
            removeBackHandler();
        }
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(INVOICE_FORM, field, value));
    };

    const onEditItem = (item) => {
        navigation.navigate(
            ROUTES.INVOICE_ITEM,
            { item, type: ITEM_EDIT, currency, discount_per_item, tax_per_item }
        )
    }

    const onDraft = (handleSubmit) => {
        if (type === INVOICE_EDIT) {
            navigation.navigate(ROUTES.MAIN_INVOICES)
            return
        }

        alertMe({
            title: Lng.t("invoices.alert.draftTitle"),
            showCancel: true,
            cancelText: Lng.t("alert.action.discard"),
            cancelPress: () => navigation.navigate(ROUTES.MAIN_INVOICES),
            okText: Lng.t("alert.action.saveAsDraft"),
            okPress: handleSubmit(onSubmitInvoice)
        })
    }

    const onSubmitInvoice = (values, status = 'draft') => {
        if (finalAmount() < 0) {
            alert(Lng.t("invoices.alert.lessAmount"))
            return
        }

        let invoice = {
            ...values,
            invoice_number: `${invoice_prefix}-${values.invoice_number}`,
            total: finalAmount(),
            sub_total: invoiceSubTotal(),
            tax: invoiceTax() + invoiceCompoundTax(),
            discount_val: totalDiscount(),
            taxes: values.taxes ? values.taxes.map(val => {
                return {
                    ...val,
                    amount: val.compound_tax ?
                        getCompoundTaxValue(val.percent) :
                        getTaxValue(val.percent),
                }
            }) : [],
        }

        if (status === 'send') {
            invoice.invoiceSend = true
        }

        type === INVOICE_ADD ?
            createInvoice({
                invoice,
                onResult: (url) => {
                    if (status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.navigate(ROUTES.MAIN_INVOICES)
                }
            }) :
            editInvoice({
                invoice: { ...invoice, id },
                onResult: (url) => {
                    if (status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.navigate(ROUTES.MAIN_INVOICES)
                }
            })
    };

    const invoiceSubTotal = () => {
        let subTotal = 0
        invoiceItems.map(val => {
            subTotal += JSON.parse(val.total)
        })

        return JSON.parse(subTotal)
    }

    const subTotal = () => {
        let invoiceTax = 0
        invoiceItemTotalTaxes().filter(val => {
            invoiceTax += val.amount
        })
        return (invoiceSubTotal() + invoiceTax) - totalDiscount()
    }

    const invoiceTax = () => {
        let totalTax = 0

        taxes && taxes.map(val => {
            if (!val.compound_tax) {
                totalTax += getTaxValue(val.percent)
            }
        })

        return totalTax
    }

    const invoiceCompoundTax = () => {
        let totalTax = 0

        taxes && taxes.map(val => {
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

        if (type.length > 0) {
            taxName = type[0]['fullItem'].name
        }
        return taxName
    }

    const totalDiscount = () => {
        let discountPrice = 0

        if (discount_type === 'percentage') {
            discountPrice = ((discount * invoiceSubTotal()) / 100)
        } else {
            discountPrice = (discount * 100)
        }

        return discountPrice
    }

    const totalAmount = () => {
        return subTotal() + invoiceTax()
    }

    const finalAmount = () => {
        return totalAmount() + invoiceCompoundTax()
    }

    const invoiceItemTotalTaxes = () => {
        let taxes = []
        invoiceItems.map(val => {
            val.taxes && val.taxes.filter(tax => {
                let hasSame = false
                const { tax_type_id, id, amount } = tax

                taxes = taxes.map(tax2 => {
                    if ((tax_type_id || id) === tax2.tax_type_id) {
                        hasSame = true
                        return {
                            ...tax2,
                            amount: amount + tax2.amount,
                            tax_type_id: tax2.tax_type_id
                        }
                    }
                    return tax2
                })

                if (!hasSame) {
                    taxes.push({ ...tax, tax_type_id: (tax_type_id || id) })
                }
            })
        })
        return taxes
    }

    const FINAL_AMOUNT = () => {
        let taxPerItem = !(tax_per_item === 'NO' || typeof tax_per_item === 'undefined' || tax_per_item === null)

        let discountPerItem = !(discount_per_item === 'NO' || typeof discount_per_item === 'undefined' || discount_per_item === null)

        return (
            <View style={styles.amountContainer}>
                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.amountHeading}>
                            {Lng.t("invoices.subtotal")}
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={invoiceSubTotal()}
                            currency={currency}
                            style={styles.subAmount}
                        />
                    </View>
                </View>

                {(!discountPerItem) && (
                    <View style={[styles.subContainer, styles.discount]}>
                        <View>
                            <Text style={styles.amountHeading}>
                                {Lng.t("invoices.discount")}
                            </Text>
                        </View>
                        <View style={[styles.subAmount, styles.discountField]}>
                            <Field
                                name="discount"
                                component={InputField}
                                inputProps={{
                                    returnKeyType: 'next',
                                    autoCapitalize: 'none',
                                    autoCorrect: true,
                                    keyboardType: 'numeric',
                                }}
                                fieldStyle={styles.fieldStyle}
                            />
                            <Field
                                name="discount_type"
                                component={SelectPickerField}
                                items={INVOICE_DISCOUNT_OPTION}
                                onChangeCallback={(val) => {
                                    setFormField('discount_type', val)
                                }}
                                isFakeInput
                                defaultPickerOptions={{
                                    label: 'Fixed',
                                    value: 'fixed',
                                    color: colors.secondary,
                                    displayLabel: currency ? currency.symbol : '$',
                                }}
                                fakeInputValueStyle={styles.fakeInputValueStyle}
                                fakeInputContainerStyle={styles.selectPickerField}
                                containerStyle={styles.SelectPickerContainer}
                            />
                        </View>
                    </View>
                )}

                {taxes &&
                    taxes.map((val, index) => !val.compound_tax ? (
                        <View
                            style={styles.subContainer}
                            key={index}
                        >
                            <View>
                                <Text style={styles.amountHeading}>
                                    {getTaxName(val)} ({val.percent} %)
                                </Text>
                            </View>
                            <View>
                                <CurrencyFormat
                                    amount={getTaxValue(val.percent)}
                                    currency={currency}
                                    style={styles.subAmount}
                                />
                            </View>
                        </View>
                    ) : null
                    )
                }

                {taxes &&
                    taxes.map((val, index) => val.compound_tax ? (
                        <View
                            style={styles.subContainer}
                            key={index}
                        >
                            <View>
                                <Text style={styles.amountHeading}>
                                    {getTaxName(val)} ({val.percent} %)
                                </Text>
                            </View>
                            <View>
                                <CurrencyFormat
                                    amount={getCompoundTaxValue(val.percent)}
                                    currency={currency}
                                    style={styles.subAmount}
                                />
                            </View>
                        </View>
                    ) : null
                    )
                }

                {DISPLAY_ITEM_TAX()}

                {(!taxPerItem) && (
                    <Field
                        name="taxes"
                        items={taxTypes}
                        displayName="name"
                        component={SelectField}
                        searchFields={['name', 'percent']}
                        onlyPlaceholder
                        fakeInputProps={{
                            fakeInput: (
                                <Text style={styles.taxFakeInput}>
                                    {Lng.t("invoices.taxPlaceholder")}
                                </Text>
                            )
                        }}
                        navigation={navigation}
                        isMultiSelect
                        isInternalSearch
                        concurrentMultiSelect
                        compareField="id"
                        valueCompareField="tax_type_id"
                        headerProps={{
                            title: Lng.t("taxes.title")
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
                        listViewProps={{
                            contentContainerStyle: { flex: 2 }
                        }}
                        emptyContentProps={{
                            contentType: "taxes",
                        }}
                    />
                )}

                <CtDivider dividerStyle={styles.divider} />

                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.amountHeading}>
                            {Lng.t("invoices.totalAmount")}:
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={finalAmount()}
                            currency={currency}
                            style={styles.finalAmount}
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
                    onPress={handleSubmit((val) => onSubmitInvoice(val, status = INVOICE_ACTIONS.VIEW))}
                    btnTitle={Lng.t("button.viewPdf")}
                    type={BUTTON_TYPE.OUTLINE}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />

                <CtButton
                    onPress={handleSubmit((val) => onSubmitInvoice(val, status = 'save'))}
                    btnTitle={Lng.t("button.save")}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />

            </View>
        )
    }

    const DISPLAY_ITEM_TAX = () => {
        let taxes = invoiceItemTotalTaxes()

        return taxes ? (
            taxes.map((val, index) => (
                <View
                    style={styles.subContainer}
                    key={index}
                >
                    <View>
                        <Text style={styles.amountHeading}>
                            {getTaxName(val)} ({val.percent} %)
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={val.amount}
                            currency={currency}
                            style={styles.subAmount}
                        />
                    </View>
                </View>
            )
            )
        ) : null
    }

    const getInvoiceItemList = (invoiceItems) => {
        setFormField('items', invoiceItems)

        let invoiceItemList = []

        if (typeof invoiceItems !== 'undefined' && invoiceItems.length != 0) {

            invoiceItemList = invoiceItems.map((item) => {

                let { name, description, price, quantity, total } = item

                return {
                    title: name,
                    subtitle: {
                        title: description,
                        labelComponent: (
                            <CurrencyFormat
                                amount={price}
                                currency={currency}
                                preText={`${quantity} * `}
                                style={styles.itemLeftSubTitle}
                                containerStyle={styles.itemLeftSubTitleLabel}
                            />
                        ),
                    },
                    amount: total,
                    currency,
                    fullItem: item,
                };
            });
        }

        return invoiceItemList
    }

    const getItemList = (items) => {
        let itemList = []

        if (typeof items !== 'undefined' && items.length != 0) {

            itemList = items.map((item) => {

                let { name, description, price } = item

                return {
                    title: name,
                    subtitle: {
                        title: description,
                    },
                    amount: price,
                    currency,
                    fullItem: item,
                };
            });
        }

        return itemList
    }

    const onOptionSelect = (action) => {
        switch (action) {
            case INVOICE_ACTIONS.SEND:
                alertMe({
                    title: Lng.t("alert.title"),
                    desc: Lng.t("invoices.alert.sendEmail"),
                    showCancel: true,
                    okPress: () => changeInvoiceStatus({
                        id,
                        action: 'send',
                        navigation
                    })
                })

                break;

            case INVOICE_ACTIONS.MARK_AS_SENT:
                changeInvoiceStatus({
                    id,
                    action: 'mark-as-sent',
                    navigation
                })
                break;

            case INVOICE_ACTIONS.RECORD_PAYMENT:

                let invoice = {
                    user,
                    user_id,
                    due_amount,
                    invoice_number,
                    id
                }

                navigation.navigate(ROUTES.PAYMENT,
                    { type: PAYMENT_ADD, invoice, hasRecordPayment: true }
                )
                break;

            case INVOICE_ACTIONS.CLONE:
                alertMe({
                    title: Lng.t("alert.title"),
                    desc: Lng.t("invoices.alert.clone"),
                    showCancel: true,
                    okPress: () => changeInvoiceStatus({
                        id,
                        action: 'clone',
                        navigation
                    })
                })

                break;

            case INVOICE_ACTIONS.DELETE:
                alertMe({
                    title: Lng.t("alert.title"),
                    desc: Lng.t("invoices.alert.removeDescription"),
                    showCancel: true,
                    okPress: () => removeInvoice({
                        id,
                        onResult: (res) => {
                            res.success &&
                                navigation.navigate(ROUTES.MAIN_INVOICES)

                            res.error && (res.error === 'payment_attached') &&
                                alertMe({
                                    title: Lng.t("invoices.alert.paymentAttachedTitle"),
                                    desc: Lng.t("invoices.alert.paymentAttachedDescription"),
                                })
                        }
                    })
                })

                break;

            default:
                break;
        }

    }

    const isEditInvoice = (type === INVOICE_EDIT)

    let hasSentStatus = (markAsStatus === 'SENT' || markAsStatus === 'VIEWED')
    let hasCompleteStatus = (markAsStatus === 'COMPLETED')

    let drownDownProps = (isEditInvoice && !initLoading) ? {
        options: EDIT_INVOICE_ACTIONS(hasSentStatus, hasCompleteStatus),
        onSelect: onOptionSelect,
        cancelButtonIndex:
            hasSentStatus ? 3 :
                hasCompleteStatus ? 2 : 5,
        destructiveButtonIndex:
            hasSentStatus ? 2 :
                hasCompleteStatus ? 1 : 4,
    } : null


    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => onDraft(handleSubmit),
                title: isEditInvoice ?
                    Lng.t("header.editInvoice") :
                    Lng.t("header.addInvoice"),
                rightIcon: !isEditInvoice ? 'save' : null,
                rightIconPress: handleSubmit((val) => onSubmitInvoice(val, status = 'save')),
                rightIconProps: {
                    solid: true
                },
                placement: "center",
            }}

            bottomAction={BOTTOM_ACTION()}
            loadingProps={{ is: initLoading }}
            dropdownProps={drownDownProps}
        >
            <View style={styles.bodyContainer}>
                <View style={styles.dateFieldContainer}>
                    <View style={styles.dateField}>
                        <Field
                            name={'invoice_date'}
                            isRequired
                            component={DatePickerField}
                            label={Lng.t("invoices.invoiceDate")}
                            icon={'calendar-alt'}
                            onChangeCallback={(val) =>
                                setFormField('invoice_date', val)
                            }
                        />
                    </View>
                    <View style={styles.dateField}>
                        <Field
                            name="due_date"
                            isRequired
                            component={DatePickerField}
                            label={Lng.t("invoices.dueDate")}
                            icon={'calendar-alt'}
                            onChangeCallback={(val) =>
                                setFormField('due_date', val)
                            }
                        />
                    </View>
                </View>

                <Field
                    name="invoice_number"
                    component={FakeInput}
                    label={Lng.t("invoices.invoiceNumber")}
                    isRequired
                    prefixProps={{
                        fieldName: "invoice_number",
                        prefix: invoice_prefix,
                        icon: 'hashtag',
                        iconSolid: false,
                    }}
                />

                <Field
                    name="user_id"
                    items={customers}
                    apiSearch
                    hasPagination
                    isRequired
                    getItems={getCustomers}
                    displayName="name"
                    component={SelectField}
                    label={Lng.t("invoices.customer")}
                    icon={'user'}
                    placeholder={customerName ? customerName :
                        Lng.t("invoices.customerPlaceholder")
                    }
                    navigation={navigation}
                    compareField="id"
                    onSelect={(item) => {
                        setFormField('user_id', item.id)
                        setCurrency(item.currency)
                    }}
                    rightIconPress={
                        () => navigation.navigate(ROUTES.CUSTOMER, {
                            type: CUSTOMER_ADD,
                            currency,
                            onSelect: (val) => {
                                setFormField('user_id', val.id)
                                setCurrency(val.currency)
                            }
                        })
                    }
                    headerProps={{
                        title: Lng.t("customers.title"),
                    }}
                    listViewProps={{
                        hasAvatar: true,
                    }}
                    emptyContentProps={{
                        contentType: "customers",
                        image: IMAGES.EMPTY_CUSTOMERS,
                    }}
                    fakeInputProps={{ loading: customersLoading }}
                />

                <Text style={[styles.inputTextStyle, styles.label]}>
                    {Lng.t("invoices.items")}
                    <Text style={styles.required}> *</Text>
                </Text>

                <ListView
                    items={getInvoiceItemList(invoiceItems)}
                    itemContainer={styles.itemContainer}
                    leftTitleStyle={styles.itemLeftTitle}
                    leftSubTitleLabelStyle={[styles.itemLeftSubTitle, styles.itemLeftSubTitleLabel]}
                    leftSubTitleStyle={styles.itemLeftSubTitle}
                    rightTitleStyle={styles.itemRightTitle}
                    backgroundColor={colors.white}
                    onPress={onEditItem}
                />

                <Field
                    name="items"
                    items={getItemList(items)}
                    displayName="name"
                    component={SelectField}
                    hasPagination
                    apiSearch
                    getItems={getItems}
                    compareField="id"
                    valueCompareField="item_id"
                    icon={'percent'}
                    placeholder={Lng.t("invoices.addItem")}
                    navigation={navigation}
                    onlyPlaceholder
                    isMultiSelect
                    loading={itemsLoading}
                    fakeInputProps={{
                        icon: 'shopping-basket',
                        rightIcon: 'angle-right',
                        color: colors.primaryLight,
                    }}
                    onSelect={
                        (item) => {
                            navigation.navigate(ROUTES.INVOICE_ITEM, {
                                item,
                                currency,
                                type: ITEM_ADD,
                                discount_per_item,
                                tax_per_item
                            })
                        }
                    }
                    rightIconPress={
                        () => navigation.navigate(ROUTES.INVOICE_ITEM, {
                            type: ITEM_ADD,
                            currency,
                            discount_per_item,
                            tax_per_item
                        })
                    }
                    headerProps={{
                        title: Lng.t("items.title"),
                    }}
                    emptyContentProps={{
                        contentType: "items",
                        image: IMAGES.EMPTY_ITEMS,
                    }}
                    listViewProps={{
                        leftSubTitleStyle: itemsDescriptionStyle()
                    }}
                />

                {FINAL_AMOUNT()}

                <Field
                    name="reference_number"
                    component={InputField}
                    hint={Lng.t("invoices.referenceNumber")}
                    leftIcon={'hashtag'}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                    }}
                />

                <Field
                    name="notes"
                    component={InputField}
                    hint={Lng.t("invoices.notes")}
                    inputProps={{
                        returnKeyType: 'next',
                        placeholder: Lng.t("invoices.notePlaceholder"),
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={80}
                    hintStyle={styles.noteHintStyle}
                    autoCorrect={true}
                />

                <Field
                    name="invoice_template_id"
                    templates={invoiceTemplates}
                    component={TemplateField}
                    label={Lng.t("invoices.template")}
                    icon={'file-alt'}
                    placeholder={Lng.t("invoices.templatePlaceholder")}
                    navigation={navigation}
                />

            </View>

        </DefaultLayout>
    );
}
