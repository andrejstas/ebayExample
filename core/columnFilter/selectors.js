import util from 'util';
import {createSelector} from 'reselect';

import {getColumnLabelMsg} from './utils';
import i18n from '../i18n';
import {NAME, PARENT_MODULE, ENABLED, DISABLED} from './constants';

const getModel = (state) => state.getIn([PARENT_MODULE, NAME], util.EMPTY_MAP);

/**
 * Returns the list of enabled (displayed) columns from the state.
 * @param state
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @returns {Immutable.List} Immutable list with ids of enabled columns.
 */
export const getEnabledColumnIds = (state, tableName, tableId) => (
    getModel(state).getIn([tableName, tableId, ENABLED], util.EMPTY_LIST)
);

/**
 * Returns the list of disabled (not displayed) columns from the state.
 * @param state
 * @param {string} tableName Name of the table.
 * @param {string} tableId Unique id of the table.
 * @returns {Immutable.List} Immutable list with ids of disabled columns.
 */
export const getDisabledColumnIds = (state, tableName, tableId) => (
    getModel(state).getIn([tableName, tableId, DISABLED], util.EMPTY_LIST)
);

/**
 * Creates a selector which takes state and messages object and returns an immutable map with translated messages.
 * @param {Object} configurationOfColumns A configuration object of all columns of the table.
 * @param {Object} labels Extra labels needed in order to display the column filter.
 * @return selector
 */
export const createGetMessages = () => createSelector(
    (configurationOfColumns) => configurationOfColumns,
    (configurationOfColumns, labels) => labels,
    (configurationOfColumns, labels) => {
        const messages = {
            ...getColumnLabelMsg(configurationOfColumns),
            ...labels,
        };
        return i18n.createGetStructuredMessages(messages);
    },
);
