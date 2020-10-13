import React from 'react';
import { connect } from 'react-redux';
import { Account } from '../../components/Account';
import * as AccountAction from '../../actions';

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

//  connect
const AccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Account);

export default AccountContainer;
