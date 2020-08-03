import {expect} from 'chai';
import {List} from 'immutable';

import util from 'util';
import {NAME, PARENT_MODULE, UP, DOWN} from './constants';
import reducer from './reducer';
import {setColumns, enableColumn, disableColumn, moveColumn, resetColumns} from './actions';
import {getEnabledColumnIds, getDisabledColumnIds} from './selectors';

describe('ColumnFilter module', () => {
    const reducerPath = [PARENT_MODULE, NAME];
    const tableName = 'tableName';
    const tableId = 'tableId';
    const enabledColumnIds = List(['col1', 'col2', 'col3', 'col4']);
    const disabledColumnIds = List(['col5', 'col6', 'col7', 'col8']);
    feature('Initializing of column filter', reducer, reducerPath, () => {
        scenario('Initial empty state of columns', () => {
            given();
            then('Get an empty list of enabled columns from empty state', getEnabledColumnIds, tableName, tableId,
                (result) => expect(result).to.equal(util.EMPTY_LIST));
        });
    });
    feature('Moving and enabling/disabling of columns', reducer, reducerPath, () => {
        scenario('State of enabled columns after setting columns', () => {
            given();
            when('Columns are set', setColumns, enabledColumnIds, disabledColumnIds, tableName, tableId);
            then('The list of enabled columns is set', getEnabledColumnIds, tableName, tableId,
                (result) => expect(result).to.be.equal(enabledColumnIds));
            then('The list of disabled columns is set', getDisabledColumnIds, tableName, tableId,
                (result) => expect(result).to.be.equal(disabledColumnIds));
            result('Set enabled and disabled columns');
        });
        const columnToMove = 'col2';
        scenario('Moving a column up in a list', () => {
            const expectedResult = List(['col2', 'col1', 'col3', 'col4']);
            given('Set enabled and disabled columns');
            when('A certain enabled column is moved up in the list', moveColumn, columnToMove, UP, tableName, tableId);
            then('The updated list of enabled columns is set', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(expectedResult));
        });
        scenario('Moving a column down in a list', () => {
            const expectedResult = List(['col1', 'col3', 'col2', 'col4']);
            given('Set enabled and disabled columns');
            when('A certain enabled column is moved down in the list', moveColumn, columnToMove, DOWN, tableName, tableId);
            then('The updated list of enabled columns is set', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(expectedResult));
        });
        scenario('Moving the first enabled column up in a list', () => {
            const firstColumnToMove = 'col1';
            given('Set enabled and disabled columns');
            when('The first enabled column is moved up in the list', moveColumn, firstColumnToMove, UP, tableName, tableId);
            then('The list of enabled columns stays intact', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(enabledColumnIds));
        });
        scenario('Moving the last column enabled down in a list', () => {
            const lastColumnToDown = 'col4';
            given('Set enabled and disabled columns');
            when('The last enabled column is moved down in the list', moveColumn, lastColumnToDown, DOWN, tableName, tableId);
            then('The list of enabled columns stays intact', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(enabledColumnIds));
        });
        const columntoEnable = 'col5';
        const columntoDisable = 'col1';
        scenario('Enabling of a column', () => {
            const enabledColumnIdsWithEnabledId = List(['col1', 'col2', 'col3', 'col4', 'col5']);
            given('Set enabled and disabled columns');
            when('A certain disabled column is enabled', enableColumn, columntoEnable, tableName, tableId);
            then('The updated list of enabled columns is set', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(enabledColumnIdsWithEnabledId));
        });
        scenario('Disabling of a column', () => {
            const disabledColumnIdsWithEnabledId = List(['col2', 'col3', 'col4']);
            given('Set enabled and disabled columns');
            when('A certain enabled column is disabled', disableColumn, columntoDisable, tableName, tableId);
            then('The updated list of enabled columns is set', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(disabledColumnIdsWithEnabledId));
        });
        scenario('Enabling of an already enabled column', () => {
            const alreadyEnabledColumn = 'col1';
            given('Set enabled and disabled columns');
            when('A certain enabled column is enabled again', enableColumn, alreadyEnabledColumn, tableName, tableId);
            then('The updated list of enabled columns is set intact', getEnabledColumnIds,
                tableName, tableId, (result) => expect(result).to.be.equal(enabledColumnIds));
        });
        scenario('Disabling of an already disabled column', () => {
            const alreadyDisabledColumn = 'col5';
            given('Set enabled and disabled columns');
            when('A certain disabled column is disabled again', disableColumn, alreadyDisabledColumn, tableName, tableId);
            then('The updated list of disabled columns is set intact', getDisabledColumnIds,
                tableName, tableId, (result) => expect(result).to.be.equal(disabledColumnIds));
        });
        scenario('Not possible to disable a column if there are too few columns enabled', () => {
            const shortEnabledColumnIds = List(['col1', 'col2']);
            given();
            when('Set the initial columns', setColumns, shortEnabledColumnIds, disabledColumnIds, tableName, tableId);
            when('A certain enabled column is disabled', disableColumn, columntoDisable, tableName, tableId);
            then('The list of enabled columns stays intact', getEnabledColumnIds, tableName, tableId, (result) => expect(result)
                .to.be.equal(shortEnabledColumnIds));
        });
        scenario('Resetting columns reorders both enabled and disabled columns into the initial order', () => {
            given('Set enabled and disabled columns');
            when('A certain enabled column is disabled', disableColumn, columntoDisable, tableName, tableId);
            when('Reset is applied', resetColumns, enabledColumnIds, disabledColumnIds, tableName, tableId);
            then('The list of enabled columns is identical to the initial settings', getEnabledColumnIds,
                tableName, tableId, (result) => expect(result).to.be.equal(enabledColumnIds));
            then('The list of disabled columns is identical to the initial settings', getDisabledColumnIds,
                tableName, tableId, (result) => expect(result).to.be.equal(disabledColumnIds));
        });
    });
});
