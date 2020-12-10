// @flow

import React, { useState, useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Form, Field } from 'react-final-form';
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
} from '~/components';
import { ROUTES } from '~/navigation/routes';
import {
    INVOICE_ADD,
    INVOICE_EDIT,
    ITEM_ADD,
    ITEM_EDIT,
    INVOICE_ACTIONS,
    EDIT_INVOICE_ACTIONS
} from '../../constants';
import { BUTTON_TYPE } from '~/api/consts/core';
import { colors } from '~/styles/colors';
import { TemplateField } from '../TemplateField';
import { setOnBackHandler, removeBackHandler } from '~/navigation/actions';
import Lng from '~/api/lang/i18n';
import { INVOICE_DISCOUNT_OPTION } from '../../constants';
import { CUSTOMER_ADD } from '~/features/customers/constants';
import { IMAGES } from '~/config';
import { ADD_TAX } from '~/features/settings/constants';
import { PAYMENT_ADD } from '~/features/payments/constants';
import { MAX_LENGTH, alertMe } from '~/api/global';
import { validate } from '../../containers/Invoice/validation';
import { useProductHolder } from '~/selectors/product/holder';

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

const InvoiceContent = (props: IProps) => {
    const {
        navigation,
        loading,
        id,
        type,
        getCreateInvoice,
        invoiceItems,
        getEditInvoice,
        removeInvoice,
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
        changeInvoiceStatus,
        form,
        handleSubmit,
    } = props;

    const [currency, setCurrency] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [markAsStatus, setMarkAsStatus] = useState(null);

    const formValues = form.getState().values || {};

    const invoice = useProductHolder(formValues, invoiceItems, items);

    const setFormField = (field, value) => form.change(field, value);

    const setCurrencyValue = (value) => {
        setCurrency(value);
        setFormField('currency', value);
    };

    useEffect(() => {
        type === INVOICE_EDIT ?
            getEditInvoice({
                id,
                onResult: ({ user, status }) => {
                    setCurrencyValue(user.currency);
                    setCustomerName(user.name);
                    setMarkAsStatus(status);
                }
            }) :
            getCreateInvoice({ onResult: (val) => setCurrencyValue(val.currency) });

        setOnBackHandler(onDraft);

        return () => {
            const { clearInvoice } = props;
            clearInvoice();
            removeBackHandler();
        }
    }, []);

    const onEditItem = (item) => {
        navigation.navigate(ROUTES.INVOICE_ITEM,
            { item, type: ITEM_EDIT, currency, discount_per_item, tax_per_item });
    };

    const onDraft = () => {
        if (type === INVOICE_EDIT) {
            navigation.goBack();
            return;
        }

        alertMe({
            title: Lng.t("invoices.alert.draftTitle"),
            showCancel: true,
            cancelText: Lng.t("alert.action.discard"),
            cancelPress: navigation.goBack,
            okText: Lng.t("alert.action.saveAsDraft"),
            okPress: onSaveInvoice('draft'),
        });
    }

    const onSaveInvoice = (status = 'draft') => {
        if (invoice.amounts.final < 0) {
            alert(Lng.t("invoices.alert.lessAmount"));
            return;
        }

        if (status === 'send') {
            setFormField('invoiceSend', true);
        }
        setFormField('total', invoice.amounts.final);
        setFormField('sub_total', invoice.amounts.gross);
        setFormField('tax', invoice.amounts.tax);
        setFormField('discount_val', invoice.amounts.discount);
        setFormField('items', invoiceItems);
        setFormField('taxes', [ ...invoice.taxes.simple, ...invoice.taxes.compound ]);

        handleSubmit();
    };

    const getAmountView = ({ label, amount }, style, index) => (
        <View style={styles.subContainer} key={index}>
            <View>
                <Text style={styles.amountHeading}> {label}</Text>
            </View>
            <View>
                <CurrencyFormat amount={amount} currency={currency} style={style} />
            </View>
        </View>
    );

    const FINAL_AMOUNT = () => {
        const taxPerItem = !(tax_per_item === 'NO' || typeof tax_per_item === 'undefined' || tax_per_item === null)

        const discountPerItem = !(discount_per_item === 'NO' || typeof discount_per_item === 'undefined' || discount_per_item === null)

        return (
            <View style={styles.amountContainer}>
                {getAmountView({
                    label: Lng.t("invoices.subtotal"),
                    amount: invoice.amounts.subTotal,
                }, styles.subAmount, 'subTotal')}

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

                {invoice.taxes.all.map((tax, index) => getAmountView(tax, styles.subAmount, index))}

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
                                onSelect: (val) => setFormField('taxes', [...val, ...taxes])
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

                {getAmountView({
                    label: Lng.t("invoices.totalAmount"),
                    amount: invoice.amounts.final,
                }, styles.finalAmount, 'totalAmount')}
            </View>
        )
    };

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={() => onSaveInvoice(INVOICE_ACTIONS.VIEW)}
                    btnTitle={Lng.t("button.viewPdf")}
                    type={BUTTON_TYPE.OUTLINE}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />

                <CtButton
                    onPress={() => onSaveInvoice('save')}
                    btnTitle={Lng.t("button.save")}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />

            </View>
        )
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
                const {
                    user,
                    user_id,
                    due_amount,
                    invoice_number,
                } = form.getState().values;
                const invoice = {
                    id,
                    user,
                    user_id,
                    due_amount,
                    invoice_number,
                };

                navigation.navigate(ROUTES.PAYMENT,
                    { type: PAYMENT_ADD, invoice, hasRecordPayment: true });
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
                });
                break;

            case INVOICE_ACTIONS.DELETE:
                alertMe({
                    title: Lng.t("alert.title"),
                    desc: Lng.t("invoices.alert.removeDescription"),
                    showCancel: true,
                    okPress: () => removeInvoice({
                        id,
                        onResult: (res) => {
                            res.success && navigation.goBack()

                            res.error && (res.error === 'payment_attached') &&
                                alertMe({
                                    title: Lng.t("invoices.alert.paymentAttachedTitle"),
                                    desc: Lng.t("invoices.alert.paymentAttachedDescription"),
                                })
                        }
                    })
                });
                break;

            default:
                break;
        }
    }

    const isEditInvoice = (type === INVOICE_EDIT);

    const hasSentStatus = (markAsStatus === 'SENT' || markAsStatus === 'VIEWED');
    const hasCompleteStatus = (markAsStatus === 'COMPLETED');

    const drownDownProps = (isEditInvoice && !initLoading) ? {
        options: EDIT_INVOICE_ACTIONS(hasSentStatus, hasCompleteStatus),
        onSelect: onOptionSelect,
        cancelButtonIndex: hasSentStatus ? 3 : hasCompleteStatus ? 2 : 5,
        destructiveButtonIndex: hasSentStatus ? 2 : hasCompleteStatus ? 1 : 4,
    } : null;

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: onDraft,
                title: isEditInvoice ? Lng.t("header.editInvoice") : Lng.t("header.addInvoice"),
                rightIcon: !isEditInvoice ? 'save' : null,
                rightIconPress: () => onSaveInvoice('save'),
                rightIconProps: { solid: true },
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
                            onChangeCallback={(val) => setFormField('invoice_date', val)}
                        />
                    </View>
                    <View style={styles.dateField}>
                        <Field
                            name="due_date"
                            isRequired
                            component={DatePickerField}
                            label={Lng.t("invoices.dueDate")}
                            icon={'calendar-alt'}
                            onChangeCallback={(val) => setFormField('due_date', val)}
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
                    onSelect={(user) => {
                        setFormField('user_id', user.id)
                        setCurrencyValue(user.currency)
                    }}
                    rightIconPress={
                        () => navigation.navigate(ROUTES.CUSTOMER, {
                            type: CUSTOMER_ADD,
                            currency,
                            onSelect: (val) => {
                                setFormField('user_id', val.id)
                                setCurrencyValue(val.currency)
                            }
                        })
                    }
                    headerProps={{ title: Lng.t("customers.title") }}
                    listViewProps={{ hasAvatar: true }}
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
                    items={invoice.items.selected}
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
                    items={invoice.items.available}
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
                    headerProps={{ title: Lng.t("items.title") }}
                    emptyContentProps={{
                        contentType: "items",
                        image: IMAGES.EMPTY_ITEMS,
                    }}
                    listViewProps={{ leftSubTitleStyle: itemsDescriptionStyle() }}
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

export const Invoice = (props: IProps) => {
    const {
        navigation,
        id,
        type,
        initialValues,
        createInvoice,
        editInvoice,
    } = props;

    const onSaveInvoice = (invoice) => {
        type === INVOICE_ADD ?
            createInvoice({
                invoice,
                onResult: (url) => {
                    if (status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.goBack();
                }
            }) :
            editInvoice({
                invoice: { ...invoice, id },
                onResult: (url) => {
                    if (status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.goBack();
                }
            })
    };

    return (
        <Form
            validate={validate}
            initialValues={initialValues}
            onSubmit={onSaveInvoice}
        >
            { ({ handleSubmit, form }) => (
                <InvoiceContent
                    {...props}
                    form={form}
                    handleSubmit={handleSubmit}
                />
            )}
        </Form>
    );
}
