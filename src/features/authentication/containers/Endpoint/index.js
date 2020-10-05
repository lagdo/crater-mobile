import React from 'react';
import { connect } from 'react-redux';
import { Endpoint } from '../../components/Endpoint';
import { reduxForm } from 'redux-form';
import { SET_ENDPOINT_API } from '../../constants';
import * as AuthAction from '../../actions';
import { env } from '../../../../config';
import { validate } from './validation';

const mapStateToProps = (state, { navigation }) => {

    const {
        global: { language, endpointURL },
        auth: { loading }
    } = state

    let CRATER_URL = (typeof endpointURL !== 'undefined' && endpointURL !== null) ? endpointURL : ''

    let skipEndpoint = navigation.getParam('skipEndpoint', false)

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

//  Redux Forms
const EndpointReduxForm = reduxForm({
    form: SET_ENDPOINT_API,
    validate
})(Endpoint);

//  connect
const EndpointContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EndpointReduxForm);

export default EndpointContainer;
