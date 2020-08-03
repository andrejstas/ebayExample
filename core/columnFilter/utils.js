import React from 'react';
import {List} from 'immutable';

import server from 'serverAPI';
import {TableColumn} from 'containers/table';
import util from 'util';
import {LOCAL_STORAGE_SUFFIX} from './constants';

/**
 * Creates an array of TableColumn elements that are required by EntityTable.
 * If the list of enabled columns is empty, then the default set of columns is used.
 * @param {Object} configurationOfColumns A configuration object of all columns of the table.
 * @param {Immutable.List} enabledColumnIds A list of columns (identified by their IDs) that should be displayed.
 * @returns {Component[]}
 */
export const createColumnElements = (configurationOfColumns, enabledColumnIds = util.EMPTY_LIST) => {
    const displayedColumns = enabledColumnIds.size > 0
        ? enabledColumnIds
        : getDefaultColumnIds(configurationOfColumns);
    return displayedColumns
        .map((id) => configurationOfColumns[id])
        .filter((column) => column)
        .map(({id, ...restProps}) => (
            <TableColumn
                key={id}
                {...restProps}
            />
        ));
};

/**
 * Creates a list of default columns based on the configuration object (identified by their IDs).
 * "Default column" means that it is displayed automatically when the user opens the table
 * for the first time.
 * Otherwise the column would be hidden and the user would need to enable it manually.
 * @param {Object} configurationOfColumns A configuration object of all columns of the table.
 * @returns {Immutable.List}
 */
export const getDefaultColumnIds = (configurationOfColumns) => List(
    Object.values(configurationOfColumns)
        .filter((configurationOfColumn) => configurationOfColumn.defaultColumn)
        .map(({id}) => id),
);

/**
 * Creates a list of disabled columns (identified by their IDs) based on the full list of columns and the list of enabled columns.
 * @param {Object} columnsConfiguration A configuration object of all columns of the table.
 * @param {Immutable.List} enabledColumnsIds List of all enabled columns (identified by their IDs) - columns that should be displayed.
 * @returns {Immutable.List}
 */
export const getCalculatedDisabledColumns = (columnsConfiguration, enabledColumnsIds = util.EMPTY_LIST) => List(
    Object.keys(columnsConfiguration).filter((columnId) => !enabledColumnsIds.includes(columnId)),
);

/**
 * Sorts a list of disabled columns ids by the column configuration.
 * @param {Object} columnsConfiguration A configuration object of all columns of the table.
 * @param {Immutable.List} disabledColumnsIds List of all disabled columns (identified by their IDs) - columns that should be hidden.
 * @returns {Immutable.List}
 */
export const getDisabledColumnsInDefaultOrder = (columnsConfiguration, disabledColumnsIds = util.EMPTY_LIST) => List(
    Object.keys(columnsConfiguration).filter((columnId) => disabledColumnsIds.includes(columnId)),
);

/**
 * Creates an object used for creating i18n translations.
 * Each object contains the name of a column and its labelMsg string that will be used for the translation.
 * @param {Object} configurationOfColumns A configuration object of all columns of the table.
 * @returns {Object} Object with all available column names.
 */
export const getColumnLabelMsg = (configurationOfColumns) => (
    Object.entries(configurationOfColumns).reduce((result, [id, column]) => {
        Object.assign(result, {[id]: column.labelMsg});
        return result;
    }, {})
);

/**
 * Returns a new order of elements in a list (two elements have switched positions - a column has been moved up/down).
 * @param {Immutable.List} list List of values.
 * @param {string} value Value to move in the list.
 * @param {number} stepCount Numeric information about how many positions the value should be moved within the list.
 * @returns {Immutable.List} A new list with updated item positions.
 */
export const moveValueInList = (list, value, stepCount) => {
    const actualIndex = list.indexOf(value);
    if (actualIndex > -1) {
        let newIndex = (actualIndex + stepCount);
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= list.size) {
            newIndex = list.size;
        }
        return list.splice(actualIndex, 1).splice(newIndex, 0, value);
    }
    return list;
};

/**
 * Creates a string that will be used a key to save settings for a specific table.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @returns {string} A key under which the user's settings will be saved.
 */
export const userSettingsKeyFormatter = (tableName, tableId) => `${tableName}-${tableId}-${LOCAL_STORAGE_SUFFIX}`;

/**
 * Saves an array of enabled columns (identified by their IDs) into the local storage so that the user can
 * keep the selection of columns also in the next session.
 * @param {Immutable.List} columnIds List of column ids to save.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 */
export const saveColumnIds = (columnIds, tableName, tableId) => {
    server.userSettings.postUserSettings(userSettingsKeyFormatter(tableName, tableId), columnIds.toJS());
};

/**
 * Loads the saved selection of enabled columns (identified by their IDs) to display when the table is loaded
 * for the first time in the session.
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @returns {Immutable.List} loadedColumnIds List of columns (identified by their IDs) to display.
 */
export const loadColumnIds = (tableName, tableId) => {
    const {value: loadedColumnIds} = server.userSettings.getUserSettings(userSettingsKeyFormatter(tableName, tableId));
    return List(loadedColumnIds);
};

/**
 * Filters columns by requirements defined for each column in the column configuration file.
 * If a column has one or more "requirement values" (requirementsToEnable),
 * they all need to be included in the array of "requirements" of the column filter.
 *
 * E.g. This is particularly useful for a special "actions" column in the channel table that may be manipulated only
 * by users with sufficient permissions.
 *
 * @param {Object} configurationOfColumns A configuration object of all columns of the table.
 * @param {Immutable.List} columnIds A list of columns (identified by their IDs) that would be normally displayed
 * if there were no special columns.
 * @param {string[]} requirements An array of successfully verified requirements identified by their names that entered the columnFilter.
 * @returns {Immutable.List} A new list of columns (identified by their IDs).
 */
export const getFilteredColumnIdsByRequirements = (configurationOfColumns, columnIds, requirements) => {
    // Returns the same array of columns identified by their ids if no special requirements are defined.
    if (!requirements) {
        return columnIds;
    }

    // Creates a new list of all columns Ids that may be  enabled/displayed.
    // A column will be added into the "approved" list in case that:
    // - it doesn't have any requirementsToEnable property.
    // - it has one or more properties in "requirementsToEnable" definition, and they are all included in
    // "requirements" array.

    return List(
        columnIds.filter((columnId) =>
            (configurationOfColumns[columnId])
            && (!configurationOfColumns[columnId]?.requirementsToEnable
                || isSubArray(requirements, configurationOfColumns[columnId].requirementsToEnable))),
    );
};

const isSubArray = (mainArray, subArray) => mainArray.every((val) => subArray.includes(val));
