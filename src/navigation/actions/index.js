
import React from 'react';
import { BackHandler } from 'react-native';
import Lng from '~/api/lang/i18n';
import { alertMe } from '~/api/global';


export const navigationRef = React.createRef();

export const navigate = (name, params = {}) => {
  navigationRef.current?.navigate(name, params);
};

const handlers = { back: null };

// Get Value with translated
// -----------------------------------------
export const getTitleByLanguage = (label, field = null) =>
    (field) ? Lng.t(label, { field }) : Lng.t(label);

// Exit Crater App
// -----------------------------------------
const exitApp = () => {
    alertMe({
        title: getTitleByLanguage('alert.exit'),
        okText: 'Exit',
        okPress: () => BackHandler.exitApp(),
        showCancel: true
    })
}

// Go Back Navigation
// -----------------------------------------
export const removeBackHandler = () => handlers.back && handlers.back.remove();

export const setOnBackHandler = (onBack) => {
    handlers.back = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
    })
};

export const setExitOnBackHandler = () => setOnBackHandler(exitApp);
