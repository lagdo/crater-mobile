import React from 'react';
import { connect } from 'react-redux';
import { Reports } from '../../components/Reports';

const mapStateToProps = ({ global }) => ({
    language: global.language
});

const mapDispatchToProps = {
};

// connect
const SettingContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Reports);

export default SettingContainer;
