import {select, takeEvery, call} from 'redux-saga/effects';

import {ENABLE_COLUMN, DISABLE_COLUMN, MOVE_COLUMN, RESET_COLUMNS} from './actions';
import {getEnabledColumnIds} from './selectors';
import {saveColumnIds} from './utils';

export default function* columnFilterSaga() {
    yield takeEvery([ENABLE_COLUMN, DISABLE_COLUMN, MOVE_COLUMN, RESET_COLUMNS], saveColumnSaga);
}

/**
 * Gets the list of enabled column IDs and saves them so when the user views the table next time,
 * all the columns will be displayed as set before.
 * @param {string} tableName Name of a table.
 * @param {string} tableId Unique id a the table.
 */
export const saveColumnSaga = function* saveColumnSaga({tableName, tableId}) {
    const enabledColumnIds = yield select(getEnabledColumnIds, tableName, tableId);
    yield call(saveColumnIds, enabledColumnIds, tableName, tableId);
};
