import React from 'react';
import { connect } from 'react-redux';
import { Report } from '../../components/Report';
import * as ReportAction from '../../actions';
import { DATE_RANGE } from '../../constants';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        more: { loading },
        global: { language, company, fiscalYear = '2-1', endpointURL },
    } = state;

    const { type } = params;
    const isLoading = loading.reportsLoading || !type;

    return {
        loading: isLoading,
        language,
        type,
        company,
        fiscalYear,
        endpointURL,
        initialValues: !isLoading && {
            date_range: DATE_RANGE.THIS_MONTH,
            report_type: 'byCustomer'
        },
    };
};

const mapDispatchToProps = {
    generateReport: ReportAction.generateReport,
};

//  connect
const ReportContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Report);

export default ReportContainer;
