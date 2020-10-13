// @flow

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';
import { FakeInput } from '../FakeInput';
import FakeInputStyle from '../FakeInput/styles';
import { colors } from '~/styles/colors';
import { isIosPlatform } from '~/api/helper';

type IProps = {
    hint: string,
    lightTheme: boolean,
    disabled: boolean,
    input: {
        onChange: Function,
        value: string,
    },
    meta: Object,
    fakeInputContainerStyle: Object,
    defaultPickerOptions: Object,
    items: Array<Object>,
    ref: Function,
    onChangeCallback: Function,
    refLinkFn: Function,
    onDonePress: Function,
    doneText: string,
    fieldIcon: string,
    containerStyle: Object,
    fakeInputValueStyle: Object,
    label: String,
    isRequired: Boolean,
    isFakeInput: Boolean,
};

export const SelectPickerField = (props: IProps) => {
    const {
        input: { value,  onChange },
        onChangeCallback,
        meta,
        hint,
        items,
        ref,
        disabled,
        isRequired,
        refLinkFn,
        doneText,
        fieldIcon,
        defaultPickerOptions,
        fakeInputContainerStyle,
        containerStyle,
        label,
        isFakeInput,
        fakeInputValueStyle,
    } = props;

    const [icon, setIcon] = useState('angle-down');
    const [initialValue, setInitialValue] = useState('');

    useEffect(() => {
        onChange(value);

        onChangeCallback && onChangeCallback(value);
    }, [value]);

    const toggleIcon = () => {
        setIcon(icon === 'angle-down' ? 'angle-up' : 'angle-down');
    };

    const onValueChange = (v) => {
        onChange(v);

        setInitialValue(v);

        onChangeCallback && onChangeCallback(v);
    };

    const onDonePress = (selectRef) => {
        const { onDonePress } = props;

        onDonePress && onDonePress();
    };

    let selectRef = null;
    let selected = items && items.find((item) => item.value === value);
    let selectedLabel = selected && (selected.displayLabel || selected.label);
    let selectedValue = selected && selected.value;

    let placeHolder = {
        ...{ color: colors.darkGray },
        ...defaultPickerOptions,
    };

    const pickerField = (
        <RNPickerSelect
            placeholder={defaultPickerOptions && placeHolder}
            items={items.map((item) => ({ ...item, color: colors.secondary }))}
            onValueChange={onValueChange}
            style={{
                inputIOS: {
                    ...styles.inputIOS,
                    ...(disabled ? styles.disabledSelectedValue : {}),
                    ...(fakeInputContainerStyle && fakeInputContainerStyle),
                    ...(!isFakeInput && { paddingLeft: 41 })
                },
                inputIOSContainer: {
                    ...(isFakeInput && { display: 'none' })
                },
                iconContainer: {
                    top: 13,
                    right: 11,
                },
                placeholder: {
                    fontSize: 15,
                },
            }}
            onOpen={toggleIcon}
            onClose={toggleIcon}
            value={typeof selectedValue !== 'undefined' && selectedValue}
            placeholderTextColor={colors.darkGray}
            ref={(dropdownRef = {}) => {
                refLinkFn &&
                    refLinkFn({
                        ...dropdownRef,
                        focus: () => dropdownRef && dropdownRef.togglePicker(),
                    })
                selectRef = dropdownRef && dropdownRef
            }}
            Icon={() => (
                <View>
                    <Icon
                        name={icon}
                        size={18}
                        color={colors.darkGray}
                    />
                </View>
            )}
            modalProps={{
                animationType: 'slide'
            }}
            disabled={disabled}
            onDonePress={() => onDonePress(selectRef)}
            doneText={doneText}
        >
            {!isIosPlatform() && (
                <View
                    style={[
                        styles.fakeInput,
                        fakeInputContainerStyle && fakeInputContainerStyle,
                    ]}
                >
                    <Text
                        numberOfLines={1}
                        style={[
                            FakeInputStyle.textValue,
                            { paddingRight: 5 },
                            fakeInputValueStyle && fakeInputValueStyle,
                            !isFakeInput && { paddingLeft: 39 },
                            !selectedValue && { color: colors.darkGray }
                        ]}
                    >
                        {!selectedLabel ?
                            (defaultPickerOptions && (defaultPickerOptions.displayLabel || defaultPickerOptions.label)) : selectedLabel
                        }
                    </Text>
                    <Icon
                        name={icon}
                        size={18}
                        color={colors.darkGray}
                        style={styles.rightIcon}
                    />
                </View>
            )}
        </RNPickerSelect>
    );

    const isFakeDisplay = isIosPlatform() && isFakeInput;

    return (
        <View>
            <FakeInput
                meta={meta}
                label={label}
                isRequired={isRequired}
                values={isFakeDisplay && (!selectedLabel ?
                    (defaultPickerOptions && (defaultPickerOptions.displayLabel || defaultPickerOptions.label)) : selectedLabel)}
                fakeInput={!isFakeDisplay && pickerField}
                fakeInputContainerStyle={isFakeDisplay && {
                    ...styles.inputIOS,
                    ...(disabled ? styles.disabledSelectedValue : {}),
                    ...(fakeInputContainerStyle && fakeInputContainerStyle),
                }}
                leftIcon={fieldIcon}
                disabled={disabled}
                valueStyle={fakeInputValueStyle}
                rightIcon={isFakeDisplay && icon}
                onChangeCallback={() => isFakeDisplay && selectRef.togglePicker()}
                containerStyle={containerStyle}
            />
            {isFakeDisplay && pickerField}
        </View>
    );
}
