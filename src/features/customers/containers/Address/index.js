import React from 'react';
import { connect } from 'react-redux';
import { Address } from '../../components/Address';

const mapStateToProps = (state) => {
    const {
        global: { language },
        customers: { countries }
    } = state

    return {
        language,
        countries
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
