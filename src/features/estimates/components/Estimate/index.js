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
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import {
    ESTIMATE_ADD,
    ESTIMATE_EDIT,
    ITEM_ADD,
    ITEM_EDIT,
    ESTIMATE_ACTIONS,
    EDIT_ESTIMATE_ACTIONS,
    MARK_AS_ACCEPT, MARK_AS_REJECT, MARK_AS_SENT
} from '../../constants';
import { BUTTON_TYPE } from '../../../../api/consts/core';
import { colors } from '../../../../styles/colors';
import { TemplateField } from '../TemplateField';
import { setOnBackHandler, removeBackHandler } from '../../../../navigation/actions';
import Lng from '../../../../api/lang/i18n';
import { ESTIMATE_DISCOUNT_OPTION } from '../../constants';
import { CUSTOMER_ADD } from '../../../customers/constants';
import { IMAGES } from '../../../../config';
import { ADD_TAX } from '../../../settings/constants';
import { MAX_LENGTH, alertMe } from '../../../../api/global';
import { itemsDescriptionStyle } from '../../../invoices/components/Invoice/styles';
import { headerTitle } from '../../../../api/helper';
import { validate } from '../../containers/Estimate/validation';

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

const estimateRefs = {
    taxes: [],
    discount: 0,
    discount_type: 'none',
    status: 'draft',
};

