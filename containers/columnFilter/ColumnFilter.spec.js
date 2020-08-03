import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import {List, Map} from 'immutable';

import {
    MsIconDropdown,
    MsSelect,
    MsSortableDropdownList,
    MsHoverTooltip,
} from 'planning-components';
import columnFilter from 'core/columnFilter';
import {ColumnFilter} from './ColumnFilter';

const props = {
    disableColumn: columnFilter.disableColumn,
    disabledColumnIdsInDefaultOrder: List(['dueDate']),
    disabledInitialColumnIds: List(['dueDate']),
    disabledDefaultColumnIds: List(['dueDate']),
    enableColumn: columnFilter.enableColumn,
    enabledColumnIds: List(['campaignName', 'ltsWeek']),
    enabledDefaultColumnIds: List(['campaignName', 'ltsWeek']),
    enabledInitialColumnIds: List(['campaignName', 'ltsWeek']),
    labels: Map({
        dueDate: 'Due Date',
        placeholder: 'placeholder',
        noItemsLabel: 'noItemsLabel',
    }),
    moveColumn: columnFilter.moveColumn,
    resetColumns: columnFilter.resetColumns,
    selectDisabled: false,
    setColumns: columnFilter.setColumns,
    tableId: 'tableId',
    tableName: 'tableName',
};

describe('ColumnFilter component', () => {
    it('should display all important child components.', () => {
        const wrapper = shallow(<ColumnFilter {...props} />);
        expect(wrapper).to.have.type(MsHoverTooltip);
        expect(wrapper.find('MsIconDropdown')).to.have.type(MsIconDropdown);
        expect(wrapper.find('MsSelect')).to.have.type(MsSelect);
        expect(wrapper.find('MsSortableDropdownList')).to.have.type(MsSortableDropdownList);
    });
});
