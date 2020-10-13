import { getError, removeNullValues } from '~/api/validation';

// @flow


export const validate = (values) => {
    const errors = {};
    const { name } = values;

    errors.name = getError(
        name,
        ['requiredField'],
        { fieldName: 'Name' },
    );

    return removeNullValues(errors);
};
