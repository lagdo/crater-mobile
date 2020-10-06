// @flow

import React, { useState } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Field } from 'redux-form';
import styles from './styles';
import {
    InputField,
    AssetImage,
    CtGradientButton,
    CtHeader,
    CtButton
} from '../../../../components';
import { Text } from 'react-native-elements';
import { IMAGES } from '../../../../config';
import Lng from '../../../../api/lang/i18n';

type IProps = {
    navigation: Object,
    sendForgotPasswordMail: Function,
    handleSubmit: Function,
    loading: Boolean,
    socialLoading: Boolean,
}
export const ForgotPassword = (props: IProps) => {
    const {
        handleSubmit,
        navigation,
        loading,
        sendForgotPasswordMail,
    } = props;

    const [lastEmail, setLastEmail] = useState('');
    const [isMailSent, setMailSent] = useState(false);

    const onSendMail = ({ email }) => {
        sendForgotPasswordMail({
            email,
            navigation,
            onResult: (val) => {
                if (val) {
                    setLastEmail(email);
                    setMailSent(true);
                }
            },
        });
    };

    const resendMail = () => {
       onSendMail({ email: lastEmail });
    };

    let passwordInput = {};

    return (
        <View style={styles.container}>
            {!isMailSent ? (
                <CtHeader
                    leftIcon="angle-left"
                    leftIconPress={() => navigation.goBack(null)}
                    title={Lng.t("header.back")}
                    titleOnPress={() => navigation.goBack(null)}
                    titleStyle={{ marginLeft: -10, marginTop: Platform.OS === 'ios' ? -1 : 2 }}
                    placement="left"
                    noBorder
                    transparent
                />
            ) : (
                    <CtHeader
                        placement="left"
                        transparent
                        rightIcon="times"
                        noBorder
                        rightIconPress={() => navigation.goBack(null)}
                    />
                )}

            <ScrollView
                style={{ paddingTop: !isMailSent ? '23%' : '8%' }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                    keyboardVerticalOffset={0}
                    behavior="height"
                >
                    <View style={styles.main}>
                        <View style={styles.logoContainer}>
                            <AssetImage
                                imageSource={IMAGES.LOGO_DARK}
                                imageStyle={styles.imgLogo}
                            />
                        </View>

                        {!isMailSent ? (
                            <View>
                                <Field
                                    name="email"
                                    component={InputField}
                                    inputProps={{
                                        returnKeyType: 'go',
                                        autoCapitalize: 'none',
                                        placeholder: Lng.t("forgot.emailPlaceholder"),
                                        autoCorrect: true,
                                        keyboardType: 'email-address',
                                        onSubmitEditing: handleSubmit(onSendMail),
                                    }}
                                    inputContainerStyle={styles.inputField}
                                />
                                <Text style={styles.forgotTextTitle}>
                                    {Lng.t("forgot.emailLabel")}
                                </Text>
                            </View>
                        ) : (
                                <View style={styles.SendingMailContainer}>
                                    <AssetImage
                                        imageSource={IMAGES.OPEN_ENVELOP}
                                        imageStyle={styles.imgLogo}
                                    />
                                    <Text style={styles.emailSendDescription}>
                                        {Lng.t("forgot.emailSendDescription")}
                                    </Text>
                                </View>
                            )}
                        {!isMailSent ? (
                            <CtGradientButton
                                onPress={handleSubmit(onSendMail)}
                                btnTitle={Lng.t("button.recoveryEmail")}
                                loading={loading}
                                style={styles.buttonStyle}
                                buttonContainerStyle={styles.buttonContainer}
                            />
                        ) : (
                                <CtGradientButton
                                    onPress={resendMail}
                                    btnTitle={Lng.t("button.recoveryEmailAgain")}
                                    loading={loading}
                                    style={styles.buttonStyle}
                                    buttonContainerStyle={styles.buttonContainer}
                                />
                            )}
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}
