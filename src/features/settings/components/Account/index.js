// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { DefaultLayout, CtButton, InputField, CtDivider, FilePicker } from '../../../../components';
import { Field, change } from 'redux-form';
import Lng from '../../../../api/lang/i18n';
import { EDIT_ACCOUNT } from '../../constants';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';
import { headerTitle } from '../../../../api/helper';
import { env, IMAGES } from '../../../../config';


let name = 'name'
let Email = 'email'
let password = 'password'
let cpassword = 'confirmPassword'

type IProps = {
    getAccount: Function,
    editAccount: Function,
    navigation: Object,
    language: String,
    handleSubmit: Function,
    isLoading: Boolean,
    editAccountLoading: Boolean
}
export const Account = (props: IProps) =>  {
    const {
        navigation,
        language,
        isLoading,
        handleSubmit,
        getAccount,
        editAccount,
        editAccountLoading,
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

        goBack(MOUNT, navigation);

        return () => goBack(UNMOUNT);
    }, []);

    const setFormField = (field, value) => {
        props.dispatch(change(EDIT_ACCOUNT, field, value));
    };

    const onProfileUpdate = (value) => {
        if (!fileLoading && !editAccountLoading) {
            editAccount({
                params: value,
                avatar,
                navigation
            })
        }
    }

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={handleSubmit(onProfileUpdate)}
                    btnTitle={Lng.t("button.save", { locale: language })}
                    loading={editAccountLoading || fileLoading}
                />
            </View>
        )
    }

    let accountRefs = {}

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: Lng.t("header.setting.account", { locale: language }),
                titleStyle: headerTitle({ marginLeft: -20, marginRight: -25 }),
                placement: "center",
                rightIcon: "save",
                rightIconProps: {
                    solid: true,
                },
                rightIconPress: handleSubmit(onProfileUpdate),
            }}
            bottomAction={BOTTOM_ACTION()}
            loadingProps={{
                is: isLoading
            }}
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
                    hint={Lng.t("settings.account.name", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCorrect: true,
                        onSubmitEditing: () => {
                            accountRefs.email.focus();
                        }
                    }}
                />

                <Field
                    name={Email}
                    component={InputField}
                    isRequired
                    hint={Lng.t("settings.account.email", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        keyboardType: 'email-address',
                        onSubmitEditing: () => {
                            accountRefs.password.focus();
                        }
                    }}
                    refLinkFn={(ref) => {
                        accountRefs.email = ref;
                    }}
                />

                <Field
                    name={password}
                    component={InputField}
                    hint={Lng.t("settings.account.password", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        onSubmitEditing: () => {
                            accountRefs.confirm.focus();
                        }
                    }}
                    secureTextEntry
                    secureTextIconContainerStyle={styles.eyeIcon}
                    refLinkFn={(ref) => {
                        accountRefs.password = ref;
                    }}
                />

                <Field
                    name={cpassword}
                    component={InputField}
                    hint={Lng.t("settings.account.confirmPassword", { locale: language })}
                    inputProps={{
                        returnKeyType: 'go',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        onSubmitEditing: handleSubmit(onProfileUpdate)
                    }}
                    secureTextEntry
                    secureTextIconContainerStyle={styles.eyeIcon}
                    refLinkFn={(ref) => {
                        accountRefs.confirm = ref;
                    }}
                />

                <CtDivider
                    dividerStyle={styles.dividerLine}
                />

                <View style={styles.versionContainer}>
                    <Text style={styles.versionTitle}>
                        {Lng.t("settings.account.version", { locale: language })}
                        {'  '}
                        <Text style={styles.version}>
                            {env.APP_VERSION}
                        </Text>
                    </Text>
                </View>

            </View>
        </DefaultLayout>
    );
}
