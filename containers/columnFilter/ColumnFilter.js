import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import IPropTypes from 'react-immutable-proptypes';

import columnFilter from 'core/columnFilter';
import {CancelButton} from 'containers/buttons';
import {Msg} from 'containers';
import {
    MsIconDropdown,
    MsSelect,
    MsSelectOption,
    MsSortableDropdownList,
    MsSortableDropdownItem,
    MsHoverTooltip,
    MsSpacingLayout,
} from 'planning-components';
import {CLICK_OUTSIDE_EXCEPTION} from './constants';

/**
 * A container that displays "settings" button that allows to enable/disable columns of a table.
 * This button is usually displayed above the table that is supposed to be customized.
 *
 * It also manages loading and saving the preferences into the localStorage and updates the state.
 */
const ColumnFilter = ({
    disableColumn,
    disabledColumnIdsInDefaultOrder,
    disabledDefaultColumnIds,
    disabledInitialColumnIds,
    enableColumn,
    enabledColumnIds,
    enabledDefaultColumnIds,
    enabledInitialColumnIds,
    labels,
    moveColumn,
    resetColumns,
    selectDisabled,
    setColumns,
    tableId,
    tableName,
}) => {
    useEffect(() => {
        setColumns(enabledInitialColumnIds, disabledInitialColumnIds, tableName, tableId);
    }, [tableName, tableId]);

    const onResetColumns = () => {
        resetColumns(enabledDefaultColumnIds, disabledDefaultColumnIds, tableName, tableId);
    };
    const onDisableColumn = (column) => {
        if (column) {
            disableColumn(column, tableName, tableId);
        }
    };
    const onEnableColumn = (column) => {
        if (column) {
            enableColumn(column, tableName, tableId);
        }
    };
    const onMoveColumn = (column, direction) => {
        if (column) {
            moveColumn(column, direction, tableName, tableId);
        }
    };

    return (
        <MsHoverTooltip content={<Msg msg="common.custom.column.settings" />}>
            <MsIconDropdown
                at="columnFilter"
                id="filter"
                icon="mdi-settings"
                clickOutsideException={CLICK_OUTSIDE_EXCEPTION}
                closeOnScroll={false}
            >
                <MsSelect
                    at="columnFilterSelect"
                    disabled={selectDisabled}
                    size="auto"
                    onChange={onEnableColumn}
                    value="0"
                    placeholder={labels.get('placeholder')}
                >
                    {disabledColumnIdsInDefaultOrder.map((columnId) => (
                        <MsSelectOption value={columnId} key={columnId}>
                            {labels.get(columnId)}
                        </MsSelectOption>
                    ))}
                </MsSelect>
                <MsSortableDropdownList
                    at="columnFilterDropdownList"
                    returnMoveClick={onMoveColumn}
                    returnRemoveClick={onDisableColumn}
                    noItemsLabel={labels.get('noItemsLabel')}
                >
                    {enabledColumnIds.map((columnId) => (
                        <MsSortableDropdownItem id={columnId} key={columnId}>
                            {labels.get(columnId)}
                        </MsSortableDropdownItem>
                    ))}
                </MsSortableDropdownList>
                <MsSpacingLayout marginTop="medium">
                    <CancelButton
                        labelMsg="common.button.defaultView"
                        onClick={onResetColumns}
                        at="columnFilterResetButton"
                    />
                </MsSpacingLayout>
            </MsIconDropdown>
        </MsHoverTooltip>
    );
};

