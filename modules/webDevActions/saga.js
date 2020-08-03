import {initialize} from 'redux-form/immutable';
import {Map} from 'immutable';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';

import util from 'util';
import errorModule from 'core/errors';
import {handleAllErrorsForForm} from 'util/error';
import {REQUEST_EDIT_ACTUAL_DATE_FORM, REQUEST_EDIT_EFFORT_FORM} from './constants';
import {getActiveRequestTypePropertyValue} from './utils';

export default (actions, config) => {
    const {
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SUBMIT,
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW,
        REQUEST_DIALOG_EDIT_EFFORT_SHOW,
        REQUEST_DIALOG_EDIT_EFFORT_SUBMIT,
        hideDialogRequestEditActualLtsDate,
        hideDialogRequestEditEffort,
    } = actions;

    const {
        api,
        detailStore,
        onEditLtsDateSuccess,
        onEditEffortSuccess,
    } = config;

    /**
     * Submits the new actual LTS date and closes the dialog window.
     * @param values The new actual LTS date.
     */
    const submitEditActualLtsDateSaga = function* submitEditActualLtsDateSaga({values}) {
        try {
            const selectedRequestId = yield select(detailStore.getEntityKey);

            const requestDetail = yield call(
                util.tryFetch,
                REQUEST_EDIT_ACTUAL_DATE_FORM,
                api.postRequestEditActualLtsDate,
                selectedRequestId,
                {actualLtsDate: values},
            );
            yield put(detailStore.setEntity(requestDetail));
            yield put(hideDialogRequestEditActualLtsDate());
            if (onEditLtsDateSuccess) {
                yield put(onEditLtsDateSuccess());
            }
        } catch (error) {
            yield call(
                handleAllErrorsForForm,
                error,
                REQUEST_EDIT_ACTUAL_DATE_FORM,
                'planning.dashboard.webDev.edit.actualLtsDate.error',
                'planning.dashboard.webDev.edit.actualLtsDate.error',
            );
        }
    };

    /**
     * Loads current lts and actual date into the form in a modal window.
     */
    const fillEditActualLtsDateFormSaga = function* fillEditActualLtsDateFormSaga() {
        yield put(errorModule.actions.clearErrors(REQUEST_EDIT_ACTUAL_DATE_FORM));
        const selectedRequest = yield select(detailStore.getEntity);
        yield put(initialize(REQUEST_EDIT_ACTUAL_DATE_FORM, Map({
            preferredLtsDate: selectedRequest.get('preferredLtsDate'),
            currentActualLtsDate: selectedRequest.get('actualLtsDate'),
        })));
    };

    /**
     * Loads current effort data into the "edit effort" form in a modal window.
     */
    const fillEditEffortFormSaga = function* fillFormSaga() {
        const selectedRequest = yield select(detailStore.getEntity);
        const efforts = yield call(getActiveRequestTypePropertyValue, selectedRequest, 'teamEfforts');
        yield put(initialize(REQUEST_EDIT_EFFORT_FORM, Map({efforts})));
    };

    /**
     * Updates the efforts of a webDev request and closes the dialog window.
     * @param values Updates effort values
     */
    const submitEditEffortSaga = function* submitEditEffortSaga({values}) {
        try {
            const selectedRequest = yield select(detailStore.getEntity);
            const requestTypeId = yield call(getActiveRequestTypePropertyValue, selectedRequest, 'id');
            const requestDetail = yield call(
                util.tryFetch,
                REQUEST_EDIT_EFFORT_FORM,
                api.postRequestEditEffort,
                requestTypeId,
                {efforts: values},
            );
            yield put(detailStore.setEntity(requestDetail));
            yield put(hideDialogRequestEditEffort());
            if (onEditEffortSuccess) {
                yield put(onEditEffortSuccess());
            }
        } catch (error) {
            yield call(
                handleAllErrorsForForm,
                error,
                REQUEST_EDIT_EFFORT_FORM,
                'planning.dashboard.webDev.edit.efforts.error',
                'planning.dashboard.webDev.edit.efforts.error',
            );
        }
    };

    return function* requestSaga() {
        yield all([
            takeLatest(REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SUBMIT, submitEditActualLtsDateSaga),
            takeLatest(REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW, fillEditActualLtsDateFormSaga),
            takeLatest(REQUEST_DIALOG_EDIT_EFFORT_SUBMIT, submitEditEffortSaga),
            takeLatest(REQUEST_DIALOG_EDIT_EFFORT_SHOW, fillEditEffortFormSaga),
        ]);
    };
};
