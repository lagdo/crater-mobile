// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import {
    InputField,
    CtButton,
    DefaultLayout
} from '../../../../components';
import { BUTTON_COLOR } from '../../../../api/consts/core';
import Lng from '../../../../api/lang/i18n';
import { CATEGORY_EDIT, CATEGORY_ADD } from '../../constants';
import { MAX_LENGTH, alertMe } from '../../../../api/global';
import { validate } from '../../containers/Category/validation';

type IProps = {
    navigation: Object,
    handleSubmit: Function,
    getEditCategory: Function,
    createCategory: Function,
    editCategory: Function,
    type: String,
    getEditCategoryLoading: Boolean,
    categoryLoading: Boolean,
}

export const Category = (props: IProps) => {
    const {
        navigation,
        id,
        getEditCategory,
        type,
        onFirstTimeCreateExpense,
        createCategory,
        editCategory,
        removeCategory,
        categoryLoading,
        getEditCategoryLoading,
    } = props;

    const [category, setCategory] = useState({});

    useEffect(() => {
        if (type === CATEGORY_EDIT) {
            getEditCategory({
                id,
                onResult: (val) => setCategory(val),
            });
        }
    }, []);

    const onSubmitCategory = (values) => {
        if (!categoryLoading) {
            if (type === CATEGORY_ADD)
                createCategory({
                    params: values,
                    onResult: (res) => {
                        onFirstTimeCreateExpense && onFirstTimeCreateExpense(res);
                        navigation.goBack();
                    }
                })
            else {
                editCategory({ id, params: values, navigation })
            }
        }
    };

    const onRemoveCategory = (name) => {
        alertMe({
            title: Lng.t("alert.title"),
            desc: Lng.t("categories.alertDescription"),
            showCancel: true,
            okPress: () => removeCategory({
                id,
                navigation,
                onResult: () => {
                    alertMe({ title: `${name} ${Lng.t("categories.alreadyUsed")}` })
                }
            })
        })
    }

    const BOTTOM_ACTION = (handleSubmit, name) => {
        return (
            <View style={[styles.submitButton, type === CATEGORY_EDIT && styles.multipleButton]}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("button.save")}
                    buttonContainerStyle={type === CATEGORY_EDIT && styles.flex}
                    containerStyle={styles.btnContainerStyle}
                    loading={categoryLoading}
                />

                {type === CATEGORY_EDIT &&
                    <CtButton
                        onPress={() => onRemoveCategory(name)}
                        btnTitle={Lng.t("button.remove")}
                        buttonColor={BUTTON_COLOR.DANGER}
                        containerStyle={styles.btnContainerStyle}
                        buttonContainerStyle={styles.flex}
                        loading={categoryLoading}
                    />
                }
            </View>
        )
    }

    let categoryRefs = {}

    return (
        <Form validate={validate} initialValues={category} onSubmit={onSubmitCategory}>
        { ({ handleSubmit, form }) => (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: type === CATEGORY_EDIT ?
                        Lng.t("header.editCategory") :
                        Lng.t("header.addCategory"),
                    placement: "center",
                    rightIcon: "save",
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit, form.getState().values?.name)}
                loadingProps={{ is: getEditCategoryLoading }}
            >
                <View style={styles.bodyContainer}>
                    <Field
                        name="name"
                        component={InputField}
                        isRequired
                        hint={Lng.t("categories.title")}
                        inputFieldStyle={styles.inputFieldStyle}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            autoFocus: true,
                            onSubmitEditing: () => categoryRefs.description.focus()
                        }}
                        validationStyle={styles.inputFieldValidation}
                    />

                    <Field
                        name="description"
                        component={InputField}
                        hint={Lng.t("categories.description")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            multiline: true,
                            maxLength: MAX_LENGTH
                        }}
                        height={100}
                        autoCorrect={true}
                        refLinkFn={(ref) => {
                            categoryRefs.description = ref;
                        }}
                    />
                </View>
            </DefaultLayout>
        )}
        </Form>
    );
}
