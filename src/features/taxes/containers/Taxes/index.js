import React from 'react';
import { connect } from 'react-redux';
import { Taxes } from '../../components/Taxes';
import * as TaxesAction from '../../actions';

const mapStateToProps = ({ settings, global }) => ({
    loading: settings.loading.getTaxLoading,
    taxTypes: global.taxTypes,
    language: global.language
});

const mapDispatchToProps = {
    getTaxes: TaxesAction.getTaxes
};

//  connect
const TaxesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Taxes);

export default TaxesContainer;
