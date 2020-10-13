import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { ListView, InputModal, CtDivider } from '~/components';
import { formatListByName, alertMe } from '~/api/global';
import Lng from '~/api/lang/i18n';

export const Units = forwardRef((props, ref) => {
    const {
        navigation,
        units,
        setFormField,
        itemUnitLoading = false,
        formValues: { unitName = "", unitId = null } = {},
        createItemUnit,
        editItemUnit,
        removeItemUnit,
    } = props

    const [visible, setVisible] = useState(false);
    const [isCreateMethod, setCreateMethod] = useState(true);

    // Make the openModal() function available to the parent component using the ref.
    useImperativeHandle(ref, () => ({ openModal }));

    const onToggle = () => setVisible(!visible);

    const onSave = () => {
        const params = {
            id: unitId,
            name: unitName
        }

        if (unitName) {
            onToggle()

            isCreateMethod ? createItemUnit({ params }) :
                editItemUnit({ params, id: unitId })
        }
    }

    const onRemove = () => {
        alertMe({
            title: Lng.t("alert.title"),
            desc: Lng.t("items.alertUnit"),
            showCancel: true,
            okPress: () => {
                onToggle()
                removeItemUnit({ id: unitId })
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
                    Lng.t("items.addUnit") :
                    Lng.t("items.editUnit")
                }
                hint={Lng.t("items.unitHint")}
                fieldName="unitName"
                onSubmit={onSave}
                onRemove={onRemove}
                showRemoveButton={!isCreateMethod}
                onSubmitLoading={itemUnitLoading}
                onRemoveLoading={itemUnitLoading}
            />
        )
    }

    const onSelectUnit = ({ name, id }) => {
        setFormField("unitId", id)
        openModal(name)
    }

    const openModal = (name = "") => {
        setCreateMethod(name ? false : true)
        setFormField("unitName", name)
        onToggle()
    }

    return (
        <View style={styles.bodyContainer}>
            {IMPORT_INPUT_MODAL()}

            <View>
                <ListView
                    items={formatListByName(units)}
                    getFreshItems={(onHide) => {
                        onHide && onHide()
                    }}
                    onPress={onSelectUnit}
                    isEmpty={units ? units.length <= 0 : true}
                    bottomDivider
                    contentContainerStyle={{ flex: 3 }}
                    emptyContentProps={{
                        title: Lng.t("payments.empty.modeTitle"),
                    }}
                    itemContainer={{
                        paddingVertical: 8
                    }}
                />
            </View>
        </View>
    );
})
