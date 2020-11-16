import React from 'react';
import { connect } from 'react-redux';
import { Address } from '../../components/Address';
import { getCountries } from '~/selectors/index';

const mapStateToProps = (state) => {
    const {
        global: { language },
        customers: {
            loading: {
                countriesLoading,
            }
        },
    } = state;

    return {
        language,
        countries: getCountries(state),
        countriesLoading,
    };
};

const mapDispatchToProps = {
};

//  connect
const AddressContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Address);

export default AddressContainer;
