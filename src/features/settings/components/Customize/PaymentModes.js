import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import styles from './styles';
import { ListView, InputModal } from '../../../../components';
import { formatListByName, alertMe } from '../../../../api/global';
import Lng from '../../../../api/lang/i18n';

export const PaymentModes = (props) => {
    const {
        navigation,
        language,
        formValues: { methodName = "", methodId = null },
        createPaymentMode,
        editPaymentMode,
        removePaymentMode,
        paymentModeLoading = false,
        paymentMethods,
        setFormField,
    } = props;

    const [visible, setVisible] = useState(false);
    const [isCreateMethod, setCreateMethod] = useState(false);

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
            title: Lng.t("alert.title", { locale: language }),
            desc: Lng.t("payments.alertMode", { locale: language }),
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
                language={language}
                headerTitle={isCreateMethod ?
                    Lng.t("payments.addMode", { locale: language }) :
                    Lng.t("payments.editMode", { locale: language })
                }
                hint={Lng.t("payments.modeHint", { locale: language })}
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
                        title: Lng.t("payments.empty.modeTitle", { locale: language }),
                    }}
                />
            </View>
        </View>
    );
}
