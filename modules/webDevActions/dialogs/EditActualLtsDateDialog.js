import React from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form/immutable';
import {compose} from 'recompose';

import {Dialog, Msg} from 'containers';
import {MsFlexLayout, MsFormRow, MsFormSection, MsLoadingOverlay, MsSpacingLayout} from 'planning-components';
import {Field, InRowLayout, InputDatePicker} from 'containers/form';
import fetching from 'core/fetching';
import {REQUEST_EDIT_ACTUAL_DATE_FORM} from '../constants';

export default (module) => {
    const mapStateToProps = (state) => ({
        show: module.isShowRequestEditActualLtsDateDialog(state),
        isSubmitting: fetching.isFetching(state, REQUEST_EDIT_ACTUAL_DATE_FORM),
    });

    const mapDispatchToProps = (dispatch) => ({
        onClose: () => dispatch(module.hideDialogRequestEditActualLtsDate()),
    });

    const mergeProps = ({show, isSubmitting}, {onClose}, {handleSubmit}) => ({
        show,
        onClose,
        onSubmit: handleSubmit,
        titleMsg: 'planning.webDev.actions.editActualLtsDate',
        submitMsg: 'common.button.submit',
        cancelMsg: 'common.button.cancel',
        at: 'edit-actual-lts-date-dialog',
        size: 'large',
        children: (
            <MsLoadingOverlay isLoading={isSubmitting}>
                <form>
                    <MsFormSection borderBottom="none">
                        <MsFormRow
                            key="preferredLtsDate"
                            label={<Msg msg="planning.webDev.actions.editActualLtsDate.preferredLtsDate" />}
                            control={
                                <MsFlexLayout alignItems="baseline">
                                    <Field
                                        name="preferredLtsDate"
                                        component={InputDatePicker}
                                        layout={InRowLayout}
                                        size="medium"
                                        disabled
                                        at="preferredLtsDate"
                                    />
                                </MsFlexLayout>
                            }
                            at={'preferred-lts-date'}
                        />
                        <MsFormRow
                            key="actualLtsDate"
                            label={<Msg msg="planning.webDev.actions.editActualLtsDate.actualLtsDate" />}
                            control={
                                <MsFlexLayout alignItems="baseline">
                                    <Field
                                        key="currentActualLtsDate"
                                        name="currentActualLtsDate"
                                        component={InputDatePicker}
                                        layout={InRowLayout}
                                        size="medium"
                                        disabled
                                        at="actualLtsDate"
                                    />
                                    <MsSpacingLayout marginLeft="medium" marginRight="medium">/</MsSpacingLayout>
                                    <Field
                                        key="actualLtsDate"
                                        name="actualLtsDate"
                                        component={InputDatePicker}
                                        layout={InRowLayout}
                                        size="medium"
                                        at="newActualLtsDate"
                                    />
                                </MsFlexLayout>
                            }
                            at={'team-'}
                        />
                    </MsFormSection>
                </form>
            </MsLoadingOverlay>
        ),
        disabled: isSubmitting,
    });

    return compose(
        reduxForm({
            form: REQUEST_EDIT_ACTUAL_DATE_FORM,
            onSubmit: (values, dispatch) => dispatch(
                module.submitChannelEditActualLtsDateDialog(
                    values.get('actualLtsDate'),
                ),
            ),
        }),
        connect(mapStateToProps, mapDispatchToProps, mergeProps),
    )(Dialog);
};
