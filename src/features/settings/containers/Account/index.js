import React from 'react';
import { connect } from 'react-redux';
import { Account } from '../../components/Account';
import { reduxForm } from 'redux-form';
import { EDIT_ACCOUNT } from '../../constants';
import * as AccountAction from '../../actions';
import { validate } from './validation';

const mapStateToProps = (state) => {
    const {
        settings: {
            loading: {
                getAccountInfoLoading,
                editAccountInfoLoading
            },
            account
        },
        global: { language }
    } = state

    let isLoading = getAccountInfoLoading || !account


    return {
        isLoading,
        editAccountLoading: editAccountInfoLoading,
        language,

        initialValues: !isLoading ? {
            name: account.name,
            email: account.email
        } : null

    };
};


const mapDispatchToProps = {
    editAccount: AccountAction.editAccount,
    getAccount: AccountAction.getAccountInformation,
    editAccount: AccountAction.editAccountInformation
};

//  Redux Forms
const AccountReduxForm = reduxForm({
    form: EDIT_ACCOUNT,
    validate,
})(Account);

//  connect
const AccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AccountReduxForm);

export default AccountContainer;
