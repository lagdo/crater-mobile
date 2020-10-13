import { combineReducers } from 'redux';
import auth from '../features/authentication/reducers';
import invoices from '../features/invoices/reducers';
import estimates from '../features/estimates/reducers';
import customers from '../features/customers/reducers';
import payments from '../features/payments/reducers';
import more from '../features/more/reducers';
import settings from '../features/settings/reducers';
import expenses from '../features/expenses/reducers';
import categories from '../features/categories/reducers';
import items from '../features/items/reducers';
import global from './global';

export default combineReducers({
    auth,
    invoices,
    estimates,
    customers,
    more,
    expenses,
    payments,
    categories,
    items,
    global,
    settings,
});
