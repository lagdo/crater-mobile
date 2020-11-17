import React from 'react';
import { connect } from 'react-redux';
import { Company } from '../../components/Company';
import * as CompanyAction from '../../actions';
import * as AddressAction from '~/features/customers/actions';
import { getCountries } from '~/selectors/index';

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
            loading: {
                countriesLoading,
            }
        },
    } = state;

    return {
        language,
        editCompanyLoading: editCompanyInfoLoading,
        getCompanyInfoLoading,
        countries: getCountries(state),
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
