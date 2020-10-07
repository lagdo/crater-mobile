import { all, takeEvery, select, put } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/src/constants';
import auth from '../features/authentication/saga';
import invoices from '../features/invoices/saga';
import estimates from '../features/estimates/saga';
import customers from '../features/customers/saga';
import expenses from '../features/expenses/saga';
import payments from '../features/payments/saga';
import settings from '../features/settings/saga';
import categories from '../features/categories/saga';
import items from '../features/items/saga';
import taxes from '../features/taxes/saga';
import more from '../features/more/saga';

export default function* rootSaga() {
    yield takeEvery(REHYDRATE, function* boot() {
        yield all([
            auth(),
            invoices(),
            estimates(),
            customers(),
            more(),
            expenses(),
            payments(),
            settings(),
            categories(),
            items(),
            taxes(),
        ]);
    });
}
