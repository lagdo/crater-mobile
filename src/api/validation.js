// @flow
import React from 'react'
import {
    EMAIL_REGEX,
    URL_REGEX,
    CHARACTER_ONLY_REGEX
} from './consts';

type IValidationOptions = {
    fieldName?: string,
};
type ErrorType =
    | 'emailFormat'
    | 'required'
    | 'requiredField'
    | 'itemField'
    | 'requiredCheckArray'
    | 'minNumberRequired'
    | 'maxNumberRequired'
    | 'maxCharacterRequired'
    | 'characterOnlyRequired'
    | 'isNumberFormat'
    | 'passwordCompared'
    | 'moreThanDue'
    | 'urlFormat'

export function getError(
    value: string,
    errorTypes: Array<ErrorType>,
    options: IValidationOptions = {},
) {
    const { fieldName, minNumber, maxNumber, maxCharacter } = options;

    const errorTypeMap = {

        emailFormat: () => (EMAIL_REGEX.test(value) ? null : "validation.email"),

        required: () => (!value ? "validation.required" : null),

        requiredField: () => (!value ? "validation.field" : null),

        itemField: () => (!value ? "validation.choose" : null),

        requiredCheckArray: () => (value && value.length ? null : "validation.choose"),

        minNumberRequired: () => (value <= minNumber ? getMinNumberError(fieldName, minNumber) : null),

        maxNumberRequired: () => {
            return (value > maxNumber ? ("validation.maximumNumber") : null)
        },

        maxCharacterRequired: () => {
            return (value.length > maxCharacter ? ("validation.maximumCharacter") : null)
        },

        characterOnlyRequired: () => (CHARACTER_ONLY_REGEX.test(value) ? null : "validation.character"),

        isNumberFormat: () => (
            isNaN(Number(value)) ? "validation.numeric" : null
        ),
        passwordCompared: () => (
            value ? (value === fieldName ? null : "validation.passwordCompare") :
                fieldName ? (value === fieldName ? null : "validation.passwordCompare") : null
        ),

        moreThanDue: () => ("validation.moreThanDue"),

        urlFormat: () => (URL_REGEX.test(value) ? null : "validation.url"),

    };

    const errorType = errorTypes.find((error) => errorTypeMap[error] && errorTypeMap[error]());

    return errorType ? errorTypeMap[errorType]() : null;
}


export const getMinNumberError = (fieldName, minNumber) =>
    `validation.minimumNumber`;

export const removeNullValues = (errors) => {
    let nonNullErrors = {}, key;

    for(key in errors) {
        if (errors[key] !== null) {
            nonNullErrors[key] = errors[key];
        }
    }

    return nonNullErrors;
}
