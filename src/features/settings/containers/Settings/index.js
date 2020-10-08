import React from 'react';
import { connect } from 'react-redux';
import { Settings } from '../../components/Settings';
import * as SettingAction from '../../actions';

const mapStateToProps = ({ settings, global }) => ({
    loading: settings.loading.logoutLoading,
    language: global.language
});

const mapDispatchToProps = {
    logout: SettingAction.logout
};

//  connect
const SettingContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);

export default SettingContainer;
