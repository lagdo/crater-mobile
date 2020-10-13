import { getError, removeNullValues } from '~/api/validation';

// @flow


export const validate = (values) => {
    const errors = {};
    const {
        name,
        email,
        password,
        confirmPassword
    } = values;

    errors.name = getError(name, ['requiredField']);
    errors.email = getError(email, ['requiredField', 'emailFormat']);

    errors.password = getError(password, ['passwordCompared'], { fieldName: confirmPassword });
    errors.confirmPassword = getError(confirmPassword, ['passwordCompared'], { fieldName: password });

    return removeNullValues(errors);
};
