// @flow

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import styles from './styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { FakeInput } from '../FakeInput';
import { connect } from 'react-redux';
import { DATE_FORMAT } from '../../api/consts';

type IProps = {
    label: String,
    icon: String,
    onChangeCallback: Function,
    containerStyle: Object,
    rightIcon: String,
    displayValue: Boolean,
    isRequired: Boolean,
};

export const DatePickerComponent = (props: IProps) => {
    const {
        label,
        containerStyle,
        meta,
        displayValue,
        isRequired = false,
        input,
        onChangeCallback,
        dateFormat,
        input: { value, onChange },
        filter,
        selectedDate,
        selectedDateValue,
    } = props;

    const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);
    const [dateTimePickerValue, setDateValue] = useState('');

    useEffect(() => {
        if (selectedDate && ((!value) === false)) {
            setDateValue(selectedDate);
            onChange(selectedDateValue);
        } else {
            if (value) {

                let displayDate = moment(value).format(dateFormat);
                let formDate = moment(value).format(DATE_FORMAT);

                setDateValue(displayDate);

                onChange(formDate);
            }
        }
    }, []);

    const showHideDateTimePicker = () => setDateTimePickerVisible(!isDateTimePickerVisible);

    const handleDatePicked = (date) => {
        let displayDate = moment(date).format(dateFormat);

        let formDate = moment(date).format(DATE_FORMAT);

        setDateValue(displayDate);

        showHideDateTimePicker();

        onChange(formDate);

        if (filter) {
            onChangeCallback && onChangeCallback(formDate, displayDate);
        }
        else
            onChangeCallback && onChangeCallback(formDate);
    };

    const getDate = (displayValue) => {
        if (displayValue) {
            return displayValue.format(dateFormat)
        }
        return null
    }

    const dateValue = displayValue || dateTimePickerValue;

    let pickerOption = {}

    if (dateValue) {
        pickerOption = { date: new Date(dateValue) }
    }

    return (
        <View style={styles.container}>

            <FakeInput
                label={label}
                icon={'calendar-alt'}
                values={
                    (displayValue && getDate(displayValue)) || (input.value ? dateTimePickerValue : ' ')
                }
                placeholder='  '
                onChangeCallback={showHideDateTimePicker}
                meta={meta}
                isRequired={isRequired}
                containerStyle={containerStyle}
            />

            <DateTimePicker
                isVisible={isDateTimePickerVisible}
                onConfirm={handleDatePicked}
                {...pickerOption}
                onCancel={showHideDateTimePicker}
            />
        </View>
    );
}

const mapStateToProps = ({ global }) => ({
    dateFormat: global.dateFormat,
});

const mapDispatchToProps = {};

export const DatePickerField = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DatePickerComponent);
