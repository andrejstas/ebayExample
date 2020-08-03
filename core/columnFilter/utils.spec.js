import {expect} from 'chai';
import {List} from 'immutable';

import util from 'util';
import {
    userSettingsKeyFormatter,
    getFilteredColumnIdsByRequirements,
    getCalculatedDisabledColumns,
    getDefaultColumnIds,
} from './utils';
import {LOCAL_STORAGE_SUFFIX} from './constants';

const tableName = 'tableName';
const tableId = 'tableId';
const configurationOfColumns = {
    campaignName: {
        id: 'campaignName',
        defaultColumn: true,
    },
    dueDate: {
        id: 'dueDate',
    },
    ltsWeek: {
        id: 'ltsWeek',
    },
    actions: {
        id: 'actions',
        requirementsToEnable: ['bulkActions'],
        defaultColumn: true,
    },
};
describe('ColumnFilter utils functions', () => {
    describe('userSettingsKeyFormatter function', () => {
        const userSettingsKey = `${tableName}-${tableId}-${LOCAL_STORAGE_SUFFIX}`;
        it('should create a user settings key.', () => {
            expect(userSettingsKeyFormatter(tableName, tableId)).to.equal(userSettingsKey);
        });
    });

    const columnIds = List(['campaignName', 'dueDate', 'actions']);
    describe('getFilteredColumnIdsByRequirements function', () => {
        const requirements = ['bulkActions'];
        it('should return an array of column ids including those with special requirements.', () => {
            expect(getFilteredColumnIdsByRequirements(configurationOfColumns, columnIds, requirements))
                .to.deep.equal(columnIds);
        });

        const notSufficientRequirements = ['campaignName', 'dueDate'];
        const columnIdsWithoutExtraRequirementColumns = List(['campaignName', 'dueDate']);
        it('should return a list of column ids excluding those with special requirements.', () => {
            expect(getFilteredColumnIdsByRequirements(configurationOfColumns, columnIds, notSufficientRequirements))
                .to.deep.equal(columnIdsWithoutExtraRequirementColumns);
        });

        const noRequirements = null;
        it('should return all column ids if no requirements are defined.', () => {
            expect(getFilteredColumnIdsByRequirements(configurationOfColumns, columnIds, noRequirements))
                .to.deep.equal(columnIds);
        });
    });

    describe('getCalculatedDisabledColumns function', () => {
        const disabledColumnIds = List(['actions']);
        const enabledColumnIds = List(['campaignName', 'dueDate', 'ltsWeek']);
        it('should return a list of enabled columns based on the column configuration file.', () => {
            expect(getCalculatedDisabledColumns(configurationOfColumns, enabledColumnIds))
                .to.deep.equal(disabledColumnIds);
        });

        const allEnabledColumnIds = List(['campaignName', 'dueDate', 'ltsWeek', 'actions']);
        const emptyList = List(util.EMPTY_LIST);
        it('should return an empty list of disabled column ids based on the column configuration' +
            'and  if all columns are supposed to be displayed in default.', () => {
            expect(getCalculatedDisabledColumns(configurationOfColumns, allEnabledColumnIds))
                .to.deep.equal(emptyList);
        });
    });

    describe('getDefaultColumnIds function', () => {
        const defaultColumns = List(['campaignName', 'actions']);
        it('should get the list of default column ids from the configuration object.', () => {
            expect(getDefaultColumnIds(configurationOfColumns))
                .to.equal(defaultColumns);
        });
    });
});
