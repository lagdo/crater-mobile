// @flow

import React, { useState, useEffect } from 'react';
import { View, Text, Linking } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
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
    ESTIMATE_ADD,
    ESTIMATE_EDIT,
    ITEM_ADD,
    ITEM_EDIT,
    ESTIMATE_ACTIONS,
    EDIT_ESTIMATE_ACTIONS,
    MARK_AS_ACCEPT, MARK_AS_REJECT, MARK_AS_SENT
} from '../../constants';
import { BUTTON_TYPE } from '~/api/consts/core';
import { colors } from '~/styles/colors';
import { TemplateField } from '../TemplateField';
import { setOnBackHandler, removeBackHandler } from '~/navigation/actions';
import Lng from '~/api/lang/i18n';
import { ESTIMATE_DISCOUNT_OPTION } from '../../constants';
import { CUSTOMER_ADD } from '~/features/customers/constants';
import { IMAGES } from '~/config';
import { ADD_TAX } from '~/features/settings/constants';
import { MAX_LENGTH, alertMe } from '~/api/global';
import { itemsDescriptionStyle } from '~/features/invoices/components/Invoice/styles';
import { headerTitle } from '~/api/helper';
import { validate } from '../../containers/Estimate/validation';
import { useProductHolder } from '~/selectors/product/holder';

type IProps = {
    navigation: Object,
    estimateItems: Object,
    taxTypes: Object,
    customers: Object,
    getCreateEstimate: Function,
    getEditEstimate: Function,
    clearEstimate: Function,
    createEstimate: Function,
    handleSubmit: Function,
    getCustomers: Function,
    getItems: Function,
    editEstimate: Boolean,
    itemsLoading: Boolean,
    initLoading: Boolean,
    loading: Boolean,
    estimateData: Object,
    estimateItems: Object,
    items: Object,
    type: String
}

