import {NAME} from './constants';

export const SET_COLUMNS = `${NAME}/SET_COLUMNS`;
export const RESET_COLUMNS = `${NAME}/RESET_COLUMNS`;
export const ENABLE_COLUMN = `${NAME}/ENABLE_COLUMN`;
export const DISABLE_COLUMN = `${NAME}/DISABLE_COLUMN`;
export const MOVE_COLUMN = `${NAME}/MOVE_COLUMN`;

/**
 * Sets the state of enabled (displayed) and disabled (not displayed) columns of a table.
 * @param {string[]} enabledColumnIds An array of ids of enabled columns.
 * @param {string[]} disabledColumnIds An array of ids of disabled columns.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 */
export const setColumns = (enabledColumnIds, disabledColumnIds, tableName, tableId) => ({
    type: SET_COLUMNS,
    tableName,
    tableId,
    payload: {
        enabledColumnIds,
        disabledColumnIds,
    },
});

/**
 * Processes the newly enabled column.
 * If the column has been already enabled, nothing will happen.
 * @param {string} columnId The id of the column to enable.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 */
export const enableColumn = (columnId, tableName, tableId) => ({
    type: ENABLE_COLUMN,
    tableName,
    tableId,
    payload: {
        columnId,
    },
});

/**
 * Processes the newly disabled column.
 * If the column has been already disabled, nothing will happen.
 * @param {string} columnId The id of the column to disable.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 */
export const disableColumn = (columnId, tableName, tableId) => ({
    type: DISABLE_COLUMN,
    tableName,
    tableId,
    payload: {
        columnId,
    },
});

/**
 * Processes the updated order of a column.
 * @param {string} columnId Contains the name of the column to reorder.
 * @param {string} direction Information if the column should be moved up or down within the list.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 */
export const moveColumn = (columnId, direction, tableName, tableId) => ({
    type: MOVE_COLUMN,
    tableName,
    tableId,
    payload: {
        columnId,
        direction,
    },
});

/**
 * Resets the columns into the initial order.
 * @param {string[]} enabledColumnIds An array of ids of enabled columns.
 * @param {string[]} disabledColumnIds An array of ids of disabled columns.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 */
export const resetColumns = (enabledColumnIds, disabledColumnIds, tableName, tableId) => ({
    type: RESET_COLUMNS,
    tableName,
    tableId,
    payload: {
        enabledColumnIds,
        disabledColumnIds,
    },
});
