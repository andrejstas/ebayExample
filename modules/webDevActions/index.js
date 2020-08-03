import createActions from './actions';
import createSaga from './saga';
import ActionsButton from './ActionsButton';
import {webDevActionsApi} from '../serverAPI';
import createReducer from './reducer';
import createSelector from './selector';

const webDevActions = ({
    actionPrefix,
    reducerPath,
    detailStore,
    detailWorkflowStore,
    onEditLtsDateSuccess,
    onEditEffortSuccess,
}) => {
    const actions = createActions(actionPrefix);
    const config = {
        detailStore,
        detailWorkflowStore,
        api: webDevActionsApi,
        onEditLtsDateSuccess,
        onEditEffortSuccess,
    };
    const selectors = createSelector(reducerPath);
    const saga = createSaga(actions, config);
    const reducer = createReducer(actions);

    return {
        saga,
        detailStore,
        detailWorkflowStore,
        reducer,
        isShowRequestEditEffortDialog: selectors.isShowRequestEditEffortDialog,
        isShowRequestEditActualLtsDateDialog: selectors.isShowRequestEditActualLtsDateDialog,
        showCancelRequestDialog: actions.showCancelRequestDialog,
        showDialogRequestEditEffort: actions.showDialogRequestEditEffort,
        hideDialogRequestEditEffort: actions.hideDialogRequestEditEffort,
        submitRequestEditEffortDialog: actions.submitRequestEditEffortDialog,
        showDialogRequestEditActualLtsDate: actions.showDialogRequestEditActualLtsDate,
        hideDialogRequestEditActualLtsDate: actions.hideDialogRequestEditActualLtsDate,
        submitChannelEditActualLtsDateDialog: actions.submitChannelEditActualLtsDateDialog,
    };
};

export default webDevActions;

export {ActionsButton};
