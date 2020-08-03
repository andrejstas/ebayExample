import {WEBDEV_REQUEST_TYPE_KEYS} from '../constants';

/**
 * Checks if the selected request has some defined efforts in the request types.
 * @param {Map} request
 * @returns {boolean}
 */
export const noRequestTypeHasEfforts = (request) => {
    const requestTypeHasEffortArray = WEBDEV_REQUEST_TYPE_KEYS.map((requestType) => {
        if (request && request.get(requestType) !== null) {
            if (request.getIn([requestType, 'teamEfforts']).size > 0) {
                return true;
            }
        }
        return false;
    });

    return requestTypeHasEffortArray.every((requestTypeHasEffort) => requestTypeHasEffort === false);
};

/**
 * Gets efforts of the currently active request type.
 * @param request
 */
export const getActiveRequestTypePropertyValue = (request, property) => {
    let efforts = [];
    WEBDEV_REQUEST_TYPE_KEYS.forEach((requestType) => {
        if (request && request.get(requestType) !== null) {
            efforts = request.getIn([requestType, property]);
        }
    });
    return efforts;
};
