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
import { Form, Field } from 'react-final-form';
import styles from './styles';
import { InputField, CtButton, AssetImage, CtGradientButton, CtHeader } from '../../../../components';
import Lng from '../../../../api/lang/i18n';
import { IMAGES } from '../../../../config';
import { alertMe } from '../../../../api/global';
import { validate } from '../../containers/Endpoint/validation';

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
        loading,
        navigation,
        skipEndpoint = false,
        initialValues,
        checkEndpointApi,
    } = props;

    const [isFocus, setFocus] = useState(false);

    const onSetEndpointApi = ({ endpointURL }) => {

        setFocus(false)

        let URL = endpointURL

        checkEndpointApi({
            endpointURL: !(URL.charAt(URL.length - 1) === '/') ? URL : URL.slice(0, -1),
            onResult: (val) => {
                !val ? alertMe({ title: Lng.t("endpoint.alertInvalidUrl") }) : navigation.goBack();
            }
        })
    }

    const toggleFocus = () => setFocus(!isFocus);

    return (
        <Form validate={validate} initialValues={initialValues} onSubmit={onSetEndpointApi}>
        { ({ handleSubmit }) => (
            <View style={styles.container}>
                {skipEndpoint ? (
                    <CtHeader
                        leftIcon="angle-left"
                        leftIconPress={navigation.goBack}
                        title={Lng.t("header.back")}
                        titleOnPress={navigation.goBack}
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
                                onPress={handleSubmit}
                                btnTitle={Lng.t("button.save")}
                                loading={isFocus ? false : loading}
                                style={styles.buttonStyle}
                                buttonContainerStyle={styles.buttonContainer}
                            />

                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        )}
        </Form>
    );
}
