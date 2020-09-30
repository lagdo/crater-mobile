import queryString from 'query-string';
import { ROUTES } from "../../navigation/routes";
import Lng from '../../api/lang/i18n';

// Forms
// -----------------------------------------
export const REPORTS_SEARCH = 'moreForm/REPORTS_SEARCH';
export const REPORT_FORM = 'moreForm/REPORT_FORM';

// Actions
// -----------------------------------------

// Report
// -----------------------------------------
export const GENERATE_REPORT = 'report/GENERATE_REPORT';

export const SALES = 'reportType/SALES';
export const PROFIT_AND_LOSS = 'reportType/PROFIT_AND_LOSS';
export const EXPENSES = 'reportType/EXPENSES';
export const TAXES = 'reportType/TAXES';

export const REPORTS_MENU = () => {
    return [
        {
            title: Lng.t("reports.sales"),
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: SALES
            }
        },
        {
            title: Lng.t("reports.profitAndLoss"),
            leftIcon: 'building',
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: PROFIT_AND_LOSS
            }
        },
        {
            title: Lng.t("reports.expenses"),
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: EXPENSES
            }
        },
        {
            title: Lng.t("reports.taxes"),
            fullItem: {
                route: ROUTES.GENERATE_REPORT,
                type: TAXES
            }
        },
    ]
}

export const REPORT_TYPE_OPTION = () => {
    return [
        {
            label: Lng.t("reports.byCustomer"),
            value: 'byCustomer'
        },
        {
            label: Lng.t("reports.byItem"),
            value: 'byItem'
        },
    ]
}

export const DATE_RANGE = {
    TODAY: 'today',
    THIS_WEEK: 'thisWeek',
    THIS_MONTH: 'thisMonth',
    THIS_QUARTER: 'thisQuarter',
    THIS_YEAR: 'thisYear',
    CURRENT_FISCAL_QUARTER: 'currentFiscalQuarter',
    CURRENT_FISCAL_YEAR: 'currentFiscalYear',
    PREVIOUS_WEEK: 'previousWeek',
    PREVIOUS_MONTH: 'previousMonth',
    PREVIOUS_QUARTER: 'previousQuarter',
    PREVIOUS_YEAR: 'previousYear',
    PREVIOUS_FISCAL_QUARTER: 'previousFiscalQuarter',
    PREVIOUS_FISCAL_YEAR: 'previousFiscalYear',
    CUSTOM: 'custom',
}

export const DATE_RANGE_OPTION = () => {
    return [
        {
            label: Lng.t("reports.today"),
            value: DATE_RANGE.TODAY
        },
        {
            label: Lng.t("reports.thisWeek"),
            value: DATE_RANGE.THIS_WEEK
        },
        {
            label: Lng.t("reports.thisMonth"),
            value: DATE_RANGE.THIS_MONTH
        },
        {
            label: Lng.t("reports.thisQuarter"),
            value: DATE_RANGE.THIS_QUARTER
        },
        {
            label: Lng.t("reports.thisYear"),
            value: DATE_RANGE.THIS_YEAR
        },
        // {
        //     label: Lng.t("reports.currentFiscalQuarter"),
        //     value: DATE_RANGE.CURRENT_FISCAL_QUARTER
        // },
        {
            label: Lng.t("reports.currentFiscalYear"),
            value: DATE_RANGE.CURRENT_FISCAL_YEAR
        },
        {
            label: Lng.t("reports.previousWeek"),
            value: DATE_RANGE.PREVIOUS_WEEK
        },
        {
            label: Lng.t("reports.previousMonth"),
            value: DATE_RANGE.PREVIOUS_MONTH
        },
        {
            label: Lng.t("reports.previousQuarter"),
            value: DATE_RANGE.PREVIOUS_QUARTER
        },
        {
            label: Lng.t("reports.previousYear"),
            value: DATE_RANGE.PREVIOUS_YEAR
        },
        // {
        //     label: Lng.t("reports.previousFiscalQuarter"),
        //     value: DATE_RANGE.PREVIOUS_FISCAL_QUARTER
        // },
        {
            label: Lng.t("reports.previousFiscalYear"),
            value: DATE_RANGE.PREVIOUS_FISCAL_YEAR
        },
        {
            label: Lng.t("reports.custom"),
            value: DATE_RANGE.CUSTOM
        },
    ]
}

// Endpoint Api URL
// -----------------------------------------
