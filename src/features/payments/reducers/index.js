import {
    SET_PAYMENTS,
    PAYMENTS_TRIGGER_SPINNER,
    SET_FILTER_PAYMENTS,
} from '../constants';
import { savePayments } from '~/selectors/schemas';

const initialState = {
    payments: [],
    filterPayments: [],
    errors: null,
    loading: {
        paymentsLoading: false,
        initPaymentLoading: false,
        paymentLoading: false,
        getUnpaidInvoicesLoading: false,
    },
};

export default function paymentsReducer(state = initialState, action) {
    const { payload, type } = action;

    switch (type) {

        case SET_PAYMENTS:
        {
            const { payments, fresh } = savePayments(payload);

            if (!fresh) {
                return { ...state, payments: [...state.payments, ...payments] };
            }

            return { ...state, payments };
        }
        case SET_FILTER_PAYMENTS:
        {
            const { payments, fresh } = savePayments(payload);

            if (!fresh) {
                return { ...state, filterPayments: [...state.filterPayments, ...payments] };
            }

            return { ...state, filterPayments: payload.payments };
        }
        case PAYMENTS_TRIGGER_SPINNER:
            return { ...state, loading: { ...payload } };

        default:
            return state;
    }
}
