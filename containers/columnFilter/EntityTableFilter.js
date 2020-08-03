import React from 'react';
import PropTypes from 'prop-types';
import IPropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';

import columnFilter from 'core/columnFilter';
import {EntityTable} from 'containers/entity';

/**
 * A container that extends EntityTable. It dynamically generates an array of columns defined by column configuration
 * in combination with the list of enabled columns loaded from the state.
 */
const EntityTableFilter = ({
    at,
    configurationOfColumns,
    enabledColumnIds,
    entityStore,
    extendedPaging,
    nodeBefore,
    onRowClick,
    selectedRowId,
}) => (
    <EntityTable
        entityStore={entityStore}
        onRowClick={onRowClick}
        selectedRowId={selectedRowId}
        at={at}
        extendedPaging={extendedPaging}
        nodeBefore={nodeBefore}
    >
        {columnFilter.createColumnElements(configurationOfColumns, enabledColumnIds)}
    </EntityTable>
);

EntityTableFilter.propTypes = {
    /** ID used for testing. */
    at: PropTypes.string.isRequired,
    /** Configuration of columns is different for each table and
     * therefore it is not possible to describe the object explicitly. */
    /* eslint-disable-next-line react/forbid-prop-types */
    configurationOfColumns: PropTypes.object.isRequired,
    /** List of enabled Ids. */
    enabledColumnIds: IPropTypes.listOf(PropTypes.string).isRequired,
    /** An instance of entityStore */
    /* eslint-disable-next-line react/forbid-prop-types */
    entityStore: PropTypes.object.isRequired,
    /** Allows up to 1000 rows on a page. */
    extendedPaging: PropTypes.bool,
    /** A block to display above the table. */
    nodeBefore: PropTypes.node,
    /** Action that will occur if the user clicks on a row. */
    onRowClick: PropTypes.func.isRequired,
    /** ID of a selected row. */
    selectedRowId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

EntityTableFilter.defaultProps = {
    extendedPaging: false,
    nodeBefore: null,
    selectedRowId: null,
};

const mapStateToProps = (state, {tableName, tableId}) => ({
    enabledColumnIds: columnFilter.getEnabledColumnIds(state, tableName, tableId),
});

export default connect(mapStateToProps)(EntityTableFilter);
