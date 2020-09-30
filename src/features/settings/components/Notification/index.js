// @flow

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import {
    DefaultLayout,
    CtButton,
    InputField,
    ToggleSwitch,
    CtDivider
} from '../../../../components';
import { Field, change } from 'redux-form';
import Lng from '../../../../api/lang/i18n';
import { NOTIFICATION } from '../../constants';
import { colors } from '../../../../styles/colors';
import { goBack, MOUNT, UNMOUNT } from '../../../../navigation/actions';


type IProps = {
    navigation: Object,
    handleSubmit: Function,
    language: String,
    getAccountLoading: Boolean,
}
export const Notification = (props: IProps) => {
    const {
        navigation,
        handleSubmit,
        language,
        getSettingItemLoading,
        getSettingItem,
        editSettingItem,
    } = props;

    const [invoiceStatus, setInvoiceStatus] = useState(null);
    const [estimateStatus, setEstimateStatus] = useState(null);
    // const [email, setEmail] = useState(null);

    useEffect(() => {
        getSettingItem({
            key: 'notify_invoice_viewed',
            onResult: (val) => {
                setInvoiceStatus(val !== null ? val : 'NO')
            }
        })

        getSettingItem({
            key: 'notify_estimate_viewed',
            onResult: (val) => {
                setEstimateStatus(val !== null ? val : 'NO')
            }
        })

        getSettingItem({
            key: 'notification_email',
            onResult: (val) => {
                setFormField('notification_email', val)
            }
        })

        goBack(MOUNT, navigation)

        return () => goBack(UNMOUNT);
    }, []);

    const toastMsg = navigation.getParam('toastMsg', null)

    useEffect(() => {
        toastMsg &&
            setTimeout(() => {
                navigation.setParams({ 'toastMsg': null })
            }, 2500);
    }, [toastMsg]);

    const setFormField = (field, value) => {
        props.dispatch(change(NOTIFICATION, field, value));
    };

    const onNotificationSubmit = ({ notification_email }) => {
        editSettingItem({
            params: {
                key: 'notification_email',
                value: notification_email
            },
            navigation
        })

    }

    const onInvoiceStatusChange = (status) => {
        editSettingItem({
            params: {
                key: 'notify_invoice_viewed',
                value: status === true ? 'YES' : 'NO'
            },
            onResult: () => { toggleToast('settings.notifications.invoiceViewedUpdated') }
        })
    }

    const onEstimateStatusChange = (status) => {
        editSettingItem({
            params: {
                key: 'notify_estimate_viewed',
                value: status === true ? 'YES' : 'NO'
            },
            onResult: () => { toggleToast('settings.notifications.estimateViewedUpdated') }
        })
    }

    const toggleToast = (msg) => {
        navigation.setParams({ "toastMsg": msg })
    }

    let toastMessage = navigation.getParam('toastMsg', '')

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: Lng.t("header.notifications", { locale: language }),
                placement: "center",
                rightIcon: "save",
                rightIconProps: {
                    solid: true,
                },
                leftIconStyle: { color: colors.dark2 },
                rightIconPress: handleSubmit(onNotificationSubmit),
            }}
            loadingProps={{
                is: getSettingItemLoading || invoiceStatus === null || estimateStatus === null
            }}
            toastProps={{
                message: Lng.t(toastMessage, { locale: language }),
                visible: toastMessage,
                containerStyle: styles.toastContainer
            }}
        >
            <View style={styles.mainContainer}>

                <Field
                    name={"notification_email"}
                    component={InputField}
                    hint={Lng.t("settings.notifications.send", { locale: language })}
                    inputProps={{
                        returnKeyType: 'next',
                        autoCapitalize: 'none',
                        autoCorrect: true,
                        keyboardType: 'email-address',
                    }}
                    leftIcon={'envelope'}
                    leftIconSolid={true}
                />

                <CtDivider
                    dividerStyle={styles.dividerLine}
                />

                <Field
                    name="notify_invoice_viewed"
                    component={ToggleSwitch}
                    status={invoiceStatus === 'YES' ? true : false}
                    hint={Lng.t("settings.notifications.invoiceViewed", { locale: language })}
                    description={Lng.t("settings.notifications.invoiceViewedDescription", { locale: language })}
                    onChangeCallback={onInvoiceStatusChange}
                />

                <Field
                    name="notify_estimate_viewed"
                    component={ToggleSwitch}
                    status={estimateStatus === 'YES' ? true : false}
                    hint={Lng.t("settings.notifications.estimateViewed", { locale: language })}
                    description={Lng.t("settings.notifications.estimateViewedDescription", { locale: language })}
                    onChangeCallback={onEstimateStatusChange}
                    mainContainerStyle={{ marginTop: 12 }}
                />

            </View>
        </DefaultLayout>
    );
}
