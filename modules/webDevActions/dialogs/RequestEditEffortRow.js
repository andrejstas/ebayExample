import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import util from 'util';
import {MsFormRow, MsFlexLayout, MsSpacingLayout} from 'planning-components';
import enums from 'core/enums';
import {Field, InputText, InputNumber, InRowLayout} from 'containers/form';

const RequestEditEffortRow = ({team, index}) => (
    <MsFormRow
        label={team}
        control={
            <MsFlexLayout alignItems="baseline">
                <Field
                    key={`efforts[${team}].totalEffort`}
                    name={`efforts[${index}].totalEffort`}
                    component={InputText}
                    layout={InRowLayout}
                    size="small"
                    disabled
                    at={`team-${team}-total-effort`}
                />
                <MsSpacingLayout marginLeft="medium" marginRight="medium">
                    {util.SLASH}
                </MsSpacingLayout>
                <Field
                    key={`efforts[${team}].totalOverrideEffort`}
                    name={`efforts[${index}].totalOverrideEffort`}
                    component={InputNumber}
                    layout={InRowLayout}
                    size="small"
                    at={`team-${team}-total-override-effort`}
                />
            </MsFlexLayout>
        }
        at={`team-${team}`}
    />
);

const createMapStateToProps = () => {
    const getEnumValue = enums.selectors.createGetEnumValue();

    return (state, {teamId}) => ({
        team: getEnumValue(state, {enumKey: 'Team', optionId: teamId}),
    });
};

RequestEditEffortRow.propTypes = {
    index: PropTypes.number.isRequired,
    team: PropTypes.string.isRequired,
};

export default connect(createMapStateToProps)(RequestEditEffortRow);
