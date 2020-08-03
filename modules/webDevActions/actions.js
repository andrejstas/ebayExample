import confirm from 'core/confirmation';

export default (actionPrefix) => {
    const REQUEST_DIALOG_EDIT_EFFORT_SHOW = `${actionPrefix}/REQUEST_DIALOG_EDIT_EFFORT_SHOW`;
    const REQUEST_DIALOG_EDIT_EFFORT_CLOSE = `${actionPrefix}/REQUEST_DIALOG_EDIT_EFFORT_CLOSE`;
    const REQUEST_DIALOG_EDIT_EFFORT_SUBMIT = `${actionPrefix}/REQUEST_DIALOG_EDIT_EFFORT_SUBMIT`;
    const REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW = `${actionPrefix}/REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW`;
    const REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_CLOSE = `${actionPrefix}/REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_CLOSE`;
    const REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SUBMIT = `${actionPrefix}/REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SUBMIT`;

    return {
        REQUEST_DIALOG_EDIT_EFFORT_SHOW,
        REQUEST_DIALOG_EDIT_EFFORT_CLOSE,
        REQUEST_DIALOG_EDIT_EFFORT_SUBMIT,
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW,
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_CLOSE,
        REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SUBMIT,

        /**
         * Displays cancel request dialog.
         */
        showCancelRequestDialog: (onConfirm) => confirm.showDialog(
            'planning.webDev.actions.cancel.request.dialog.title',
            'planning.webDev.actions.cancel.request.dialog.body',
            {
                onConfirm,
                dialogType: confirm.STANDARD,
                confirmMsg: 'common.yes',
                cancelMsg: 'common.no',
            },
        ),

        /**
         * Displays edit effort dialog of a request.
         */
        showDialogRequestEditEffort: () => ({
            type: REQUEST_DIALOG_EDIT_EFFORT_SHOW,
        }),

        /**
         * Closes the edit effort dialog.
         */
        hideDialogRequestEditEffort: () => ({
            type: REQUEST_DIALOG_EDIT_EFFORT_CLOSE,
        }),

        /**
         * Submits the edit effort form.
         */
        submitRequestEditEffortDialog: (values) => ({
            type: REQUEST_DIALOG_EDIT_EFFORT_SUBMIT,
            values,
        }),

        /**
         * Displays the edit actual LTS date dialog of a request.
         */
        showDialogRequestEditActualLtsDate: () => ({
            type: REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SHOW,
        }),

        /**
         * Closes the edit actual LTS date dialog of a request.
         */
        hideDialogRequestEditActualLtsDate: () => ({
            type: REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_CLOSE,
        }),

        /**
         * Submits the edit actual LTS date dialog of a request.
         */
        submitChannelEditActualLtsDateDialog: (values) => ({
            type: REQUEST_DIALOG_EDIT_ACTUAL_LTS_DATE_SUBMIT,
            values,
        }),
    };
};
