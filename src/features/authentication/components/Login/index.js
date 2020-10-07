// @flow

import React, { useEffect } from 'react';
import {
    StatusBar,
    ScrollView,
    View,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity
} from 'react-native';
import { Form, Field } from 'react-final-form';
import styles from './styles';
import { InputField, AssetImage, CtGradientButton } from '../../../../components';
// import * as Google from 'expo-google-app-auth';
import { env, IMAGES } from '../../../../config';
import { colors } from '../../../../styles/colors';
import { ROUTES } from '../../../../navigation/routes';
import Lng from '../../../../api/lang/i18n';
import { validate } from '../../containers/Login/validation';

type IProps = {
    navigation: Object,
    login: Function,
    handleSubmit: Function,
    loading: Boolean,
    socialLoading: Boolean,
    endpointApi: String,
    endpointURL: String,
}

export const Login = (props: IProps) => {
    const {
        navigation,
        initialValues,
        loading,
        // socialLoading,
        login,
        // socialLogin,
    } = props;

    useEffect(() => {
        const { endpointApi, endpointURL } = props;
        if (!endpointApi || !endpointURL) {
            navigation.navigate(ROUTES.ENDPOINTS);
        }
    }, []);

    /*
     * Sign in with google
     const onSocialLogin = async () => {
         socialLogin({});
         try {
             const result = await Google.logInAsync({
                 androidClientId: env.GOOGLE_ANDROID_CLIENT_ID,
                 iosClientId: env.GOOGLE_IOS_CLIENT_ID,
                 scopes: ['profile', 'email'],
             });

             if (result.type === 'success') {
                 socialLogin({
                     idToken: result.idToken,
                     navigation,
                 });
             } else {
             }
         } catch (e) {
             // console.log(e);
         }
     }; */

    const onLogin = (values) => {
        login({
            params: values,
            navigation,
        });
    };

    const onForgotPassword = () => navigation.navigate(ROUTES.FORGOT_PASSWORD);

    let loginRefs = {}

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={onLogin}>
        { ({ handleSubmit }) => (
            <View style={styles.container}>
                <StatusBar
                    barStyle="dark-content"
                    hidden={false}
                    translucent={true}
                />

                <ScrollView
                    style={{ paddingTop: '34%' }}
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

                            <View style={styles.loginContainer}>
                                <Field
                                    name="username"
                                    component={InputField}
                                    inputProps={{
                                        returnKeyType: 'next',
                                        autoCapitalize: 'none',
                                        placeholder: Lng.t("login.email"),
                                        autoCorrect: true,
                                        keyboardType: 'email-address',
                                        onSubmitEditing: () => loginRefs.password.focus()
                                    }}
                                    placeholderColor={colors.white5}
                                    inputContainerStyle={styles.inputField}
                                />
                                <Field
                                    refLinkFn={(ref) => passwordInput = ref}
                                    name="password"
                                    component={InputField}
                                    inputProps={{
                                        returnKeyType: 'go',
                                        autoCapitalize: 'none',
                                        placeholder: Lng.t("login.password"),
                                        autoCorrect: true,
                                        onSubmitEditing: handleSubmit,
                                    }}
                                    inputContainerStyle={styles.inputField}
                                    secureTextEntry
                                    refLinkFn={(ref) => loginRefs.password = ref}
                                />

                                <View style={styles.forgetPasswordContainer}>
                                    <TouchableOpacity onPress={onForgotPassword}>
                                        <Text style={styles.forgetPassword}>
                                            {Lng.t("button.forget")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ marginTop: 25 }}>
                                <CtGradientButton
                                    onPress={handleSubmit}
                                    btnTitle={Lng.t("button.singIn")}
                                    loading={loading}
                                />
                            </View>


                            {/*
                            * Sign in with google


                            <CtDivider title="or" />

                            <View style={styles.socialLoginContainer}>
                                <CtButton
                                    raised
                                    imageSource={IMAGES.GOOGLE_ICON}
                                    imageIcon
                                    onPress={() => onSocialLogin()}
                                    btnTitle={Lng.t("button.singInGoogle")}
                                    loading={socialLoading}
                                    buttonType={BUTTON_COLOR.WHITE}
                                    color={colors.dark3}
                                />
                            </View>
                        */}
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        )}
        </Form>
    );
}
