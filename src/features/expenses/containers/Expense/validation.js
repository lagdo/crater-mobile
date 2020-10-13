import { getError, removeNullValues } from '~/api/validation';

// @flow


export const validate = (values) => {
    const errors = {};
    const {
        expense_date,
        expense_category_id,
        amount
    } = values;

    errors.expense_date = getError(
        expense_date,
        ['requiredField'],
    );

    errors.expense_category_id = getError(
        expense_category_id,
        ['requiredField'],
    );

    errors.amount = getError(
        amount,
        ['requiredField', 'isNumberFormat'],
    );

    return removeNullValues(errors);
};