ColumnFilter.propTypes = {
    /** Function that disables/hides a displayed column. */
    disableColumn: PropTypes.func.isRequired,
    /** List of disabled/hidden columns in the default order. */
    disabledColumnIdsInDefaultOrder: IPropTypes.listOf(PropTypes.string).isRequired,
    /** List of disabled/hidden columns in the initial state. */
    disabledInitialColumnIds: IPropTypes.listOf(PropTypes.string).isRequired,
    /** Function that enables/displays a hidden column. */
    enableColumn: PropTypes.func.isRequired,
    /** List of enabled/displayed columns. */
    enabledColumnIds: IPropTypes.listOf(PropTypes.string).isRequired,
    /** List of enabled/displayed columns. */
    enabledInitialColumnIds: IPropTypes.listOf(PropTypes.string).isRequired,
    /** List of default enabled/displayed columns. */
    enabledDefaultColumnIds: IPropTypes.listOf(PropTypes.string).isRequired,
    /** List of default disabled/hidden columns. */
    disabledDefaultColumnIds: IPropTypes.listOf(PropTypes.string).isRequired,
    /** Unique ID of a table. */
    tableId: PropTypes.string.isRequired,
    /** Name of a table */
    tableName: PropTypes.string.isRequired,
    /** Labels used when displaying column filter. */
    labels: IPropTypes.mapContains({
        placeholder: PropTypes.string.isRequired,
        noItemsLabel: PropTypes.string.isRequired,
    }).isRequired,
    /** Function that moves columns up and down in the list. */
    moveColumn: PropTypes.func.isRequired,
    /** Function that disables/hides a displayed column. */
    selectDisabled: PropTypes.bool.isRequired,
    /** Function that sets the the lists of enabled and disabled columns. */
    setColumns: PropTypes.func.isRequired,
    /** Function that resets the the lists of enabled and disabled columns into the default order. */
    resetColumns: PropTypes.func.isRequired,
};

const createMapStateToProps = () => {
    const labels = {
        placeholder: 'common.custom.column.placeholder',
        noItemsLabel: 'common.noResults',
    };
    const getMessages = columnFilter.createGetMessages();
    return (state, {tableName, tableId, configurationOfColumns}) => ({
        labels: getMessages(configurationOfColumns, labels)(state),
        disabledColumnIds: columnFilter.getDisabledColumnIds(state, tableName, tableId),
        enabledColumnIds: columnFilter.getEnabledColumnIds(state, tableName, tableId),
    });
};

const mapDispatchToProps = {
    setColumns: columnFilter.setColumns,
    disableColumn: columnFilter.disableColumn,
    enableColumn: columnFilter.enableColumn,
    moveColumn: columnFilter.moveColumn,
    resetColumns: columnFilter.resetColumns,
};

const mergeProps = (
    {
        disabledColumnIds,
        enabledColumnIds,
        labels,
    }, {
        resetColumns,
        disableColumn,
        enableColumn,
        moveColumn,
        setColumns,
    }, {
        configurationOfColumns,
        requirements,
        tableId,
        tableName,
    },
) => {
    const enabledDefaultColumnIds = columnFilter.getDefaultColumnIds(configurationOfColumns);
    const disabledDefaultColumnIds = columnFilter.getCalculatedDisabledColumns(
        configurationOfColumns,
        enabledDefaultColumnIds,
    );

    const loadedColumns = columnFilter.loadColumnIds(tableName, tableId);
    const enabledInitialColumnIds = loadedColumns.size > 0
        ? loadedColumns
        : enabledDefaultColumnIds;
    const disabledInitialColumnIds = columnFilter.getCalculatedDisabledColumns(
        configurationOfColumns,
        enabledInitialColumnIds,
    );

    return {
        enabledDefaultColumnIds,
        disabledDefaultColumnIds,
        resetColumns,
        disableColumn,
        disabledColumnIdsInDefaultOrder: columnFilter.getDisabledColumnsInDefaultOrder(
            configurationOfColumns,
            disabledColumnIds,
        ),
        disabledInitialColumnIds: columnFilter.getFilteredColumnIdsByRequirements(
            configurationOfColumns,
            disabledInitialColumnIds,
            requirements,
        ),
        enableColumn,
        enabledColumnIds,
        enabledInitialColumnIds: columnFilter.getFilteredColumnIdsByRequirements(
            configurationOfColumns,
            enabledInitialColumnIds,
            requirements,
        ),
        labels,
        moveColumn,
        requirements,
        selectDisabled: disabledColumnIds.size === 0,
        setColumns,
        tableId,
        tableName,
    };
};

export {ColumnFilter};

export default connect(createMapStateToProps, mapDispatchToProps, mergeProps)(ColumnFilter);