export const Estimate = (props: IProps) => {
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
        createEstimate,
        editEstimate,
        removeEstimate,
        convertToInvoice,
        changeEstimateStatus,
        initialValues,
    } = props;

    // const [taxTypeList, setTaxTypeList] = useState([]);
    const [currency, setCurrency] = useState({});
    // const [itemList, setItemList] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [markAsStatus, setMarkAsStatus] = useState(null);

    useEffect(() => {
        type === ESTIMATE_EDIT ?
            getEditEstimate({
                id,
                onResult: ({ user, status }) => {
                    setCurrency(user.currency);
                    setCustomerName(user.name);
                    setMarkAsStatus(status);
                }
            }) :
            getCreateEstimate({ onResult: (val) => setCurrency(val.currency) });

        getEstimateItemList(estimateItems);

        setOnBackHandler(onDraft);

        return () => {
            const { clearEstimate } = props;
            clearEstimate();
            removeBackHandler();
        }
    }, []);

    const setFormField = (field, value) => {
        estimateRefs.form.change(field, value);
    };

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
        estimateRefs.status = status;
        estimateRefs.handleSubmit();
    }

    const onSubmitEstimate = (values) => {
        if (finalAmount() < 0) {
            alert(Lng.t("estimates.alert.lessAmount"));
            return;
        }

        let estimate = {
            ...values,
            estimate_number: `${estimate_prefix}-${values.estimate_number}`,
            total: finalAmount(),
            sub_total: estimateSubTotal(),
            tax: estimateTax() + estimateCompoundTax(),
            discount_val: totalDiscount(),
            taxes: values.taxes ? values.taxes.map(val => {
                return {
                    ...val,
                    amount: val.compound_tax ?
                        getCompoundTaxValue(val.percent) : getTaxValue(val.percent),
                }
            }) : [],
        }

        if (estimateRefs.status === 'send') {
            estimate.estimateSend = true
        }

        type === ESTIMATE_ADD ?
            createEstimate({
                estimate,
                onResult: (url) => {
                    if (estimateRefs.status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.goBack()
                }
            }) :
            editEstimate({
                estimate: { ...estimate, id },
                onResult: (url) => {
                    if (estimateRefs.status === 'download') {
                        Linking.openURL(url);
                    }
                    navigation.goBack();
                }
            })
    };

    const estimateSubTotal = () => {
        let subTotal = 0
        estimateItems.map(val => {
            subTotal += JSON.parse(val.total)
        })

        return JSON.parse(subTotal)
    }

    const subTotal = () => {
        let estimateTax = 0
        estimateItemTotalTaxes().filter(val => {
            estimateTax += val.amount
        })
        return (estimateSubTotal() + estimateTax) - totalDiscount()
    }

    const estimateTax = () => {
        let totalTax = 0

        estimateRefs.taxes && estimateRefs.taxes.map(val => {
            if (!val.compound_tax) {
                totalTax += getTaxValue(val.percent)
            }
        })

        return totalTax
    }

    const estimateCompoundTax = () => {
        let totalTax = 0

        estimateRefs.taxes && estimateRefs.taxes.map(val => {
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
        const type = taxTypes && taxTypes.filter(val => val.fullItem.id === tax.tax_type_id)

        if (type.length > 0) {
            taxName = type[0]['fullItem'].name
        }
        return taxName
    }

    const totalDiscount = () => {
        return estimateRefs.discount_type === 'percentage' ?
            (estimateRefs.discount * estimateSubTotal()) / 100 : estimateRefs.discount * 100;
    }

    const totalAmount = () => {
        return subTotal() + estimateTax()
    }

    const finalAmount = () => {
        return totalAmount() + estimateCompoundTax()
    }

    const estimateItemTotalTaxes = () => {
        let taxes = []
        estimateItems.map(val => {
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

    const FINAL_AMOUNT = (form) => {
        let taxPerItem = !(tax_per_item === 'NO' || typeof tax_per_item === 'undefined' || tax_per_item === null)

        let discountPerItem = !(discount_per_item === 'NO' || typeof discount_per_item === 'undefined' || discount_per_item === null)

        return (
            <View style={styles.amountContainer}>
                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.amountHeading}>
                            {Lng.t("estimates.subtotal")}
                        </Text>
                    </View>
                    <View>
                        <CurrencyFormat
                            amount={estimateSubTotal()}
                            currency={currency}
                            style={styles.subAmount}
                        />
                    </View>
                </View>

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
                                onChangeCallback={(val) => form.change('discount_type', val)}
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

                {estimateRefs.taxes &&
                    estimateRefs.taxes.map((val, index) => !val.compound_tax ? (
                        <View style={styles.subContainer} key={index}>
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

                {estimateRefs.taxes &&
                    estimateRefs.taxes.map((val, index) => val.compound_tax ? (
                        <View style={styles.subContainer} key={index}>
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
                                onSelect: (val) => form.change('taxes', [...val, ...estimateRefs.taxes])
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
                            {Lng.t("estimates.totalAmount")}:
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

    const DISPLAY_ITEM_TAX = () => {
        let taxes = estimateItemTotalTaxes()

        return taxes ? (
            taxes.map((val, index) => (
                <View style={styles.subContainer} key={index}>
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

    const getEstimateItemList = (estimateItems) => {
        setFormField('items', estimateItems)

        let estimateItemList = []

        if (typeof estimateItems !== 'undefined' && estimateItems.length != 0) {

            estimateItemList = estimateItems.map((item) => {

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

        return estimateItemList
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
        <Form validate={validate} initialValues={initialValues} onSubmit={onSubmitEstimate}>
        {({ handleSubmit, form }) => {
            const formValues = form.getState().values || {};
            const { taxes, discount, discount_type } = formValues;
            estimateRefs.handleSubmit = handleSubmit;
            estimateRefs.form = form;
            estimateRefs.taxes = taxes;
            estimateRefs.discount = discount;
            estimateRefs.discount_type = discount_type;

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
                                onChangeCallback={(val) => form.change('estimate_date', val)}
                            />
                        </View>
                        <View style={styles.dateField}>
                            <Field
                                name="expiry_date"
                                isRequired
                                component={DatePickerField}
                                label={Lng.t("estimates.expiryDate")}
                                icon={'calendar-alt'}
                                onChangeCallback={(val) => form.change('expiry_date', val)}
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
                        onSelect={(item) => {
                            form.change('user_id', item.id)
                            setCurrency(item.currency)
                        }}
                        rightIconPress={
                            () => navigation.navigate(ROUTES.CUSTOMER, {
                                type: CUSTOMER_ADD,
                                currency,
                                onSelect: (val) => {
                                    form.change('user_id', val.id)
                                    setCurrency(val.currency)
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
                        items={getEstimateItemList(estimateItems)}
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

                    {FINAL_AMOUNT(form)}

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
        }}
        </Form>
    );
}
