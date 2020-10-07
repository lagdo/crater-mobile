// @flow

import React, { useState } from 'react';
import { View } from 'react-native';
import { Field, change } from 'redux-form';
import styles from './styles';
import {
    CtButton,
    DefaultLayout,
    DatePickerField,
    SelectPickerField,
} from '../../../../components';
import { ROUTES } from '../../../../navigation/routes';
import {
    REPORT_FORM,
    SALES,
    PROFIT_AND_LOSS,
    EXPENSES, TAXES,
    DATE_RANGE_OPTION,
    REPORT_TYPE_OPTION,
    DATE_RANGE
} from '../../constants';
import { DATE_FORMAT, REPORT_DATE_FORMAT } from '../../../../api/consts/core';
import Lng from '../../../../api/lang/i18n';
import moment from 'moment';
import { Linking } from 'expo';
import { env } from '../../../../config';
import QueryString from 'qs';
import { headerTitle } from '../../../../api/helper';
import { store } from '../../../../store';

type IProps = {
    navigation: Object,
    taxTypes: Object,
    type: String,
    loading: Boolean,
    handleSubmit: Function,
}

export const Report = (props: IProps) => {
    const {
        navigation,
        handleSubmit,
        loading,
        initialValues,
        type,
        taxTypes,
    } = props;

    const [taxTypeList, setTaxTypeList] = useState(taxTypes);
    const [displayFromDate, setDisplayFromDate] = useState('');
    const [displayToDate, setDisplayToDate] = useState('');

    const setFormField = (field, value) => {
        props.dispatch(change(REPORT_FORM, field, value));
    };

    const saveReport = ({ to_date, from_date, report_type }) => {
        const { company, endpointURL } = props;

        const params = { from_date, to_date }

        const report = getReport({ reportType: report_type })

        Linking.openURL(`${endpointURL}/reports/${report}${company.unique_hash}?${QueryString.stringify(params)}`);
    };

    const getThisDate = (type, time) => {
        const date = moment()[type](time)

        type === 'startOf' && setDisplayFromDate(date)
        type === 'endOf' && setDisplayToDate(date)

        return date.format(DATE_FORMAT)
    }

    const getPreDate = (type, time) => {
        const date = moment().subtract(1, time)[type](time)

        type === 'startOf' && setDisplayFromDate(date)
        type === 'endOf' && setDisplayToDate(date)

        return date.format(DATE_FORMAT)
    }

    const getCurrentFiscalDate = (type, time) => {
        const { fiscalYear } = props
        const firstMonth = JSON.parse(fiscalYear.split('-')[0]) - 1
        const secondMonth = JSON.parse(fiscalYear.split('-')[1]) - 1

        let date = moment()

        if (type === 'startOf') {
            date = date.month(firstMonth)[type]('month')
            setDisplayFromDate(date)
        } else {
            date = date.month(secondMonth).add(time, 1)[type]('month')
            setDisplayToDate(date)
        }
        return date.format(DATE_FORMAT)
    }

    const getPreFiscalDate = (type, time) => {
        const { fiscalYear } = props
        const firstMonth = JSON.parse(fiscalYear.split('-')[0]) - 1
        const secondMonth = JSON.parse(fiscalYear.split('-')[1]) - 1

        let date = moment()

        if (type === 'startOf') {
            date = date.month(firstMonth).subtract(time, 1)[type]('month')

            setDisplayFromDate(date)
        } else {
            date = date.month(secondMonth)[type]('month')

            setDisplayToDate(date)
        }

        return date.format(DATE_FORMAT)
    }

    const onDateRangeChange = (val) => {
        setFormField('date_range', val)

        switch (val) {
            case DATE_RANGE.TODAY:
                const displayDate = moment()
                setFormField('from_date', displayDate.format(DATE_FORMAT))
                setDisplayFromDate(displayDate)
                setFormField('to_date', displayDate.format(DATE_FORMAT))
                setDisplayToDate(displayDate)
                break;

            case DATE_RANGE.THIS_WEEK:
                setFormField('from_date', getThisDate('startOf', 'isoWeek'))
                setFormField('to_date', getThisDate('endOf', 'isoWeek'))
                break;

            case DATE_RANGE.THIS_MONTH:
                setFormField('from_date', getThisDate('startOf', 'month'))
                setFormField('to_date', getThisDate('endOf', 'month'))
                break;

            case DATE_RANGE.THIS_QUARTER:
                setFormField('from_date', getThisDate('startOf', 'quarter'))
                setFormField('to_date', getThisDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.THIS_YEAR:
                setFormField('from_date', getThisDate('startOf', 'year'))
                setFormField('to_date', getThisDate('endOf', 'year'))
                break;

            case DATE_RANGE.CURRENT_FISCAL_QUARTER:
                setFormField('from_date', getCurrentFiscalDate('startOf', 'quarter'))
                setFormField('to_date', getCurrentFiscalDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.CURRENT_FISCAL_YEAR:
                setFormField('from_date', getCurrentFiscalDate('startOf', 'year'))
                setFormField('to_date', getCurrentFiscalDate('endOf', 'year'))
                break;

            case DATE_RANGE.PREVIOUS_WEEK:
                setFormField('from_date', getPreDate('startOf', 'isoWeek'))
                setFormField('to_date', getPreDate('endOf', 'isoWeek'))
                break;

            case DATE_RANGE.PREVIOUS_MONTH:
                setFormField('from_date', getPreDate('startOf', 'month'))
                setFormField('to_date', getPreDate('endOf', 'month'))
                break;

            case DATE_RANGE.PREVIOUS_QUARTER:
                setFormField('from_date', getPreDate('startOf', 'quarter'))
                setFormField('to_date', getPreDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.PREVIOUS_YEAR:
                setFormField('from_date', getPreDate('startOf', 'year'))
                setFormField('to_date', getPreDate('endOf', 'year'))
                break;

            case DATE_RANGE.PREVIOUS_FISCAL_QUARTER:
                setFormField('from_date', getPreFiscalDate('startOf', 'quarter'))
                setFormField('to_date', getPreFiscalDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.PREVIOUS_FISCAL_YEAR:
                setFormField('from_date', getPreFiscalDate('startOf', 'year'))
                setFormField('to_date', getPreFiscalDate('endOf', 'year'))
                break;

            default:
                break;
        }
    }

    const BOTTOM_ACTION = () => {
        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={handleSubmit(saveReport)}
                        btnTitle={Lng.t("button.generateReport")}
                        containerStyle={styles.handleBtn}
                        loading={loading}
                    />
                </View>
            </View>
        )
    }

    const getReport = ({ isTitle, reportType = '' }) => {
        let data = ''

        switch (type) {
            case SALES:
                const tp = (reportType === 'byCustomer')

                data = isTitle ?
                    Lng.t("header.salesReport") :
                    (tp ? 'sales/customers/' : 'sales/items/')
                break;

            case PROFIT_AND_LOSS:
                data = isTitle ?
                    Lng.t("header.profitAndLossReport") : 'profit-loss/'
                break;

            case EXPENSES:
                data = isTitle ?
                    Lng.t("header.expensesReport") : 'expenses/'
                break;

            case TAXES:
                data = isTitle ?
                    Lng.t("header.taxesReport") : 'tax-summary/'
                break;

            default:
                break;
        }

        return data
    }

    return (
        <DefaultLayout
            headerProps={{
                leftIconPress: () => navigation.navigate(ROUTES.REPORTS),
                title: getReport({ isTitle: true }),
                titleStyle: headerTitle({ marginLeft: -26, marginRight: -50 }),
                placement: "center",
            }}
            bottomAction={BOTTOM_ACTION()}
            loadingProps={{
                is: loading,
            }}
        >
            <View style={styles.bodyContainer}>
                <Field
                    name="date_range"
                    label={Lng.t("reports.dateRange")}
                    component={SelectPickerField}
                    isRequired
                    fieldIcon='calendar-week'
                    items={DATE_RANGE_OPTION()}
                    onChangeCallback={onDateRangeChange}
                    fakeInputContainerStyle={styles.selectPickerField}
                />

                <View style={styles.dateFieldContainer}>
                    <View style={styles.dateField}>
                        <Field
                            name={'from_date'}
                            component={DatePickerField}
                            isRequired
                            displayValue={displayFromDate}
                            label={Lng.t("reports.fromDate")}
                            onChangeCallback={(val) => {
                                setFormField('date_range', 'custom')
                                setDisplayFromDate('')
                            }}
                        />
                    </View>
                    <View style={styles.dateField}>
                        <Field
                            name="to_date"
                            component={DatePickerField}
                            isRequired
                            displayValue={displayToDate}
                            label={Lng.t("reports.toDate")}
                            onChangeCallback={(val) => {
                                setFormField('date_range', 'custom')
                                setDisplayToDate('')
                            }}
                        />
                    </View>
                </View>

                {type === SALES && (
                    <Field
                        name="report_type"
                        label={Lng.t("reports.reportType")}
                        component={SelectPickerField}
                        fieldIcon='vial'
                        items={REPORT_TYPE_OPTION()}
                        onChangeCallback={(val) => {
                            setFormField('report_type', val)
                        }}
                        fakeInputContainerStyle={styles.selectPickerField}
                    />
                )}
            </View>
        </DefaultLayout>
    );
}
