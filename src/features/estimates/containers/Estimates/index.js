import React from 'react';
import { connect } from 'react-redux';
import { Estimates } from '../../components/Estimates';
import * as EstimatesAction from '../../actions';
import { getCustomers } from '~/features/customers/actions';
import { getEstimates } from '../../selectors';

const mapStateToProps = (state) => {

    const {
        global: { language },
        estimates: {
            loading: { estimatesLoading }
        },
        customers: { customers },
    } = state;

    return {
        estimates: getEstimates(state),
        customers,
        loading: estimatesLoading,
        language,
    };
};

const mapDispatchToProps = {
    getEstimates: EstimatesAction.getEstimates,
    clearEstimates: EstimatesAction.clearEstimates,
    getCustomers: getCustomers
};

//  connect
const EstimatesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Estimates);

export default EstimatesContainer;
