import { createSelector } from 'reselect';
import { formatPayment } from '~/selectors/format';

const paymentList = (state) => state.payments.payments;
const filterPaymentList = (state) => state.payments.filterPayments;
const paymentMethodList = (state) => state.settings.paymentMethods;

export const getPayments = createSelector(
    [ paymentList ],
    (payments) => payments.map((payment) => formatPayment(payment))
);

export const getFilterPayments = createSelector(
    [ filterPaymentList ],
    (payments) => payments.map((payment) => formatPayment(payment))
);

export const getPaymentMethods = createSelector(
    [ paymentMethodList ],
    (paymentMethods) => paymentMethods ? paymentMethods.map((method) => {
        const { id, name } = method;
        return {
            label: name,
            value: id,
        }
    }): []
);
