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

type IProps = {
    navigation: Object,
    handleSubmit: Function,
    getAccountLoading: Boolean,
}
export const Notification = (props: IProps) => {
    const {
        navigation,
        handleSubmit,
        getSettingItemLoading,
        getSettingItem,
        editSettingItem,
    } = props;

    const [invoiceStatus, setInvoiceStatus] = useState(null);
    const [estimateStatus, setEstimateStatus] = useState(null);
    // const [email, setEmail] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

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
    }, []);

    useEffect(() => {
        toastMsg && setTimeout(() => setToastMsg(null), 2500);
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

    const toggleToast = (msg) => setToastMsg(msg);

    let toastMessage = toastMsg || '';

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.goBack(null),
                title: Lng.t("header.notifications"),
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
                message: Lng.t(toastMessage),
                visible: toastMessage,
                containerStyle: styles.toastContainer
            }}
        >
            <View style={styles.mainContainer}>

                <Field
                    name={"notification_email"}
                    component={InputField}
                    hint={Lng.t("settings.notifications.send")}
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
                    hint={Lng.t("settings.notifications.invoiceViewed")}
                    description={Lng.t("settings.notifications.invoiceViewedDescription")}
                    onChangeCallback={onInvoiceStatusChange}
                />

                <Field
                    name="notify_estimate_viewed"
                    component={ToggleSwitch}
                    status={estimateStatus === 'YES' ? true : false}
                    hint={Lng.t("settings.notifications.estimateViewed")}
                    description={Lng.t("settings.notifications.estimateViewedDescription")}
                    onChangeCallback={onEstimateStatusChange}
                    mainContainerStyle={{ marginTop: 12 }}
                />

            </View>
        </DefaultLayout>
    );
}
