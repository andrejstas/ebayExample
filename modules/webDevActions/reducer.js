import {combineReducers} from 'redux-immutable';

export default (actions) => {
    const {
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_CLOSE,
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW,
        REQUEST_DIALOG_EDIT_EFFORT_CLOSE,
        REQUEST_DIALOG_EDIT_EFFORT_SHOW,
    } = actions;

    /**
     * Information whether the Edit effort dialog should be displayed or not.
     * @param state
     * @param action
     * @returns {boolean}
     */
    const dialogEditEffortReducer = (state = false, action) => {
        switch (action.type) {
            case REQUEST_DIALOG_EDIT_EFFORT_SHOW:
                return true;
            case REQUEST_DIALOG_EDIT_EFFORT_CLOSE:
                return false;
            default:
                return state;
        }
    };

    /**
     * Information whether the Edit actual LTS date dialog should be displayed or not.
     * @param state
     * @param action
     * @returns {boolean}
     */
    const dialogEditActualLtsDateReducer = (state = false, action) => {
        switch (action.type) {
            case REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW:
                return true;
            case REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_CLOSE:
                return false;
            default:
                return state;
        }
    };

    return combineReducers({
        dialogEditEffort: dialogEditEffortReducer,
        dialogEditActualLtsDate: dialogEditActualLtsDateReducer,
    });
};
