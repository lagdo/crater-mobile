import { call, put, takeEvery } from 'redux-saga/effects';

import {
    settingsTriggerSpinner,
    setPaymentModes,
    setPaymentMode,
} from '../../actions';

import {
    GET_PAYMENT_MODES,
    CREATE_PAYMENT_MODE,
    EDIT_PAYMENT_MODE,
    REMOVE_PAYMENT_MODE,
    // Endpoint Api URL
    GET_PAYMENT_MODES_URL,
    CREATE_PAYMENT_MODE_URL,
    EDIT_PAYMENT_MODE_URL,
    REMOVE_PAYMENT_MODE_URL,
} from '../../constants';

import Request from '../../../../api/request';
import { hasValue, alertMe } from '../../../../api/global';
import { getTitleByLanguage } from '../../../../navigation/actions';


const alreadyInUse = (error) => {

    if (error.includes("errors") && error.includes("name")) {

        setTimeout(() => {
            alertMe({
                desc: getTitleByLanguage('alert.alreadyInUse', "\"Name\"")
            })
        }, 1000);

        return true;
    }
}

function* getPaymentModes(payloadData = {}) {

    yield put(settingsTriggerSpinner({ paymentModesLoading: true }));

    try {
        const options = {
            path: GET_PAYMENT_MODES_URL(),
        };

        const response = yield call([Request, 'get'], options);

        yield put(setPaymentModes({ paymentMethods: response.paymentMethods }));

    } catch (error) {
        // console.log(error)
    } finally {
        yield put(settingsTriggerSpinner({ paymentModesLoading: false }));
    }
}


function* createPaymentMode({ payload: { params } }) {

    yield put(settingsTriggerSpinner({ paymentModeLoading: true }));

    try {

        const options = {
            path: CREATE_PAYMENT_MODE_URL(),
            body: params
        };

        const response = yield call([Request, 'post'], options);

        yield put(setPaymentMode({ paymentMethod: [response.paymentMethod], isCreated: true }));

    } catch ({ _bodyText }) {
        hasValue(_bodyText) && alreadyInUse(_bodyText)
    } finally {
        yield put(settingsTriggerSpinner({ paymentModeLoading: false }));
    }
}

function* editPaymentMode({ payload: { id, params } }) {

    yield put(settingsTriggerSpinner({ paymentModeLoading: true }));

    try {

        const options = {
            path: EDIT_PAYMENT_MODE_URL(id),
            body: params
        };

        const response = yield call([Request, 'put'], options);

        yield put(setPaymentMode({ paymentMethod: [response.paymentMethod], isUpdated: true }));

    } catch ({ _bodyText }) {
        hasValue(_bodyText) && alreadyInUse(_bodyText)
    } finally {
        yield put(settingsTriggerSpinner({ paymentModeLoading: false }));
    }
}

function* removePaymentMode({ payload: { id } }) {

    yield put(settingsTriggerSpinner({ paymentModeLoading: true }));

    try {

        const options = {
            path: REMOVE_PAYMENT_MODE_URL(id),
        };

        const response = yield call([Request, 'delete'], options);

        if (response.success)
            yield put(setPaymentMode({ id, isRemove: true }));

        if (response.error && response.error === "payments_attached")
            setTimeout(() => {
                alertMe({
                    title: getTitleByLanguage("payments.alreadyInUseMode")
                })
            }, 1000);

    } catch (error) {
        // console.log(error);
    } finally {
        yield put(settingsTriggerSpinner({ paymentModeLoading: false }));
    }
}


export default function* paymentMethodsSaga() {
    // Payment Method
    // -----------------------------------------
    yield takeEvery(GET_PAYMENT_MODES, getPaymentModes);
    yield takeEvery(CREATE_PAYMENT_MODE, createPaymentMode);
    yield takeEvery(EDIT_PAYMENT_MODE, editPaymentMode);
    yield takeEvery(REMOVE_PAYMENT_MODE, removePaymentMode);
}
