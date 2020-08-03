import {takeEvery, call, take, delay, fork} from 'redux-saga/effects';

import util from 'util';
import {NAME} from './constants';
import {
    trackEvent,
    trackPageView,
    trackRoleDimension,
    connectToMatomoServer,
} from './trackingAPI';
import {isSubset, isNotGadgetUrl} from './util';
import {trackedReduxActionTypes, trackedReduxActions} from './configuration';
import trackingAPI from './serverAPI';
import router from '../router';

/**
 * Catches all actions and checks if their types are defined in the list of tracked action types.
 * If so, it also checks the content of the action.
 *
 * In case it is a defined tracked action then tracks it as event, page view or both.
 */
export const trackAllActionsSaga = function* trackAllActionsSaga(action) {
    if (trackedReduxActionTypes.includes(action.type)) {
        const subActions = trackedReduxActions[action.type];
        const trackedAction = subActions.find(isSubset(action, 'requiredPropertiesInAction'));

        if (trackedAction) {
            if (trackedAction.eventDefinition) {
                const {eventCategory, eventAction, eventName} = trackedAction.eventDefinition;
                yield call(trackEvent, eventCategory, eventAction, eventName);
            }
            if (trackedAction.pageViewDefinition) {
                const {customUrl, documentTitle} = trackedAction.pageViewDefinition;
                yield call(
                    trackPageView,
                    `${window.location.pathname}${customUrl}`,
                    `${document.title}${util.SPACE}${documentTitle}`,
                );
            }
        }
    }
};

/**
 * Sets the dimension of the session.
 */
export const trackRoleDimensionSaga = function* trackRoleDimensionSaga(roles) {
    if (Array.isArray(roles) && roles.length > 0) {
        yield call(trackRoleDimension, roles.join(', '));
    }
};

/**
 * Fetches all the roles that belong to the currently signed user.
 * @returns {Array} An array of roles
 */
export const getMyRoleSaga = function* getMyRoleSaga() {
    try {
        return yield call(trackingAPI.getMyRole);
    } catch (e) {
        return null;
    }
};

/**
 * Detects new routes (pages) and then sends the information to as a new page view.
 */
export const trackPageViewSaga = function* trackPageViewSaga() {
    // cycled saga so that it could detect each jump to a new page
    for (;;) {
        yield take(router.ENTER_ROUTE);
        yield delay(0); // wait until the document title is loaded properly (otherwise is empty)
        // ignore tracking page views of gadgets, jira is tracked separately
        if (isNotGadgetUrl()) {
            yield call(
                trackPageView,
                window.location.pathname,
                document.title,
            );
        }
    }
};

/**
 * Connects to the matomo server, gets user roles, set the dimension, tracks events and page views
 */
export default function* () {
    // connects to the server
    yield call(connectToMatomoServer);
    // loads roles
    const roles = yield call(util.tryFetch, NAME, getMyRoleSaga);
    // sets role dimensions in matomo
    yield call(trackRoleDimensionSaga, roles);
    // detects any loaded page (first loaded page and also all others)
    yield fork(trackPageViewSaga);
    // detects all actions and fires events and custom page views
    yield takeEvery('*', trackAllActionsSaga);
}
