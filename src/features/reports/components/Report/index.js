// @flow

import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { View } from 'react-native';
import styles from './styles';
import {
    CtButton,
    DefaultLayout,
    DatePickerField,
    SelectPickerField,
} from '~/components';
import {
    SALES,
    PROFIT_AND_LOSS,
    EXPENSES, TAXES,
    DATE_RANGE_OPTION,
    REPORT_TYPE_OPTION,
    DATE_RANGE
} from '../../constants';
import { DATE_FORMAT } from '~/api/consts/core';
import Lng from '~/api/lang/i18n';
import moment from 'moment';
import { Linking } from 'expo';
import QueryString from 'qs';
import { headerTitle } from '~/api/helper';
import { validate } from '../../containers/Report/validation';

type IProps = {
    navigation: Object,
    taxTypes: Object,
    type: String,
    loading: Boolean,
    handleSubmit: Function,
}

export const Report = (props: IProps) =>  {
    const {
        navigation,
        loading,
        initialValues,
        type,
        taxTypes,
    } = props;

    const [taxTypeList, setTaxTypeList] = useState(taxTypes);
    const [displayFromDate, setDisplayFromDate] = useState('');
    const [displayToDate, setDisplayToDate] = useState('');

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

    const onDateRangeChange = (val, form) => {
        form.change('date_range', val)

        switch (val) {
            case DATE_RANGE.TODAY:
                const displayDate = moment()
                form.change('from_date', displayDate.format(DATE_FORMAT))
                setDisplayFromDate(displayDate)
                form.change('to_date', displayDate.format(DATE_FORMAT))
                setDisplayToDate(displayDate)
                break;

            case DATE_RANGE.THIS_WEEK:
                form.change('from_date', getThisDate('startOf', 'isoWeek'))
                form.change('to_date', getThisDate('endOf', 'isoWeek'))
                break;

            case DATE_RANGE.THIS_MONTH:
                form.change('from_date', getThisDate('startOf', 'month'))
                form.change('to_date', getThisDate('endOf', 'month'))
                break;

            case DATE_RANGE.THIS_QUARTER:
                form.change('from_date', getThisDate('startOf', 'quarter'))
                form.change('to_date', getThisDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.THIS_YEAR:
                form.change('from_date', getThisDate('startOf', 'year'))
                form.change('to_date', getThisDate('endOf', 'year'))
                break;

            case DATE_RANGE.CURRENT_FISCAL_QUARTER:
                form.change('from_date', getCurrentFiscalDate('startOf', 'quarter'))
                form.change('to_date', getCurrentFiscalDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.CURRENT_FISCAL_YEAR:
                form.change('from_date', getCurrentFiscalDate('startOf', 'year'))
                form.change('to_date', getCurrentFiscalDate('endOf', 'year'))
                break;

            case DATE_RANGE.PREVIOUS_WEEK:
                form.change('from_date', getPreDate('startOf', 'isoWeek'))
                form.change('to_date', getPreDate('endOf', 'isoWeek'))
                break;

            case DATE_RANGE.PREVIOUS_MONTH:
                form.change('from_date', getPreDate('startOf', 'month'))
                form.change('to_date', getPreDate('endOf', 'month'))
                break;

            case DATE_RANGE.PREVIOUS_QUARTER:
                form.change('from_date', getPreDate('startOf', 'quarter'))
                form.change('to_date', getPreDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.PREVIOUS_YEAR:
                form.change('from_date', getPreDate('startOf', 'year'))
                form.change('to_date', getPreDate('endOf', 'year'))
                break;

            case DATE_RANGE.PREVIOUS_FISCAL_QUARTER:
                form.change('from_date', getPreFiscalDate('startOf', 'quarter'))
                form.change('to_date', getPreFiscalDate('endOf', 'quarter'))
                break;

            case DATE_RANGE.PREVIOUS_FISCAL_YEAR:
                form.change('from_date', getPreFiscalDate('startOf', 'year'))
                form.change('to_date', getPreFiscalDate('endOf', 'year'))
                break;

            default:
                break;
        }
    }

    const BOTTOM_ACTION = (handleSubmit) => {
        return (
            <View style={styles.submitButton}>
                <View style={{ flex: 1 }}>
                    <CtButton
                        onPress={handleSubmit}
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
        <Form validate={validate} initialValues={initialValues} onSubmit={saveReport}>
        { ({ handleSubmit, form }) => (
            <DefaultLayout
                headerProps={{
                    leftIconPress: navigation.goBack,
                    title: getReport({ isTitle: true }),
                    titleStyle: headerTitle({ marginLeft: -26, marginRight: -50 }),
                    placement: "center",
                }}
                bottomAction={BOTTOM_ACTION(handleSubmit)}
                loadingProps={{ is: loading }}
            >
                <View style={styles.bodyContainer}>
                    <Field
                        name="date_range"
                        label={Lng.t("reports.dateRange")}
                        component={SelectPickerField}
                        isRequired
                        fieldIcon='calendar-week'
                        items={DATE_RANGE_OPTION()}
                        onChangeCallback={(val) => onDateRangeChange(val, form)}
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
                                    form.change('date_range', 'custom')
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
                                    form.change('date_range', 'custom')
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
                                form.change('report_type', val)
                            }}
                            fakeInputContainerStyle={styles.selectPickerField}
                        />
                    )}
                </View>
            </DefaultLayout>
        )}
        </Form>
    );
}
