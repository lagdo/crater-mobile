import React from 'react';
import { connect } from 'react-redux';
import { Estimate } from '../../components/Estimate';
import * as EstimatesAction from '../../actions';
import { ESTIMATE_EDIT } from '../../constants';
import moment from 'moment';
import * as CustomersAction from '~/features/customers/actions';
import { getCustomers } from '~/features/customers/selectors';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language, taxTypes },
        estimates: { loading, estimateItems, estimateData, items },
    } = state;

    const {
        estimate = null,
        nextEstimateNumber,
        nextEstimateNumberAttribute,
        estimateTemplates
    } = estimateData;

    const { id = null, type } = params;

    let isLoading = loading.initEstimateLoading || (type === ESTIMATE_EDIT && !estimate)
        || !nextEstimateNumber

    return {
        id,
        initLoading: isLoading,
        loading: loading.estimateLoading,
        estimateItems,
        estimateData,
        items,
        type,
        customers: getCustomers(state),
        itemsLoading: loading.itemsLoading,
        language,
        taxTypes,
        initialValues: !isLoading ? {
            expiry_date: moment().add(7, 'days'),
            estimate_date: moment(),
            discount_type: 'fixed',
            discount: 0,
            taxes: [],
            estimate_template_id: estimateTemplates[0] && estimateTemplates[0].id,
            ...estimate,
            estimate_number: type === ESTIMATE_EDIT ? nextEstimateNumber : nextEstimateNumberAttribute,
            customer: estimate && estimate.user,
            template: estimate && estimate.estimate_template,
        } : null
    };
};

const mapDispatchToProps = {
    getCreateEstimate: EstimatesAction.getCreateEstimate,
    createEstimate: EstimatesAction.createEstimate,
    getItems: EstimatesAction.getItems,
    getEditEstimate: EstimatesAction.getEditEstimate,
    editEstimate: EstimatesAction.editEstimate,
    removeEstimateItems: EstimatesAction.removeEstimateItems,
    removeEstimate: EstimatesAction.removeEstimate,
    convertToInvoice: EstimatesAction.convertToInvoice,
    clearEstimate: EstimatesAction.clearEstimate,
    convertToInvoice: EstimatesAction.convertToInvoice,
    changeEstimateStatus: EstimatesAction.changeEstimateStatus,
    getCustomers: CustomersAction.getCustomers,
};

//  connect
const EstimateContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Estimate);

export default EstimateContainer;
