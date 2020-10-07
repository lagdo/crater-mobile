import React from 'react';
import { connect } from 'react-redux';
import { Company } from '../../components/Company';
import { reduxForm, getFormValues } from 'redux-form';
import { EDIT_COMPANY } from '../../constants';
import * as CompanyAction from '../../actions';
import { validate } from './validation';
import * as AddressAction from '../../../customers/actions';


const mapStateToProps = (state) => {
    const {
        settings: {
            loading: {
                editCompanyInfoLoading,
                getCompanyInfoLoading
            }
        },
        global: { language },
        customers: {
            countries,
            loading: {
                countriesLoading,
            }
        },
    } = state

    return {
        formValues: getFormValues(EDIT_COMPANY)(state) || {},
        language,
        editCompanyLoading: editCompanyInfoLoading,
        getCompanyInfoLoading,
        countries,
        countriesLoading,
    };
};


const mapDispatchToProps = {
    editCompanyInformation: CompanyAction.editCompanyInformation,
    getCompanyInformation: CompanyAction.getCompanyInformation,
    getCountries: AddressAction.getCountries,
};

//  Redux Forms
const CompanyReduxForm = reduxForm({
    form: EDIT_COMPANY,
    validate,
})(Company);

//  connect
const CompanyContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(CompanyReduxForm);

export default CompanyContainer;
