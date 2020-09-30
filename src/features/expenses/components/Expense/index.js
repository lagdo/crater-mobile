// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Field, change } from 'redux-form';
import styles from './styles';
import {
    InputField,
    CtButton,
    DefaultLayout,
    FilePicker,
    SelectPickerField,
    DatePickerField,
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import { EXPENSE_FORM, EXPENSE_ADD, EXPENSE_EDIT, EXPENSE_ACTIONS, ACTIONS_VALUE } from '../../constants';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import Lng from '../../../../api/lang/i18n';
import { CATEGORY_ADD } from '../../../settings/constants';
import { Linking } from 'expo';
import moment from 'moment';
import { MAX_LENGTH, alertMe } from '../../../../api/global';

const IMAGE_TYPE = 'image'

export const Expense = (props) => {
    const {
        navigation,
        language,
        loading,
        type,
        getCreateExpense,
        getEditExpense,
        getReceipt,
        createExpense,
        clearExpense,
        editExpense,
        removeExpense,
        company: { unique_hash },
        endpointURL,
        handleSubmit,
        initLoading,
        categories,
        formValues,
    } = props;

    const [attachmentReceipt, setAttachmentReceipt] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [newCategory, setNewCategory] = useState([]);
    const [fileLoading, setFileLoading] = useState(false);
    const [fileType, setFileType] = useState(IMAGE_TYPE);

    useEffect(() => {
        if (type === EXPENSE_EDIT) {
            let id = navigation.getParam('id', null)

            getEditExpense({
                id,
                onResult: ({ media }) => {
                    media.length !== 0 ?
                        getReceipt({
                            id,
                            onResult: ({ image, type }) => {
                                setLoading(false)
                                setImageUrl(image)
                                setFileType(type.toLowerCase())
                            }
                        }) :
                        setLoading(false)
                }
            })
        } else {
            getCreateExpense({
                onResult: ({ categories }) => {

                    if (typeof categories === 'undefined' || categories.length === 0) {
                        alertMe({
                            title: Lng.t("expenses.noCategories", { locale: language }),
                            okText: 'Add',
                            okPress: () => navigation.navigate(ROUTES.CATEGORY, {
                                type: CATEGORY_ADD,
                                onSelect: onSelectCategory
                            }),
                            showCancel: true,
                            cancelPress: () => navigation.goBack(null)
                        })
                    }
                    else {
                        setLoading(false)
                    }
                }
            })
        }

        goBack(MOUNT, navigation)

        return () => {
            clearExpense()
            goBack(UNMOUNT)
        }
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(EXPENSE_FORM, field, value));
    };

    const onSubmitExpense = (value) => {
        if (!fileLoading && !loading) {
            type === EXPENSE_ADD ?
                createExpense({
                    params: value,
                    attachmentReceipt,
                    onResult: () => {
                        navigation.navigate(ROUTES.MAIN_EXPENSES)
                        clearExpense()
                    }
                }) :
                editExpense({
                    params: value,
                    id: navigation.getParam('id'),
                    attachmentReceipt,
                    onResult: () => {
                        navigation.navigate(ROUTES.MAIN_EXPENSES)
                        clearExpense()
                    }
                })
        }

    };

    const onRemoveExpense = () => {
        alertMe({
            title: Lng.t("alert.title", { locale: language }),
            desc: Lng.t("expenses.alertDescription", { locale: language }),
            showCancel: true,
            okPress: () => removeExpense({
                id: navigation.getParam('id', null),
                navigation
            })
        })
    }

    const onOptionSelect = (action) => {
        if (action == ACTIONS_VALUE.REMOVE) {
            onRemoveExpense()
        } else if (action == ACTIONS_VALUE.DOWNLOAD) {
            const id = navigation.getParam('id')
            Linking.openURL(`${endpointURL}/expenses/${id}/receipt/${unique_hash}`)
        }
    }

    const onSelectCategory = (val) => {
        setNewCategory(val)
        setLoading(false)
        setFormField('expense_category_id', val.id)
        setFormField('expense_date', moment())
    }

    const getCategoryList = ({ name, id }) => {
        let Category = { label: name, value: id }
        return Category
    }

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(onSubmitExpense)}
                    btnTitle={Lng.t("button.save", { locale: language })}
                    loading={loading || fileLoading}
                />
            </View>
        )
    }


    let CategoriesName = []

    if (typeof categories !== 'undefined' && categories.length != 0) {
        CategoriesName = categories.map((category) => {
            return getCategoryList(category)
        })
    }

    if (newCategory && newCategory.length !== 0)
        CategoriesName.push(getCategoryList(newCategory))

    const isCreateExpense = (type === EXPENSE_ADD)

    let expenseRefs = {}
    let newCategoryLoading = !(newCategory && newCategory.length === 0)
    let gLoading = !newCategoryLoading ? (initLoading || isLoading) : false

    let drownDownProps = (type === EXPENSE_EDIT && !gLoading) ? {
        options: EXPENSE_ACTIONS(Lng, language, imageUrl),
        onSelect: onOptionSelect,
        cancelButtonIndex: imageUrl ? 2 : 1,
        destructiveButtonIndex: imageUrl ? 1 : 2
    } : null

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => {
                    navigation.goBack(null)
                    clearExpense()
                },
                title: isCreateExpense ?
                    Lng.t("header.addExpense", { locale: language }) :
                    Lng.t("header.editExpense", { locale: language }),
                placement: "center",
                rightIcon: isCreateExpense ? 'save' : null,
                rightIconPress: handleSubmit(onSubmitExpense),
                rightIconProps: {
                    solid: true
                }
            }}
            bottomAction={BOTTOM_ACTION()}
            loadingProps={{
                is: gLoading
            }}
            dropdownProps={drownDownProps}
        >

            <View style={styles.bodyContainer}>

                <Field
                    name="attachment_receipt"
                    component={FilePicker}
                    mediaType={'All'}
                    label={Lng.t("expenses.receipt", { locale: language })}
                    navigation={navigation}
                    onChangeCallback={(val) => setAttachmentReceipt(val)}
                    imageUrl={fileType.indexOf(IMAGE_TYPE) === 0 ? imageUrl : null}
                    containerStyle={styles.filePicker}
                    fileLoading={(val) => setFileLoading(val)}
                />

                {!gLoading && formValues.expense_date && (<Field
                    name="expense_date"
                    component={DatePickerField}
                    isRequired
                    label={Lng.t("expenses.date", { locale: language })}
                    icon={'calendar-alt'}
                />)}


                <Field
                    name="amount"
                    component={InputField}
                    isRequired
                    hint={Lng.t("expenses.amount", { locale: language })}
                    leftIcon={'dollar-sign'}
                    inputProps={{
                        returnKeyType: 'go',
                        keyboardType: 'numeric',
                        onSubmitEditing: () => expenseRefs.category.focus()
                    }}
                    isCurrencyInput
                    inputFieldStyle={styles.inputFieldStyle}
                />

                <Field
                    name="expense_category_id"
                    component={SelectPickerField}
                    isRequired
                    label={Lng.t("expenses.category", { locale: language })}
                    fieldIcon='align-center'
                    items={CategoriesName}
                    onChangeCallback={(val) => {
                        setFormField('expense_category_id', val)
                    }}
                    defaultPickerOptions={{
                        label: Lng.t("expenses.categoryPlaceholder", { locale: language }),
                        value: '',
                    }}
                    containerStyle={styles.selectPicker}
                    refLinkFn={(ref) => {
                        expenseRefs.category = ref;
                    }}
                    onDonePress={() => expenseRefs.notes.focus()}
                />

                <Field
                    name={'notes'}
                    component={InputField}
                    hint={Lng.t("expenses.notes", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        placeholder: Lng.t("expenses.notesPlaceholder", { locale: language }),
                        autoCorrect: true,
                        multiline: true,
                        maxLength: MAX_LENGTH
                    }}
                    height={80}
                    autoCorrect={true}
                    refLinkFn={(ref) => {
                        expenseRefs.notes = ref;
                    }}
                />

            </View>
        </DefaultLayout>
    );
}
