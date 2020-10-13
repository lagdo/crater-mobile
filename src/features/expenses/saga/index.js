import { call, put, takeEvery } from 'redux-saga/effects';
import Request from '~/api/request';

import {
    GET_EXPENSES,
    CREATE_EXPENSE,
    GET_EDIT_EXPENSE,
    GET_CREATE_EXPENSE,
    EDIT_EXPENSE,
    REMOVE_EXPENSE,
    GET_RECEIPT,
    DOWNLOAD_RECEIPT,
    // Endpoint Api URL
    GET_EXPENSES_URL,
    GET_CREATE_EXPENSE_URL,
    CREATE_EXPENSE_URL,
    EDIT_EXPENSE_URL,
    GET_EDIT_EXPENSE_URL,
    REMOVE_EXPENSE_URL,
    UPLOAD_RECEIPT_URL,
    SHOW_RECEIPT_URL,
} from '../constants';
import {
    expenseTriggerSpinner,
    setCategories,
    setExpenses,
    setFilterExpenses,
} from '../actions';
import { ROUTES } from '~/navigation/routes';
import { store } from '~/store';

function* getExpenses(payloadData) {
    const {
        payload: {
            onResult = null,
            onMeta = null,
            fresh = true,
            filter = false,
            params = null,
            pagination: { page = 1, limit = 10 } = {},
        } = {},
    } = payloadData;

    yield put(expenseTriggerSpinner({ expensesLoading: true }));

    try {

        let param = {
            ...params,
            page,
            limit
        }

        const options = {
            path: GET_EXPENSES_URL(param),
        };

        const response = yield call([Request, 'get'], options);

        if (!filter)
            yield put(setExpenses({ expenses: response.expenses.data, fresh }));
        else
            yield put(setFilterExpenses({ expenses: response.expenses.data, fresh }));

        onMeta && onMeta(response.expenses);

        onResult && onResult(true);
    } catch (error) {
        // console.log(error);
        onResult && onResult(false);
    } finally {
        yield put(expenseTriggerSpinner({ expensesLoading: false }));
    }
}


function* getCreateExpense(payloadData) {

    const {
        payload: { onResult } = {}
    } = payloadData;

    yield put(expenseTriggerSpinner({ initExpenseLoading: true }));

    try {
        const options = {
            path: GET_CREATE_EXPENSE_URL(),
        };

        const response = yield call([Request, 'get'], options);

        yield put(setCategories(response));

        onResult && onResult(response)
    } catch (error) {
        // console.log(error);
    } finally {
        yield put(expenseTriggerSpinner({ initExpenseLoading: false }));
    }
}

function* createExpense(payloadData) {
    const {
        payload: { params, navigation, attachmentReceipt, onResult },
    } = payloadData;
    yield put(expenseTriggerSpinner({ expenseLoading: true }));

    try {
        const options = {
            path: CREATE_EXPENSE_URL(),
            body: params,
        };

        const response = yield call([Request, 'post'], options);

        if (attachmentReceipt) {
            const options2 = {
                path: UPLOAD_RECEIPT_URL(response.expense.id),
                image: attachmentReceipt,
                type: 'create',
                imageName: 'attachment_receipt'
            }

            yield call([Request, 'post'], options2);
        }

        onResult && onResult(response)
        yield call(getExpenses, payload = {});

    } catch (error) {
        // console.log(error)
    } finally {
        yield put(expenseTriggerSpinner({ expenseLoading: false }));
    }
}

function* editExpense(payloadData) {
    const {
        payload: { params, id, attachmentReceipt, onResult },
    } = payloadData;
    yield put(expenseTriggerSpinner({ expenseLoading: true }));

    try {
        const options = {
            path: EDIT_EXPENSE_URL(id),
            body: params,
        };

        const response = yield call([Request, 'put'], options);

        if (attachmentReceipt) {
            const options2 = {
                path: UPLOAD_RECEIPT_URL(id),
                image: attachmentReceipt,
                type: 'edit',
                imageName: 'attachment_receipt'
            }

            yield call([Request, 'post'], options2);
        }


        onResult && onResult(response)
        yield call(getExpenses, payload = {});

    } catch (error) {
        // console.log(error)
    } finally {
        yield put(expenseTriggerSpinner({ expenseLoading: false }));
    }
}

function* getEditExpense(payloadData) {
    const {
        payload: { id, onResult },
    } = payloadData;
    yield put(expenseTriggerSpinner({ initExpenseLoading: true }));

    try {
        const options = {
            path: GET_EDIT_EXPENSE_URL(id),
        };

        const response = yield call([Request, 'get'], options);

        onResult && onResult(response.expense)

    } catch (error) {
        // console.log(error)
    } finally {
        yield put(expenseTriggerSpinner({ initExpenseLoading: false }));
    }
}

function* removeExpense(payloadData) {
    const {
        payload: { id, navigation },
    } = payloadData;

    yield put(expenseTriggerSpinner({ expenseLoading: true }));

    try {
        const options = {
            path: REMOVE_EXPENSE_URL(id),
        };

        const response = yield call([Request, 'delete'], options);

        if (response.success) {
            navigation.navigate(ROUTES.MAIN_EXPENSES)
            yield call(getExpenses, payload = {});
        }

    } catch (error) {
        // console.log(error);
    } finally {
        yield put(expenseTriggerSpinner({ expenseLoading: false }));
    }
}

function* getReceipt(payloadData) {
    const {
        payload: { id, onResult },
    } = payloadData;

    yield put(expenseTriggerSpinner({ initExpenseLoading: true }));

    try {


        const options = {
            path: SHOW_RECEIPT_URL(id),
        };

        const response = yield call([Request, 'get'], options);

        onResult && onResult(response)

    } catch (error) {
        // console.log(error);
    } finally {
        yield put(expenseTriggerSpinner({ initExpenseLoading: false }));
    }
}

export default function* expensesSaga() {
    yield takeEvery(GET_EXPENSES, getExpenses);
    yield takeEvery(GET_CREATE_EXPENSE, getCreateExpense);
    yield takeEvery(CREATE_EXPENSE, createExpense);
    yield takeEvery(GET_EDIT_EXPENSE, getEditExpense);
    yield takeEvery(EDIT_EXPENSE, editExpense);
    yield takeEvery(REMOVE_EXPENSE, removeExpense);
    yield takeEvery(GET_RECEIPT, getReceipt);
}
