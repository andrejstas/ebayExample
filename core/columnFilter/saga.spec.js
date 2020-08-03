import {expectSaga, testSaga} from 'redux-saga-test-plan';
import {select, call} from 'redux-saga/effects';
import {List} from 'immutable';

import columnFilterSaga, {saveColumnSaga} from './saga';
import {ENABLE_COLUMN, DISABLE_COLUMN, MOVE_COLUMN, RESET_COLUMNS} from './actions';
import {getEnabledColumnIds} from './selectors';
import {saveColumnIds} from './utils';

describe('ColumnFilter sagas', () => {
    describe('columnFilterSaga saga', () => {
        it('should be able to accept enable/disable/move actions of the columns.', () =>
            testSaga(columnFilterSaga)
                .next()
                .takeEvery([ENABLE_COLUMN, DISABLE_COLUMN, MOVE_COLUMN, RESET_COLUMNS], saveColumnSaga)
                .finish()
                .isDone());
    });

    describe('saveColumnSaga', () => {
        const columns = List(['col1', 'col2']);
        const tableName = 'tableName';
        const tableId = 'tableId';
        it('should save the list of enabledColumnIds.', () =>
            expectSaga(saveColumnSaga, {tableName, tableId})
                .provide([
                    [select(getEnabledColumnIds, tableName, tableId), columns],
                    [call(saveColumnIds, columns, tableName, tableId), null],
                ])
                .select(getEnabledColumnIds, tableName, tableId)
                .call(saveColumnIds, columns, tableName, tableId)
                .run());
    });
});
