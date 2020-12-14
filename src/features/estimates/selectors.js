import { createSelector } from 'reselect';
import { getEntities } from '~/selectors/index';
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
        const entities = getEntities({ estimates });
        return entities.estimates.map((estimate) => formatEstimate(estimate));
    },
);

export const getFilterEstimates = createSelector(
    [ filterEstimateList ],
    (estimates) => {
        const entities = getEntities({ estimates });
        return entities.estimates.map((estimate) => formatEstimate(estimate));
    },
);
