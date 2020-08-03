import {List} from 'immutable';

import util from 'util';
import {RESET_COLUMNS, SET_COLUMNS, ENABLE_COLUMN, DISABLE_COLUMN, MOVE_COLUMN} from './actions';
import {ENABLED, DISABLED, MINIMUM_NUMBER_OF_ENABLED_COLUMNS, UP} from './constants';
import {moveValueInList} from './utils';

/**
 * Returns a state with a list of enabled and disabled columns (identified by their IDs).
 * @param state
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @param {object} payload
 */
const setColumns = (state, {tableName, tableId, payload}) => (
    state
        .setIn([tableName, tableId, ENABLED], payload.enabledColumnIds)
        .setIn([tableName, tableId, DISABLED], payload.disabledColumnIds)
);

/**
 * Returns a state with updated enabled/disabled columns (identified by its ID) - one column has been moved from one group to another.
 * Also makes sure that there's always a minimum number of columns displayed.
 * Returns original state if the edited column is not included in the group of columns where it should be removed from.
 * @param state
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @param {object} payload Name of the column to be updated (from disabled to enabled, or the other way).
 * @param {string} operation Definition if the column in the payload should be enabled or disabled.
 */
const updateColumn = (state, {tableName, tableId, payload}, operation) => {
    const {columnId} = payload;
    const operationDirection = (operation === ENABLED) ? {from: DISABLED, to: ENABLED} : {from: ENABLED, to: DISABLED};

    const fromGroup = state.getIn([tableName, tableId, operationDirection.from]);
    // Do nothing if the column doesn't exist in the group of columns where it should be removed from.
    if (!fromGroup.contains(columnId)) {
        return state;
    }

    const toGroup = state.getIn([tableName, tableId, operationDirection.to]);

    // Do nothing if we reach the minimum number of displayed columns.
    if (operation === DISABLED && fromGroup.size <= MINIMUM_NUMBER_OF_ENABLED_COLUMNS) {
        return state;
    }

    return state
        .setIn([tableName, tableId, operationDirection.to], List(toGroup.concat(columnId)))
        .setIn([tableName, tableId, operationDirection.from], List(fromGroup.filter((item) => item !== columnId)));
};

/**
 * Returns a new state based on a new position of a displayed column.
 * @param state
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @param {object} payload Name of the column to be reordered and direction of the reorder (up/down).
 */
const moveColumn = (state, {tableName, tableId, payload}) => {
    const {columnId, direction} = payload;
    const enabledColumnIds = state.getIn([tableName, tableId, ENABLED]);
    const stepCount = (direction === UP) ? -1 : 1;
    const reorderedEnabledColumnIds = moveValueInList(enabledColumnIds, columnId, stepCount);
    return state.setIn([tableName, tableId, ENABLED], reorderedEnabledColumnIds);
};

export const columnsReducer = (state = util.EMPTY_MAP, action) => {
    switch (action.type) {
        case SET_COLUMNS:
            return setColumns(state, action);
        case RESET_COLUMNS:
            return setColumns(state, action);
        case ENABLE_COLUMN:
            return updateColumn(state, action, ENABLED);
        case DISABLE_COLUMN:
            return updateColumn(state, action, DISABLED);
        case MOVE_COLUMN:
            return moveColumn(state, action);
        default:
            return state;
    }
};

export default columnsReducer;
