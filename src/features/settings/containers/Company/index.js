import React from 'react';
import { connect } from 'react-redux';
import { Company } from '../../components/Company';
import * as CompanyAction from '../../actions';
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

//  connect
const CompanyContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Company);

export default CompanyContainer;
