import React from 'react';
import PropTypes from 'prop-types';

import {MsDropdownButton, MsDropdownButtonItem} from 'planning-components';
import {Msg} from 'containers';
import {connect} from 'react-redux';
import {createEntitySelectors} from 'util/entity';
import util from 'util';
import security from 'core/security';
import router from 'core/router';
import {CHANGE_REQUEST_FIELD, OPS_LINK, PLANNING_CANCEL_STEP, REQUEST_STATE_EDIT, WPR_EDITABLE} from '../constants';
import createEditActualLtsDateDialog from './dialogs/EditActualLtsDateDialog';
import createRequestEditEffortDialog from './dialogs/RequestEditEffortDialog';
import {WEBDEV_REQUEST} from '../routes';

/**
 * Container with action button that is displayed in two places:
 * - right sidebar with the detail of the request
 * - request form with a loaded request
 */
const ActionsComponent = ({
    isVisibleRedirectToOpsRequest,
    redirectToOpsRequest,
    linkToOpsRequest,
    onShowDialogRequestEditEffort,
    isRequestCancelStepAvailable,
    cancelRequest,
    onShowDialogRequestEditActualLtsDate,
    module,
    isChangeRequest,
    isEditRequestAvailable,
    transitionToEditRequest,
    hrefToEditRequest,
}) => {
    const RequestEditEffortDialog = createRequestEditEffortDialog(module);
    const EditActualLtsDateDialog = createEditActualLtsDateDialog(module);

    return (
        <>
            <RequestEditEffortDialog key="request-edit-effort-dialog" />
            <EditActualLtsDateDialog key="request-edit-actual-lts-date-dialog" />
            <MsDropdownButton
                size="medium"
                label={<Msg msg="common.actions" />}
            >
                {isVisibleRedirectToOpsRequest && (
                    <MsDropdownButtonItem
                        key="request-view-ops-button"
                        onClick={redirectToOpsRequest}
                        href={linkToOpsRequest}
                    >
                        <Msg msg="planning.dashboard.webDev.action.viewOpsRequest" />
                    </MsDropdownButtonItem>
                )}
                <MsDropdownButtonItem
                    key="request-edit-effort-button"
                    onClick={onShowDialogRequestEditEffort}
                >
                    <Msg msg="planning.dashboard.webDev.action.editEffort" />
                </MsDropdownButtonItem>
                <MsDropdownButtonItem
                    key="request-edit-actual-lts-date-button"
                    onClick={onShowDialogRequestEditActualLtsDate}
                >
                    <Msg msg="planning.dashboard.webDev.action.editActualLtsDate" />
                </MsDropdownButtonItem>
                {isEditRequestAvailable && (
                    <MsDropdownButtonItem onClick={transitionToEditRequest} href={hrefToEditRequest}>
                        <Msg
                            msg={isChangeRequest
                                ? 'planning.webDev.actions.changeRequest'
                                : 'planning.webDev.actions.editRequest'}
                        />
                    </MsDropdownButtonItem>
                )}
                {isRequestCancelStepAvailable && (
                    <MsDropdownButtonItem
                        key="request-cancel-button"
                        onClick={cancelRequest}
                    >
                        <Msg msg="planning.dashboard.webDev.action.cancelRequest" />
                    </MsDropdownButtonItem>
                )}
            </MsDropdownButton>
        </>
    );
};

ActionsComponent.propTypes = {
    onShowDialogRequestEditEffort: PropTypes.func.isRequired,
    onShowDialogRequestEditActualLtsDate: PropTypes.func.isRequired,
    isRequestCancelStepAvailable: PropTypes.bool,
    isVisibleRedirectToOpsRequest: PropTypes.bool,
    cancelRequest: PropTypes.func.isRequired,
    redirectToOpsRequest: PropTypes.func.isRequired,
    /** Link to OPS request */
    linkToOpsRequest: PropTypes.string,
    module: PropTypes.object.isRequired,
    isChangeRequest: PropTypes.bool,
    isEditRequestAvailable: PropTypes.bool,
    transitionToEditRequest: PropTypes.func.isRequired,
    hrefToEditRequest: PropTypes.string,
};

ActionsComponent.defaultProps = {
    isRequestCancelStepAvailable: false,
    isVisibleRedirectToOpsRequest: false,
    linkToOpsRequest: null,
    isChangeRequest: false,
    isEditRequestAvailable: false,
    hrefToEditRequest: null,
};

const createMapStateToProps = (initialState, {module}) => {
    const entitySelectors = createEntitySelectors(module.detailStore.getEntity);

    return (state) => {
        const entityKey = module.detailStore.getEntityKey(state);
        return ({
            entityKey,
            isEditRequestAvailable: entityKey && entitySelectors.getProperty(state, entityKey, WPR_EDITABLE) && entitySelectors.hasPermission(state, undefined, security.permissions.SAVE),
            isChangeRequest: entitySelectors.getFieldValue(state, undefined, CHANGE_REQUEST_FIELD),
            linkToOpsRequest: entityKey && entitySelectors.getWebLink(state, entityKey, OPS_LINK),
            isRequestCancelStepAvailable: !!entitySelectors.getWorkflowLink(state, undefined, PLANNING_CANCEL_STEP),
            hrefToEditRequest: entityKey && router.getHref(state, WEBDEV_REQUEST, {mode: REQUEST_STATE_EDIT, key: entityKey}),
        });
    };
};

const mapDispatchToProps = (dispatch, {module}) => ({
    createTransitionToEditRequest: (entityKey) => () => dispatch(router.transition(WEBDEV_REQUEST, {mode: REQUEST_STATE_EDIT, key: entityKey})),
    createRedirectToOpsRequest: (linkToOpsRequest) => () => util.goToExternalUrl(linkToOpsRequest),
    detailWorkflowStore: module.detailWorkflowStore,
    onShowDialogRequestEditEffort: () => dispatch(module.showDialogRequestEditEffort()),
    onShowDialogRequestEditActualLtsDate: () => dispatch(module.showDialogRequestEditActualLtsDate()),
    cancelRequest: () => dispatch(
        module.showCancelRequestDialog(module.detailWorkflowStore.doWorkflowStep(undefined, PLANNING_CANCEL_STEP)),
    ),
});

const mergeProps = ({
    entityKey,
    linkToOpsRequest,
    isRequestCancelStepAvailable,
    isChangeRequest,
    isEditRequestAvailable,
    hrefToEditRequest,
},
{
    createTransitionToEditRequest,
    createRedirectToOpsRequest,
    detailWorkflowStore,
    onShowDialogRequestEditEffort,
    cancelRequest,
    onShowDialogRequestEditActualLtsDate,
},
{module}) => ({
    linkToOpsRequest,
    hrefToEditRequest,
    transitionToEditRequest: createTransitionToEditRequest(entityKey),
    isEditRequestAvailable,
    isChangeRequest,
    isVisibleRedirectToOpsRequest: !!linkToOpsRequest,
    redirectToOpsRequest: createRedirectToOpsRequest(linkToOpsRequest),
    detailWorkflowStore,
    onShowDialogRequestEditEffort,
    isRequestCancelStepAvailable,
    cancelRequest,
    onShowDialogRequestEditActualLtsDate,
    module,
});

const ActionsContainer = connect(createMapStateToProps, mapDispatchToProps, mergeProps)(ActionsComponent);

export default ActionsContainer;