const EstimateContent = (props: IProps) => {
    const {
        navigation,
        loading,
        id,
        type,
        estimateData: {
            estimate_prefix = '',
            estimateTemplates,
            discount_per_item,
            tax_per_item,
        } = {},
        estimateItems,
        getItems,
        itemsLoading,
        items,
        initLoading,
        getCustomers,
        customers,
        getCreateEstimate,
        taxTypes,
        getEditEstimate,
        removeEstimate,
        convertToInvoice,
        changeEstimateStatus,
        form,
        handleSubmit,
    } = props;

    const [currency, setCurrency] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [markAsStatus, setMarkAsStatus] = useState(null);

    const formValues = form.getState().values || {};

    const estimate = useProductHolder(formValues, estimateItems, items);

    const setFormField = (field, value) => form.change(field, value);

    const setCurrencyValue = (value) => {
        setCurrency(value);
        setFormField('currency', value);
    };

    useEffect(() => {
        type === ESTIMATE_EDIT ?
            getEditEstimate({
                id,
                onResult: ({ user, status }) => {
                    setCurrencyValue(user.currency);
                    setCustomerName(user.name);
                    setMarkAsStatus(status);
                }
            }) :
            getCreateEstimate({ onResult: (val) => setCurrencyValue(val.currency) });

        setOnBackHandler(onDraft);

        return () => {
            const { clearEstimate } = props;
            clearEstimate();
            removeBackHandler();
        }
    }, []);

    const onEditItem = (item) => {
        navigation.navigate(ROUTES.ESTIMATE_ITEM,
            { item, type: ITEM_EDIT, currency, discount_per_item, tax_per_item });
    }

    const onDraft = () => {
        if (type === ESTIMATE_EDIT) {
            navigation.goBack();
            return;
        }

        alertMe({
            title: Lng.t("estimates.alert.draftTitle"),
            showCancel: true,
            cancelText: Lng.t("alert.action.discard"),
            cancelPress: navigation.goBack,
            okText: Lng.t("alert.action.saveAsDraft"),
            okPress: onSaveEstimate('draft'),
        })
    }

    const onSaveEstimate = (status = 'draft') => {
        if (estimate.amounts.final < 0) {
            alert(Lng.t("estimates.alert.lessAmount"));
            return;
        }

        if (status === 'send') {
            setFormField('estimateSend', true);
        }
        setFormField('total', estimate.amounts.final);
        setFormField('sub_total', estimate.amounts.gross);
        setFormField('tax', estimate.amounts.tax);
        setFormField('discount_val', estimate.amounts.discount);
        setFormField('items', estimateItems);
        setFormField('taxes', [ ...estimate.taxes.simple, ...estimate.taxes.compound ]);

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
                    label: Lng.t("estimates.subtotal"),
                    amount: estimate.amounts.subTotal,
                }, styles.subAmount, 'subTotal')}

                {(!discountPerItem) && (
                    <View style={[styles.subContainer, styles.discount]}>
                        <View>
                            <Text style={styles.amountHeading}>
                                {Lng.t("estimates.discount")}
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
                                items={ESTIMATE_DISCOUNT_OPTION}
                                onChangeCallback={(val) => setFormField('discount_type', val)}
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

                {estimate.taxes.all.map((tax, index) => getAmountView(tax, styles.subAmount, index))}

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
                                    {Lng.t("estimates.taxPlaceholder")}
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
                    label: Lng.t("estimates.totalAmount"),
                    amount: estimate.amounts.final,
                }, styles.finalAmount, 'totalAmount')}
            </View>
        )
    };

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={() => onSaveEstimate(ESTIMATE_ACTIONS.VIEW)}
                    btnTitle={Lng.t("button.viewPdf")}
                    type={BUTTON_TYPE.OUTLINE}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                    loading={loading}
                />

                <CtButton
                    onPress={() => onSaveEstimate('save')}
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
            case ESTIMATE_ACTIONS.VIEW:
                onSaveEstimate(action);
                break;

            case ESTIMATE_ACTIONS.SEND:
                changeEstimateStatus({ id, action: 'send', navigation });
                break;

            case ESTIMATE_ACTIONS.MARK_AS_SENT:
                changeEstimateStatus && changeEstimateStatus({ id, action: 'mark-as-sent', navigation });
                break;

            case ESTIMATE_ACTIONS.MARK_AS_ACCEPTED:
                changeEstimateStatus && changeEstimateStatus({ id, action: 'accept', navigation });
                break;

            case ESTIMATE_ACTIONS.MARK_AS_REJECTED:
                changeEstimateStatus && changeEstimateStatus({ id, action: 'reject', navigation });
                break;

            case ESTIMATE_ACTIONS.CONVERT_TO_INVOICE:
                alertMe({
                    desc: Lng.t("estimates.alert.convertToInvoiceDescription"),
                    showCancel: true,
                    okPress: () => convertToInvoice({ id, onResult: navigation.goBack }),
                });
                break;

            case ESTIMATE_ACTIONS.DELETE:
                alertMe({
                    title: Lng.t("alert.title"),
                    desc: Lng.t("estimates.alert.removeDescription"),
                    showCancel: true,
                    okPress: () => removeEstimate({ id, onResult: navigation.goBack }),
                });
                break;

            default:
                break;
        }

    }

    const isEditEstimate = (type === ESTIMATE_EDIT);

    const hasMark = (markAsStatus === MARK_AS_ACCEPT) || (markAsStatus === MARK_AS_REJECT) || (markAsStatus === MARK_AS_SENT);

    const drownDownProps = (isEditEstimate && !initLoading) ? {
        options: EDIT_ESTIMATE_ACTIONS(markAsStatus),
        onSelect: onOptionSelect,
        cancelButtonIndex: hasMark ? 5 : 6,
        destructiveButtonIndex: hasMark ? 4 : 5
    } : null;

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: onDraft,
                title: isEditEstimate ? Lng.t("header.editEstimate") : Lng.t("header.addEstimate"),
                titleStyle: headerTitle({ marginLeft: -15, marginRight: -15 }),
                rightIcon: !isEditEstimate ? 'save' : null,
                rightIconPress: () => onSaveEstimate('save'),
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
                            name={'estimate_date'}
                            isRequired
                            component={DatePickerField}
                            label={Lng.t("estimates.estimateDate")}
                            icon={'calendar-alt'}
                            onChangeCallback={(val) => setFormField('estimate_date', val)}
                        />
                    </View>
                    <View style={styles.dateField}>
                        <Field
                            name="expiry_date"
                            isRequired
                            component={DatePickerField}
                            label={Lng.t("estimates.expiryDate")}
                            icon={'calendar-alt'}
                            onChangeCallback={(val) => setFormField('expiry_date', val)}
                        />
                    </View>
                </View>

                <Field
                    name="estimate_number"
                    component={FakeInput}
                    label={Lng.t("estimates.estimateNumber")}
                    isRequired
                    prefixProps={{
                        fieldName: "estimate_number",
                        prefix: estimate_prefix,
                        icon: 'hashtag',
                        iconSolid: false
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
                    label={Lng.t("estimates.customer")}
                    icon={'user'}
                    placeholder={customerName ? customerName :
                        Lng.t("estimates.customerPlaceholder")
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
                                setFormField('user_id', val.id);
                                setCurrencyValue(val.currency);
                            }
                        })
                    }
                    headerProps={{ title: Lng.t("customers.title") }}
                    listViewProps={{ hasAvatar: true }}
                    emptyContentProps={{
                        contentType: "customers",
                        image: IMAGES.EMPTY_CUSTOMERS,
                    }}
                />

                <Text style={[styles.inputTextStyle, styles.label]}>
                    {Lng.t("estimates.items")}
                    <Text style={styles.required}> *</Text>
                </Text>

                <ListView
                    items={estimate.items.selected}
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
                    items={estimate.items.available}
                    displayName="name"
                    component={SelectField}
                    hasPagination
                    apiSearch
                    getItems={getItems}
                    compareField="id"
                    valueCompareField="item_id"
                    icon={'percent'}
                    placeholder={Lng.t("estimates.addItem")}
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
                            navigation.navigate(ROUTES.ESTIMATE_ITEM, {
                                item,
                                currency,
                                type: ITEM_ADD,
                                discount_per_item,
                                tax_per_item
                            })
                        }
                    }
                    rightIconPress={
                        () => navigation.navigate(ROUTES.ESTIMATE_ITEM, {
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
                    hint={Lng.t("estimates.notes")}
                    inputProps={{
                        returnKeyType: 'next',
                        placeholder: Lng.t("estimates.notePlaceholder"),
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={80}
                    hintStyle={styles.noteHintStyle}
                    autoCorrect={true}
                />

                <Field
                    name="estimate_template_id"
                    templates={estimateTemplates}
                    component={TemplateField}
                    label={Lng.t("estimates.template")}
                    icon={'file-alt'}
                    placeholder={Lng.t("estimates.templatePlaceholder")}
                    navigation={navigation}
                />
            </View>
        </DefaultLayout>
        );
}

export const Estimate = (props: IProps) => {
    const {
        navigation,
        id,
        type,
        initialValues,
        createEstimate,
        editEstimate,
    } = props;

    const onSaveEstimate = (estimate) => {
        type === ESTIMATE_ADD ?
            createEstimate({
                estimate,
                onResult: (url) => {
                    if (status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.goBack()
                }
            }) :
            editEstimate({
                estimate: { ...estimate, id },
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
            onSubmit={onSaveEstimate}
        >
            { ({ handleSubmit, form }) => (
                <EstimateContent
                    {...props}
                    form={form}
                    handleSubmit={handleSubmit}
                />
            )}
        </Form>
    );
}
