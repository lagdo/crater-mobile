import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StatusBar } from 'react-native';
import { Form, Field } from 'react-final-form';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';
import { DefaultLayout } from '../Layouts';
import { InputField } from '../InputField';
import { SelectField } from '../SelectField';
import { SelectPickerField } from '../SelectPickerField';
import { colors } from '../../styles/colors';
import { DatePickerField } from '../DatePickerField';
import { BUTTON_TYPE } from '../../api/consts';
import { CtButton } from '../Button';
import Lng from '../../api/lang/i18n';

type IProps = {
    visible: Boolean,
    onToggle: Function,
    onResetFilter: Function,
    onSubmitFilter: Function,
    headerProps: Object,
    inputFields: Object,
    dropdownFields: Object,
    selectFields: Object,
    datePickerFields: Object,
};

export const Filter = (props: IProps) => {
    const {
        headerProps,
        inputFields,
        dropdownFields,
        selectFields,
        datePickerFields,
        onSubmitFilter,
    } = props;

    const [visible, setVisible] = useState(false);
    const [counter, setCounter] = useState(0);

    const inputField = (fields, form) => {
        return fields.map((field, index) => {
            const { name, hint, inputProps } = field
            return (
                <View key={index}>
                    <Field
                        name={name}
                        component={InputField}
                        hint={hint}
                        inputProps={{
                            returnKeyType: 'next',
                            ...inputProps
                        }}
                        {...field}
                        leftIconStyle={field.leftIcon && styles.inputIconStyle}
                    />
                </View>
            )
        })
    }

    const selectField = (fields, form) => {
        return fields.map((field, index) => {
            const { name, items, onSelect, compareField = 'id' } = field;

            return (
                <View key={index}>
                    <Field
                        name={name}
                        items={items}
                        component={SelectField}
                        hasFirstItem={counter > 0 ? false : true}
                        {...field}
                        onSelect={(item) => {
                            form.change(name, item[compareField]);
                            onSelect(item);
                        }}
                    />
                </View>
            )
        })
    }

    const dropdownField = (fields, form) => {
        return fields.map((field, index) => {
            const { name, items } = field;

            return (
                <View key={index}>
                    <Field
                        name={name}
                        component={SelectPickerField}
                        items={items}
                        {...field}
                    />
                </View>
            )
        })
    }

    const datePickerField = (fields) => {
        return fields.map((field, index) => {
            const { name } = field

            return (
                <View
                    key={index}
                    style={styles.dateField}
                >
                    <Field
                        name={name}
                        component={DatePickerField}
                        filter={true}
                        {...field}
                    />
                </View>
            )
        })
    }

    const onToggleFilter = () => setVisible(!visible);

    const onSubmit = (values) => {

        let newCounter = 0

        for (key in values) {
            !(key === 'search') && newCounter++
        }

        setCounter(newCounter);

        onToggleFilter();

        onSubmitFilter(values);
    }

    const onClear = (form) => {

        const { search = '', onResetFilter } = props;

        form.reset();
        form.change('search', search);

        setCounter(0);

        onResetFilter && onResetFilter();
    }

    const BOTTOM_ACTION = (handleSubmit, form) => {
        return (
            <View style={styles.submitButton}>
                <CtButton
                    onPress={() => onClear(form)}
                    btnTitle={Lng.t("button.clear")}
                    type={BUTTON_TYPE.OUTLINE}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                />

                <CtButton
                    onPress={handleSubmit}
                    btnTitle={Lng.t("search.title")}
                    containerStyle={styles.handleBtn}
                    buttonContainerStyle={styles.buttonContainer}
                />
            </View>
        )
    }

    return (
        <Form onSubmit={onSubmit}>
        { ({ handleSubmit, form }) => (
            <View>
                <TouchableOpacity
                    onPress={onToggleFilter}
                    activeOpacity={0.4}
                >
                    <Icon
                        name={'filter'}
                        size={22}
                        color={colors.primary}
                        style={styles.filterIcon}
                    />

                    {counter > 0 && (
                        <View style={styles.counter}>
                            <Text style={styles.counterText}>
                                {counter}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    visible={visible}
                    onRequestClose={onToggleFilter}
                    hardwareAccelerated={true}
                >
                    <StatusBar
                        backgroundColor={colors.secondary}
                        barStyle={"dark-content"}
                        translucent={true}
                    />

                    <View style={styles.modalContainer}>
                        <DefaultLayout
                            headerProps={{
                                leftIcon: 'long-arrow-alt-left',
                                leftIconStyle: styles.backIcon,
                                title: Lng.t("header.filter"),
                                placement: "center",
                                rightIcon: "search",
                                hasCircle: false,
                                noBorder: false,
                                transparent: false,
                                leftIconPress: onToggleFilter,
                                rightIconPress: handleSubmit,
                                ...headerProps
                            }}
                            bottomAction={BOTTOM_ACTION(handleSubmit, form)}
                        >
                            <View style={styles.bodyContainer}>
                                {selectFields && selectField(selectFields, form)}

                                <View style={styles.dateFieldContainer}>
                                    {datePickerFields && datePickerField(datePickerFields, form)}
                                </View>

                                {dropdownFields && dropdownField(dropdownFields, form)}

                                {inputFields && inputField(inputFields, form)}
                            </View>
                        </DefaultLayout>
                    </View>
                </Modal>
            </View>
        )}
        </Form>
    );
}
