import React from 'react';
import { connect } from 'react-redux';
import { Tax } from '../../components/Tax';
import { reduxForm } from 'redux-form';
import * as TaxAction from '../../actions';
import { validate } from './validation';
import { TAX_FORM, ADD_TAX } from '../../constants';

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

//  Redux Forms
const TaxReduxForm = reduxForm({
    form: TAX_FORM,
    validate,
})(Tax);

//  connect
const TaxContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(TaxReduxForm);

export default TaxContainer;
