import React from 'react';
import { connect } from 'react-redux';
import { Estimates } from '../../components/Estimates';
import { reduxForm, getFormValues } from 'redux-form';
import * as EstimatesAction from '../../actions';
import { ESTIMATE_SEARCH } from '../../constants';
import { getCustomers } from '../../../customers/actions';

const mapStateToProps = (state) => {

    const {
        global: { language },
        estimates: {
            estimates,
            loading: { estimatesLoading }
        },
        customers: { customers },
    } = state;

    return {
        estimates,
        customers,
        loading: estimatesLoading,
        language,
        formValues: getFormValues(ESTIMATE_SEARCH)(state) || {},
    };
};

const mapDispatchToProps = {
    getEstimates: EstimatesAction.getEstimates,
    clearEstimates: EstimatesAction.clearEstimates,
    getCustomers: getCustomers
};

//  Redux Forms
const estimateSearchReduxForm = reduxForm({
    form: ESTIMATE_SEARCH,
})(Estimates);

//  connect
const EstimatesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(estimateSearchReduxForm);

export default EstimatesContainer;
