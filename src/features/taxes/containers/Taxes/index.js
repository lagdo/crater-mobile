import React from 'react';
import { connect } from 'react-redux';
import { Taxes } from '../../components/Taxes';
import * as TaxesAction from '../../actions';
import { getTaxTypes } from '../../selectors';

const mapStateToProps = (state) => {
    const {
        settings: {
            loading: {
                getTaxLoading
            }
        },
        global: {
            language
        },
    } = state;

    return {
        loading: getTaxLoading,
        language,
        taxTypes: getTaxTypes(state),
    };
};

const mapDispatchToProps = {
    getTaxes: TaxesAction.getTaxes
};

//  connect
const TaxesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Taxes);

export default TaxesContainer;
