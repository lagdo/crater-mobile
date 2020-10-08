import React from 'react';
import { connect } from 'react-redux';
import { More } from '../../components/More';
import * as MoreAction from '../../actions';

const mapStateToProps = ({ more, global }) => ({
    loading: more.loading.logoutLoading,
    language: global.language
});

const mapDispatchToProps = {
    logout: MoreAction.logout
};

//  connect
const MoreContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(More);

export default MoreContainer;
