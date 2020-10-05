// @flow

import React, { useState } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    StatusBar,
    ScrollView,
    Platform
} from 'react-native';
import styles from './styles';
import { Field } from 'redux-form';
import { InputField, CtButton, AssetImage, CtGradientButton, CtHeader } from '../../../../components';
import Lng from '../../../../api/lang/i18n';
import { ROUTES } from '../../../../navigation/routes';
import { IMAGES } from '../../../../config';
import { alertMe } from '../../../../api/global';

type IProps = {
    label: String,
    icon: String,
    placeholder: String,
    containerStyle: Object,
    rightIcon: String,
    leftIcon: String,
    color: String,
    value: String,
    items: Object,
    rightIcon: String,
    loading: Boolean,
    checkEndpointApi: Function
};

export const Endpoint = (props: IProps) => {
    const {
        handleSubmit,
        loading,
        navigation,
        skipEndpoint = false,
        checkEndpointApi,
    } = props;

    const [isFocus, setFocus] = useState(false);

    const onSetEndpointApi = ({ endpointURL }) => {

        setFocus(false)

        let URL = endpointURL

        checkEndpointApi({
            endpointURL: !(URL.charAt(URL.length - 1) === '/') ? URL
                : URL.slice(0, -1),
            onResult: (val) => {
                !val ? alertMe({ title: Lng.t("endpoint.alertInvalidUrl") }) :
                    navigation.navigate(ROUTES.LOGIN)

            }
        })
    }

    const onBack = () => navigation.navigate(ROUTES.SETTING_LIST);

    const toggleFocus = () => setFocus(!isFocus);

    return (
        <View style={styles.container}>

            {skipEndpoint ? (
                <CtHeader
                    leftIcon="angle-left"
                    leftIconPress={onBack}
                    title={Lng.t("header.back")}
                    titleOnPress={onBack}
                    titleStyle={{ marginLeft: -10, marginTop: Platform.OS === 'ios' ? -1 : 2 }}
                    placement="left"
                    noBorder
                    transparent
                />
            ) : (
                    <StatusBar
                        barStyle="dark-content"
                        hidden={false}
                        translucent={true}
                    />
                )}

            <ScrollView
                style={{ paddingTop: skipEndpoint ? '18%' : '32%' }}
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
                        <View>
                            <Field
                                name="endpointURL"
                                component={InputField}
                                hint={Lng.t("endpoint.endpointURL")}
                                inputProps={{
                                    autoCapitalize: 'none',
                                    placeholder: Lng.t("endpoint.urlPlaceHolder"),
                                    autoCorrect: true,
                                    keyboardType: "url",
                                    onSubmitEditing: toggleFocus
                                }}
                                onFocus={toggleFocus}
                                inputContainerStyle={styles.inputField}
                            />
                            <Text style={styles.endpointTextTitle}>
                                {Lng.t("endpoint.endpointDesc")}
                            </Text>
                        </View>

                        <CtGradientButton
                            onPress={handleSubmit(onSetEndpointApi)}
                            btnTitle={Lng.t("button.save")}
                            loading={isFocus ? false : loading}
                            style={styles.buttonStyle}
                            buttonContainerStyle={styles.buttonContainer}
                        />

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}
