// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Field, Form } from 'react-final-form';
import styles from './styles';
import { DefaultLayout, CtButton, InputField, CtDivider, FilePicker } from '../../../../components';
import Lng from '../../../../api/lang/i18n';
import { EDIT_ACCOUNT } from '../../constants';
import { headerTitle } from '../../../../api/helper';
import { env, IMAGES } from '../../../../config';
import { validate } from '../../containers/Account/validation';

let name = 'name'
let Email = 'email'
let password = 'password'
let cpassword = 'confirmPassword'

type IProps = {
    getAccount: Function,
    editAccount: Function,
    navigation: Object,
    handleSubmit: Function,
    isLoading: Boolean,
    editAccountLoading: Boolean
}

export const Account = (props: IProps) => {
    const {
        navigation,
        isLoading,
        getAccount,
        editAccount,
        editAccountLoading,
        initialValues,
    } = props;

    const [avatar, setAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [fileLoading, setFileLoading] = useState(false);

    useEffect(() => {
        getAccount({
            onResult: ({ avatar }) => {
                setAvatarUrl(avatar)
            }
        })
    }, []);

    const onProfileUpdate = (value) => {
        if (!fileLoading && !editAccountLoading) {
            editAccount({
                params: value,
                avatar,
                navigation
            })
        }
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("button.save")}
                    loading={editAccountLoading || fileLoading}
                />
            </View>
        )
    }

    let accountRefs = {}

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={onProfileUpdate}>
        { ({ handleSubmit }) => (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: Lng.t("header.setting.account"),
                    titleStyle: headerTitle({ marginLeft: -20, marginRight: -25 }),
                    placement: "center",
                    rightIcon: "save",
                    rightIconProps: {
                        solid: true,
                    },
                    rightIconPress: handleSubmit,
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{ is: isLoading }}
            >
                <View style={styles.mainContainer}>
                    <Field
                        name={"avatar"}
                        component={FilePicker}
                        navigation={navigation}
                        onChangeCallback={(val) => setAvatar(val)}
                        imageUrl={avatarUrl}
                        containerStyle={styles.avatarContainer}
                        fileLoading={(val) => setFileLoading(val)}
                        hasAvatar
                        imageContainerStyle={styles.imageContainerStyle}
                        imageStyle={styles.imageStyle}
                        loadingContainerStyle={styles.loadingContainerStyle}
                        defaultImage={IMAGES.DEFAULT_AVATAR}
                    />

                    <Field
                        name={name}
                        component={InputField}
                        isRequired
                        hint={Lng.t("settings.account.name")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true,
                            onSubmitEditing: () => accountRefs.email.focus()
                        }}
                    />

                    <Field
                        name={Email}
                        component={InputField}
                        isRequired
                        hint={Lng.t("settings.account.email")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            keyboardType: 'email-address',
                            onSubmitEditing: () => accountRefs.password.focus()
                        }}
                        refLinkFn={(ref) => accountRefs.email = ref}
                    />

                    <Field
                        name={password}
                        component={InputField}
                        hint={Lng.t("settings.account.password")}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            onSubmitEditing: () => accountRefs.confirm.focus()
                        }}
                        secureTextEntry
                        secureTextIconContainerStyle={styles.eyeIcon}
                        refLinkFn={(ref) => accountRefs.password = ref}
                    />

                    <Field
                        name={cpassword}
                        component={InputField}
                        hint={Lng.t("settings.account.confirmPassword")}
                        inputProps={{
                            returnKeyType: 'go',
                            autoCapitalize: 'none',
                            autoCorrect: true,
                            onSubmitEditing: handleSubmit
                        }}
                        secureTextEntry
                        secureTextIconContainerStyle={styles.eyeIcon}
                        refLinkFn={(ref) => accountRefs.confirm = ref}
                    />

                    <CtDivider
                        dividerStyle={styles.dividerLine}
                    />

                    <View style={styles.versionContainer}>
                        <Text style={styles.versionTitle}>
                            {Lng.t("settings.account.version")}
                            {'  '}
                            <Text style={styles.version}>
                                {env.APP_VERSION}
                            </Text>
                        </Text>
                    </View>
                </View>
            </DefaultLayout>
        )}
        </Form>
    );
}
