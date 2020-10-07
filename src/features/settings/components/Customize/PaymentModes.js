import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, ScrollView } from 'react-native';
import styles from './styles';
import { ListView, InputModal } from '../../../../components';
import { formatListByName, alertMe } from '../../../../api/global';
import Lng from '../../../../api/lang/i18n';

export const PaymentModes = forwardRef((props, ref) => {
    const {
        navigation,
        formValues: { methodName = "", methodId = null } = {},
        createPaymentMode,
        editPaymentMode,
        removePaymentMode,
        paymentModeLoading = false,
        paymentMethods,
        setFormField,
    } = props;

    const [visible, setVisible] = useState(false);
    const [isCreateMethod, setCreateMethod] = useState(false);

    // Make the openModal() function available to the parent component using the ref.
    useImperativeHandle(ref, () => ({ openModal }));

    const onToggle = () => setVisible(!visible);

    const onSaveMethod = () => {
        const params = {
            id: methodId,
            name: methodName
        }

        if (methodName) {
            onToggle()

            isCreateMethod ? createPaymentMode({ params }) :
                editPaymentMode({ params, id: methodId })
        }
    }

    const onRemoveMethod = () => {
        alertMe({
            title: Lng.t("alert.title"),
            desc: Lng.t("payments.alertMode"),
            showCancel: true,
            okPress: () => {
                onToggle()
                removePaymentMode({ id: methodId })
            }
        })
    }

    const IMPORT_INPUT_MODAL = () => {
        return (
            <InputModal
                visible={visible}
                onToggle={onToggle}
                navigation={navigation}
                headerTitle={isCreateMethod ?
                    Lng.t("payments.addMode") :
                    Lng.t("payments.editMode")
                }
                hint={Lng.t("payments.modeHint")}
                fieldName="methodName"
                onSubmit={onSaveMethod}
                onRemove={onRemoveMethod}
                showRemoveButton={!isCreateMethod}
                onSubmitLoading={paymentModeLoading}
                onRemoveLoading={paymentModeLoading}
            />
        )
    }

    const onSelectPaymentMethod = ({ name, id }) => {
        setFormField("methodId", id)
        openModal(name)
    }

    const openModal = (name = "") => {
        setCreateMethod(name ? false : true)
        setFormField("methodName", name)
        onToggle()
    }

    return (
        <View style={styles.bodyContainer}>
            {IMPORT_INPUT_MODAL()}

            <View>
                <ListView
                    items={formatListByName(paymentMethods)}
                    getFreshItems={(onHide) => {
                        onHide && onHide()
                    }}
                    onPress={onSelectPaymentMethod}
                    isEmpty={paymentMethods ? paymentMethods.length <= 0 : true}
                    bottomDivider
                    contentContainerStyle={{ flex: 3 }}
                    emptyContentProps={{
                        title: Lng.t("payments.empty.modeTitle"),
                    }}
                />
            </View>
        </View>
    );
})
