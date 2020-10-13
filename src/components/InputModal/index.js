import React from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { styles } from './styles'
import { AnimateModal } from '../AnimateModal';
import { Field } from 'react-final-form';
import { InputField } from '../InputField';
import { CtButton } from '../Button';
import { BUTTON_COLOR } from '~/api/consts';
import Lng from '~/api/lang/i18n';
import { colors } from '~/styles/colors';

type Iprops = {
    modalProps: Object,
    headerTitle: String,
    hint: String,
    fieldName: String,
    onToggle: Function,
    onRemove: Function,
    onSubmit: Function,
    visible: Boolean,
    showRemoveButton: Boolean,
}

export const InputModal = (props: IProps) => {
    const {
        modalProps,
        onToggle,
        visible = false,
        showRemoveButton = false,
        onSubmitLoading = false,
        onRemoveLoading = false,
        onRemove,
        onSubmit,
        fieldName,
        hint,
        headerTitle,
    } = props;

    const BUTTON_VIEW = (
        <View style={styles.rowViewContainer}>
            {showRemoveButton && (
                <View style={styles.rowView}>
                    <CtButton
                        onPress={() => onRemove?.()}
                        btnTitle={Lng.t("button.remove")}
                        containerStyle={styles.handleBtn}
                        buttonColor={BUTTON_COLOR.DANGER}
                        loading={onRemoveLoading}
                    />
                </View>
            )}

            <View style={styles.rowView}>
                <CtButton
                    onPress={() => onSubmit?.()}
                    btnTitle={Lng.t("button.save")}
                    containerStyle={styles.handleBtn}
                    loading={onSubmitLoading}
                />
            </View>
        </View>
    );

    const FIELD = (
        <View style={styles.fieldView}>
            <KeyboardAvoidingView
                keyboardVerticalOffset={0}
                behavior="position"
            >
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                >
                    <Field
                        name={fieldName}
                        component={InputField}
                        hint={hint}
                        inputProps={{
                            returnKeyType: 'next',
                            autoCorrect: true
                        }}
                        isRequired
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );

    const HEADER_VIEW = (
        <View style={styles.rowViewContainer}>
            <View style={styles.rowView}>
                <Text style={styles.heading}>{headerTitle}</Text>
            </View>
            <View>
                <Icon
                    name="times"
                    size={28}
                    color={colors.dark}
                    onPress={() => onToggle && onToggle()}
                />
            </View>
        </View>
    );

    return (
        <AnimateModal
            visible={visible}
            onToggle={() => onToggle && onToggle()}
            modalProps={{ ...modalProps }}
        >
            <View style={styles.modalViewContainer}>

                {HEADER_VIEW}

                {FIELD}

                {BUTTON_VIEW}

            </View>
        </AnimateModal>
    );
}
