import React from 'react';
import { createSelector } from 'reselect';
import { formatEstimate } from '~/selectors/format';

const templateList = (state) => state.global.templates.estimate;

const estimateList = (state) => state.estimates.estimates;
const filterEstimateList = (state) => state.estimates.filterEstimates;

export const getTemplates = createSelector(
    [ templateList ],
    (templates) => templates || []
);

export const getEstimates = createSelector(
    [ estimateList ],
    (estimates) => {
        return estimates.map((estimate) => formatEstimate(estimate));
    }
);

export const getFilterEstimates = createSelector(
    [ filterEstimateList ],
    (estimates) => estimates.map((estimate) => formatEstimate(estimate))
);
