import { createSelector } from 'reselect';
import { formatPayment } from '~/selectors/format';

const paymentList = (state) => state.payments.payments;
const filterPaymentList = (state) => state.payments.filterPayments;

export const getPayments = createSelector(
    [ paymentList ],
    (payments) => payments.map((payment) => formatPayment(payment))
);

export const getFilterPayments = createSelector(
    [ filterPaymentList ],
    (payments) => payments.map((payment) => formatPayment(payment))
);
