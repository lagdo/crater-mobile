import React from 'react';
import { connect } from 'react-redux';
import { Tax } from '../../components/Tax';
import * as TaxAction from '../../actions';
import { ADD_TAX } from '../../constants';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language },
        settings: {
            loading: {
                addTaxLoading,
                editTaxLoading,
                removeTaxLoading,
            }
        },
    } = state;

    const { tax: taxType = {}, type = ADD_TAX, onSelect = null } = params;

    const isLoading = editTaxLoading || addTaxLoading || removeTaxLoading;

    return {
        loading: isLoading,
        type,
        taxId: taxType && taxType.id,
        language,
        onSelect,
        initialValues: {
            collective_tax: 0,
            compound_tax: 0,
            ...taxType
        }
    }
};

const mapDispatchToProps = {
    addTax: TaxAction.addTax,
    editTax: TaxAction.editTax,
    removeTax: TaxAction.removeTax,
};

//  connect
const TaxContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Tax);

export default TaxContainer;
