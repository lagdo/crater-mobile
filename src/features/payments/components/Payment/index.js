// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Field, change } from 'redux-form';
import moment from 'moment';
import styles from './styles';
import {
    InputField,
    CtButton,
    DefaultLayout,
    DatePickerField,
    SelectPickerField,
    SelectField,
    FakeInput,
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { DATE_FORMAT } from '../../../../api/consts/core';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { PAYMENT_ADD, PAYMENT_EDIT, PAYMENT_FORM, PAYMENT_ACTIONS, ACTIONS_VALUE } from '../../constants';
import Lng from '../../../../api/lang/i18n';
import { IMAGES } from '../../../../config';
import { CUSTOMER_ADD } from '../../../customers/constants';
import { INVOICES_STATUS_BG_COLOR, INVOICES_STATUS_TEXT_COLOR } from '../../../invoices/constants';
import { MAX_LENGTH, alertMe, hasValue, hasLength, formatSelectPickerName } from '../../../../api/global';

let paymentRefs = {}

type IProps = {
    navigation: Object,
    customers: Object,
    getCreatePayment: Function,
    getEditPayment: Function,
    getUnpaidInvoices: Function,
    createPayment: Function,
    editPayment: Function,
    handleSubmit: Function,
    type: String,
    language: String,
    paymentLoading: Boolean,
    initPaymentLoading: Boolean,
    getUnpaidInvoicesLoading: Boolean,
    getCustomers: Function,
}

let editPaymentData = [
    "payment_date",
    "user_id",
    "invoice_id",
    "payment_method_id",
    "amount",
    "notes",
    "payment_number",
    "payment_prefix"
]

export const Payment = (props: IProps) => {
    const {
        language,
        navigation,
        type,
        handleSubmit,
        customers,
        paymentLoading,
        initPaymentLoading,
        getUnpaidInvoicesLoading,
        getCustomers,
        formValues: { due = '', amount = 0, payment_prefix = '' },
        submitFailed = false,
        createPayment,
        editPayment,
        removePayment,
        sendPaymentReceipt,
        getUnpaidInvoices,
        hasRecordPayment,
        getCreatePayment,
        getEditPayment,
    } = props;

    const [invoices, setInvoices] = useState([]);
    const [methods, setMethods] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (type === PAYMENT_EDIT) {

            let id = navigation.getParam('paymentId', null)
            setFormField('id', id)

            getEditPayment({
                id,
                onResult: ({
                    payment,
                    invoices,
                    nextPaymentNumber,
                    payment_prefix,
                    paymentMethods
                }) => {

                    let { user_id, payment_method_id, invoice_id, invoice, amount } = payment

                    editPaymentData.map((field) => {
                        let value = payment[field]

                        field === "payment_number" && (value = nextPaymentNumber)
                        field === "payment_prefix" && (value = payment_prefix)

                        setFormField(field, value)
                    })

                    invoice_id && invoice && setFormField('due',
                        (Number(amount) + Number(invoice.due_amount))
                    )

                    setSelectedCustomer(user_id ? payment.user : '')
                    setSelectedInvoice(invoice_id ? payment.invoice.invoice_number : '')
                    setSelectedPaymentMode(payment_method_id)
                    setMethods(paymentMethods)

                    if (user_id)
                        setInvoice(invoices)

                    setLoading(false)
                }
            });
        }
        else {
            getCreatePayment({
                onResult: ({
                    nextPaymentNumberAttribute = '',
                    payment_prefix = '',
                    paymentMethods
                }) => {
                    setFormField('payment_number', nextPaymentNumberAttribute)
                    setFormField('payment_date', moment())
                    setFormField('payment_prefix', payment_prefix)

                    setMethods(paymentMethods)

                    hasRecordPayment ?
                        setRecordPaymentField() :
                        setLoading(false)
                }
            });
        }

        goBack(MOUNT, navigation, { route: hasRecordPayment ? null : ROUTES.MAIN_PAYMENTS })

        return () => goBack(UNMOUNT)
    }, []);

    const setRecordPaymentField = () => {
        const {
            invoice: {
                user,
                user_id,
                due_amount,
                invoice_number,
                id
            },
        } = props;

        setFormField('user_id', user_id)
        setFormField('amount', due_amount)
        setFormField('due', due_amount)
        setFormField('invoice_id', id)

        setSelectedCustomer(user),
        setSelectedInvoice(invoice_number)

        getUnpaidInvoices({
            id: user_id,
            onResult: (invoices) => {
                invoices.length !== 0 && setInvoices(invoices)
                setLoading(false)
            }
        })
    }

    const setFormField = (field, value) => {
        props.dispatch(change(PAYMENT_FORM, field, value));

        if (field === 'payment_method_id') {
            setSelectedPaymentMode(value)
        }
    };

    const onCustomerSelect = (customer) => {
        let { id } = customer
        setFormField('user_id', id)
        setSelectedCustomer(customer)

        getUnpaidInvoices({
            id,
            onResult: (invoices) => {
                if (invoices.length !== 0) {

                    setInvoices(invoices)
                    setSelectedInvoice('')
                    setFormField('invoice_id', '')
                }
                else {
                    setInvoices([])
                    setSelectedInvoice('')
                    setFormField('invoice_id', '')
                }
            }
        })
    }

    const onPaymentSubmit = (values) => {
        let params = {
            ...values,
            payment_number: `${values.payment_prefix}-${values.payment_number}`,
        }

        type === PAYMENT_ADD ?
            createPayment({
                params,
                navigation,
                hasRecordPayment,
                onResult: (val) => {
                    val === 'invalid_amount' &&
                        alertMe({ title: Lng.t("payments.alertAmount", { locale: language }) })
                }
            })
            :
            editPayment({
                id: navigation.getParam('paymentId'),
                params,
                navigation
            })
    };

    const getInvoicesList = (items) => {
        let invoicesList = []
        if (typeof items !== 'undefined' && items.length != 0) {

            const { selectedCustomer } = state
            const { name = '', currency = null } = selectedCustomer

            invoicesList = items.map((item) => {
                const {
                    invoice_number,
                    status,
                    formattedDueDate,
                    due_amount,
                } = item;

                return {
                    title: name,
                    subtitle: {
                        title: invoice_number,
                        label: status,
                        labelBgColor: INVOICES_STATUS_BG_COLOR[status],
                        labelTextColor: INVOICES_STATUS_TEXT_COLOR[status],
                    },
                    amount: due_amount,
                    currency,
                    rightSubtitle: formattedDueDate,
                    fullItem: item,
                };
            });

        }

        return invoicesList
    }

    const onRemovePayment = () => {
        alertMe({
            title: Lng.t("alert.title", { locale: language }),
            desc: Lng.t("payments.alertDescription", { locale: language }),
            showCancel: true,
            okPress: () => removePayment({
                id: navigation.getParam('paymentId', null),
                navigation
            })
        })
    }

    const onOptionSelect = (action) => {
        if (action == ACTIONS_VALUE.REMOVE)
            onRemovePayment()
        else if (action == ACTIONS_VALUE.SEND)
            alertMe({
                title: Lng.t("alert.title", { locale: language }),
                desc: Lng.t("payments.alertSendDescription", { locale: language }),
                showCancel: true,
                okPress: () => sendPaymentReceipt({
                    params: { id: navigation.getParam('paymentId', null) }
                })
            })

    }

    const BOTTOM_ACTION = () => {
        let buttonTitle = Lng.t("button.save", { locale: language })

        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(onPaymentSubmit)}
                    btnTitle={buttonTitle}
                    loading={paymentLoading}
                />
            </View>
        )
    }

    let drownDownProps = (type === PAYMENT_EDIT && !isLoading) ? {
        options: PAYMENT_ACTIONS(Lng, language),
        onSelect: onOptionSelect,
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1
    } : null


    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: type === PAYMENT_EDIT ?
                    Lng.t("header.editPayment", { locale: language }) :
                    Lng.t("header.addPayment", { locale: language }),
                placement: "center",
                rightIcon: type !== PAYMENT_EDIT ? "save" : null,
                rightIconProps: {
                    solid: true,
                },
                rightIconPress: handleSubmit(onPaymentSubmit),
            }}
            bottomAction={BOTTOM_ACTION()}
            loadingProps={{
                is: isLoading || initPaymentLoading
            }}
            dropdownProps={drownDownProps}
        >

            <View style={styles.bodyContainer}>

                <View style={styles.numberDateFieldContainer}>
                    <View style={styles.numberDateField}>
                        <Field
                            name="payment_date"
                            component={DatePickerField}
                            dateTimeFormat={DATE_FORMAT}
                            label={Lng.t("payments.date", { locale: language })}
                            icon={'calendar-alt'}
                            onChangeCallback={(val) => {
                                setFormField('payment_date', val)
                            }}
                            isRequired
                        />
                    </View>

                    <View style={styles.numberDateField}>
                        <Field
                            name="payment_number"
                            component={FakeInput}
                            label={Lng.t("payments.number", { locale: language })}
                            isRequired
                            prefixProps={{
                                fieldName: "payment_number",
                                prefix: payment_prefix,
                            }}
                        />
                    </View>
                </View>

                <Field
                    name="user_id"
                    apiSearch
                    hasPagination
                    getItems={getCustomers}
                    items={customers}
                    displayName="name"
                    component={SelectField}
                    label={Lng.t("payments.customer", { locale: language })}
                    icon={'user'}
                    placeholder={selectedCustomer ? selectedCustomer.name : Lng.t("payments.customerPlaceholder", { locale: language })}
                    navigation={navigation}
                    compareField="id"
                    onSelect={(item) => {
                        onCustomerSelect(item)
                        setFormField('due', '')
                    }}
                    rightIconPress={
                        () => navigation.navigate(ROUTES.CUSTOMER, {
                            type: CUSTOMER_ADD,
                            onSelect: (val) => {
                                onCustomerSelect(val)
                                setFormField('due', '')
                            }
                        })
                    }
                    headerProps={{
                        title: Lng.t("customers.title", { locale: language }),
                    }}
                    listViewProps={{
                        hasAvatar: true,
                    }}
                    emptyContentProps={{
                        contentType: "customers",
                        image: IMAGES.EMPTY_CUSTOMERS,
                    }}
                    isRequired
                    isEditable={type === PAYMENT_ADD}
                    fakeInputProps={{
                        disabled: type !== PAYMENT_ADD
                    }}
                />

                <Field
                    name="amount"
                    component={InputField}
                    leftIcon={'dollar-sign'}
                    hint={Lng.t("payments.amount", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true,
                        keyboardType: 'numeric',
                    }}
                    isCurrencyInput
                    refLinkFn={(ref) => {
                        paymentRefs.amount = ref;
                    }}
                    isRequired
                />

                <Field
                    name="invoice_id"
                    items={getInvoicesList(invoices)}
                    displayName="invoice_number"
                    component={SelectField}
                    label={Lng.t("payments.invoice", { locale: language })}
                    icon={'file-invoice'}
                    placeholder={selectedInvoice ? selectedInvoice : Lng.t("payments.invoicePlaceholder", { locale: language })}
                    navigation={navigation}
                    fakeInputProps={{
                        loading: getUnpaidInvoicesLoading
                    }}
                    isInternalSearch
                    searchFields={['invoice_number', 'due_amount']}
                    compareField="id"
                    onSearch={
                        ({ searchItems, hasAll }) => {
                            // setCustomerList(hasAll ? customers : searchItems)
                        }
                    }
                    onSelect={({ id, due_amount }) => {
                        setFormField('invoice_id', id)
                        setFormField('amount', due_amount)
                        setFormField('due', due_amount)
                        paymentRefs.amount.focus();
                    }}
                    headerProps={{
                        title: Lng.t("invoices.title", { locale: language }),
                        rightIconPress: null
                    }}
                    listViewProps={{
                    }}
                    emptyContentProps={{
                        contentType: "invoices",
                        image: IMAGES.EMPTY_INVOICES,
                    }}
                    containerStyle={
                        due && submitFailed && amount > due &&
                        { marginTop: 22 }
                    }
                    isEditable={type === PAYMENT_ADD}
                    fakeInputProps={{
                        disabled: type !== PAYMENT_ADD
                    }}
                />

                <Field
                    name="payment_method_id"
                    component={SelectPickerField}
                    label={Lng.t("payments.mode", { locale: language })}
                    fieldIcon='align-center'
                    items={formatSelectPickerName(methods)}
                    selectedItem={selectedPaymentMode}
                    onChangeCallback={(val) => {
                        setFormField('payment_method_id', val)
                    }}
                    onDonePress={() => paymentRefs.notes.focus()}
                    defaultPickerOptions={{
                        label: Lng.t("payments.modePlaceholder", { locale: language }),
                        value: '',
                    }}
                    refLinkFn={(ref) => {
                        paymentRefs.mode = ref;
                    }}
                    containerStyle={styles.selectPicker}
                />

                <Field
                    name="notes"
                    component={InputField}
                    hint={Lng.t("payments.notes", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        placeholder: Lng.t("payments.notesPlaceholder", { locale: language }),
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={80}
                    autoCorrect={true}
                    refLinkFn={(ref) => {
                        paymentRefs.notes = ref;
                    }}
                />

            </View>
        </DefaultLayout >
    );
}
