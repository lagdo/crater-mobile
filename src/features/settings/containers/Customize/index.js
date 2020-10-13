import React from 'react';
import { connect } from 'react-redux';
import * as customizeAction from '../../actions'
import { Customize } from '../../components/Customize';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language },
        settings: {
            customizes,
            paymentMethods,
            units,
            loading: {
                getCustomizeLoading,
                paymentModesLoading,
                customizeLoading,
                paymentModeLoading,
                itemUnitLoading,
            }
        }
    } = state;

    const { type } = params;
    let isLoading = getCustomizeLoading || paymentModesLoading || customizes === null || typeof customizes === 'undefined'

    return {
        language,
        type,
        customizes,
        paymentMethods,
        units,
        isLoading,
        loading: customizeLoading,
        paymentModeLoading,
        itemUnitLoading,
        initialValues: !isLoading ? {
            ...customizes,
        } : null
    };
};

const mapDispatchToProps = {
    // Customize
    getCustomizeSettings: customizeAction.getCustomizeSettings,
    setCustomizeSettings: customizeAction.setCustomizeSettings,
    editCustomizeSettings: customizeAction.editCustomizeSettings,
    editSettingItem: customizeAction.editSettingItem,
    // Payment Methods
    createPaymentMode: customizeAction.createPaymentMode,
    editPaymentMode: customizeAction.editPaymentMode,
    removePaymentMode: customizeAction.removePaymentMode,
    // Item Unit
    createItemUnit: customizeAction.createItemUnit,
    editItemUnit: customizeAction.editItemUnit,
    removeItemUnit: customizeAction.removeItemUnit
};

//  connect
const CustomizeContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Customize);

export default CustomizeContainer;
