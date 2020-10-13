import React from 'react';
import { connect } from 'react-redux';
import { Endpoint } from '../../components/Endpoint';
import * as AuthAction from '../../actions';

const mapStateToProps = (state, { route: { params = {} } }) => {
    const {
        global: { language, endpointURL },
        auth: { loading }
    } = state

    const CRATER_URL = (typeof endpointURL !== 'undefined' && endpointURL !== null) ? endpointURL : '';

    const { skipEndpoint = false } = params;

    return {
        language,
        skipEndpoint,
        CRATER_URL,
        loading: loading && loading.pingEndpointLoading,
        initialValues: {
            endpointURL: CRATER_URL,
        }
    };
};

const mapDispatchToProps = {
    saveEndpointApi: AuthAction.saveEndpointApi,
    checkEndpointApi: AuthAction.checkEndpointApi
};

//  connect
const EndpointContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Endpoint);

export default EndpointContainer;
