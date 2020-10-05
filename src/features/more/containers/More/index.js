import React from 'react';
import { connect } from 'react-redux';
import { More } from '../../components/More';
import { reduxForm } from 'redux-form';
import { MORE_SEARCH } from '../../constants';
import * as MoreAction from '../../actions';

const mapStateToProps = ({ more, global }) => ({
    loading: more.loading.logoutLoading,
    language: global.language
});

const mapDispatchToProps = {
    logout: MoreAction.logout
};

//  Redux Forms
const moreSearchReduxForm = reduxForm({
    form: MORE_SEARCH,
})(More);

//  connect
const MoreContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(moreSearchReduxForm);

export default MoreContainer;
