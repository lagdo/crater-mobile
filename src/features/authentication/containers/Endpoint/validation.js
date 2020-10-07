import { getError, removeNullValues } from "../../../../api/validation";

export const validate = (values) => {
    const errors = {};
    const { endpointURL } = values;

    errors.endpointURL = getError(endpointURL, ['requiredField', 'urlFormat']);

    return removeNullValues(errors);
};
