
import React from 'react';
import { BackHandler } from 'react-native';
import Lng from '../../api/lang/i18n';
import { alertMe } from '../../api/global';

let backHandler = null;

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
export const removeBackHandler = () => backHandler && backHandler.remove();

export const setOnBackHandler = (onBack) => {
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
    })
};

export const setExitOnBackHandler = () => setOnBackHandler(exitApp);
