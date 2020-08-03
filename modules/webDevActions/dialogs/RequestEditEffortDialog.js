import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';
import {compose} from 'recompose';

import {Dialog, Msg} from 'containers';
import {MsFormSection, MsLoadingOverlay} from 'planning-components';
import fetching from 'core/fetching';
import {REQUEST_EDIT_EFFORT_FORM} from '../constants';
import RequestEditEffortRow from './RequestEditEffortRow';
import {noRequestTypeHasEfforts, getActiveRequestTypePropertyValue} from '../utils';

export default (module) => {
    const mapStateToProps = (state) => ({
        request: module.detailStore.getEntity(state),
        show: module.isShowRequestEditEffortDialog(state),
        isSubmitting: fetching.isFetching(state, REQUEST_EDIT_EFFORT_FORM),
    });

    const mapDispatchToProps = (dispatch) => ({
        onClose: () => dispatch(module.hideDialogRequestEditEffort()),
    });

    const mergeProps = ({show, request, isSubmitting}, {onClose}, {handleSubmit}) => {
        const efforts = getActiveRequestTypePropertyValue(request, 'teamEfforts');

        return ({
            show,
            onClose,
            onSubmit: handleSubmit,
            titleMsg: 'planning.webDev.actions.editEffort',
            submitMsg: 'common.button.submit',
            cancelMsg: 'common.button.cancel',
            at: 'edit-effort-dialog',
            children: (
                <MsLoadingOverlay isLoading={isSubmitting}>
                    <form>
                        {
                            efforts.size > 0 ? (
                                <MsFormSection key="request-edit-effort" borderBottom="none">
                                    {efforts.map((effort, index) => (
                                        <RequestEditEffortRow
                                            teamId={effort.get('channelTeam')}
                                            key={`request-edit-effort-${effort.get('channelTeam')}`}
                                            index={index}
                                        />
                                    ))}
                                </MsFormSection>
                            ) : (
                                <Msg key="request-edit-effort" msg="planning.dashboard.webDev.channelDetail.noEfforts" />
                            )
                        }
                    </form>
                </MsLoadingOverlay>
            ),
            disabled: noRequestTypeHasEfforts(request) || isSubmitting,
        });
    };

    return compose(
        reduxForm({
            form: REQUEST_EDIT_EFFORT_FORM,
            onSubmit: (values, dispatch) => dispatch(module.submitRequestEditEffortDialog(values.get('efforts').toJS())),
        }),
        connect(mapStateToProps, mapDispatchToProps, mergeProps),
    )(Dialog);
};
