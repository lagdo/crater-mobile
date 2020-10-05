import React from 'react';
import { connect } from 'react-redux';
import { EstimateItem } from '../../components/Item';
import { reduxForm, getFormValues } from 'redux-form';
import { validate } from './validation';
import * as EstimatesAction from '../../actions';
import { ITEM_FORM } from '../../constants';
import { getItemUnits } from '../../../settings/actions';

const mapStateToProps = (state, { navigation }) => {
    const {
        estimates: { loading },
        global: { language, taxTypes },
        settings: {
            units,
            loading: { itemUnitsLoading }
        }
    } = state;

    const item = navigation.getParam('item', {});

    const type = navigation.getParam('type');
    const discountPerItem = navigation.getParam('discount_per_item');
    const taxPerItem = navigation.getParam('tax_per_item');

    const isLoading = loading.editItemLoading || loading.removeItemLoading || itemUnitsLoading

    return {
        loading: isLoading,
        formValues: getFormValues(ITEM_FORM)(state) || {},
        itemId: item && (item.item_id || item.id),
        taxTypes,
        currency: navigation.getParam('currency'),
        language: language,
        discountPerItem,
        taxPerItem,
        type,
        units,

        initialValues: {
            price: null,
            quantity: 1,
            discount_type: 'none',
            discount: 0,
            taxes: [],
            ...item
        },
    };
};

const mapDispatchToProps = {
    getItemUnits: getItemUnits,
    addItem: EstimatesAction.addItem,
    setEstimateItems: EstimatesAction.setEstimateItems,
    removeEstimateItem: EstimatesAction.removeEstimateItem,
};

//  Redux Forms
const addItemReduxForm = reduxForm({
    form: ITEM_FORM,
    validate,
})(EstimateItem);

//  connect
const EstimateItemContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(addItemReduxForm);

export default EstimateItemContainer;
