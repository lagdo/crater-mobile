import React from 'react';
import { connect } from 'react-redux';
import * as NotificationAction from '../../actions';
import { Notification } from '../../components/Notification';

const mapStateToProps = (state) => {
    const {
        global: { language },
        settings: {
            loading: {
                getSettingItemLoading,
                editSettingItemLoading
            }
        },
    } = state

    return {
        language,
        getSettingItemLoading,
        editSettingItemLoading
    };
};

const mapDispatchToProps = {
    getSettingItem: NotificationAction.getSettingItem,
    editSettingItem: NotificationAction.editSettingItem
};

//  connect
const NotificationContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Notification);

export default NotificationContainer;
