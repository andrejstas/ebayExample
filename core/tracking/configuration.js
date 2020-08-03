import {
    SET_START_DATE_ON_ALL_CHANNELS as PLANNING_REQUEST_SET_START_DATE_ON_ALL_CHANNELS,
    SUBMIT_FORM as PLANNING_REQUEST_SUBMIT_FORM,
    CLICK_ON_ADD_CHANNEL_BUTTON as PLANNING_REQUEST_CLICK_ON_ADD_CHANNEL_BUTTON,
    SELECT_CHANNEL as PLANNING_REQUEST_SELECT_CHANNEL,
} from 'modules/planning/requestForms/campaignRequest/actions';
import createActionsChartModule from 'modules/planning/dashboards/chart/actions';
import {actionPrefix as actionPrefixCampaignDashboard} from 'modules/planning/dashboards/campaignPlanningDashboard/chartModule';
import {
    SELECT_CAMPAIGN as CAMPAIGN_PLANNING_DASHBOARD_SELECT_CAMPAIGN,
    EXPORT_EXCEL_ALL_FIELDS as CAMPAIGN_PLANNING_DASHBOARD_EXPORT_EXCEL_ALL_FIELDS,
    CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR as CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR,
} from 'modules/planning/dashboards/campaignPlanningDashboard/actions';
import {
    SHOW_DIALOG as EMPLOYEE_DASHBOARD_CLICKED_ON_ADD_EMPLOYEE_BUTTON,
} from 'modules/teamAdministration/employeeDashboard/addEmployee/actions';
import campaignRequest from 'modules/planning/requestForms/campaignRequest';
import {TRANSITION} from '../router/actions';
import {REDUX_FORM_CHANGE} from './constants';

const CAMPAIGN_PLANNING_DASHBOARD_CLICK_ON_ADD_TEAM_BUTTON = createActionsChartModule(actionPrefixCampaignDashboard).CLICK_ON_ADD_TEAM_BUTTON;

/**
 * This tracking is based on watching redux actions, not on watching "click" events.
 *
 * List below contains all tracked actions that are in our interest.
 *
 * It works by catching all actions in "core/tracking/saga" and then
 * comparing their content to types of tracked actions and to the properties of the tracked actions.
 *
 * If the caught action matches the "requiredPropertiesInAction" definition there are three possible outcomes:
 * - firing an event to Matomo (if "eventDefinition" is defined)
 * - firing a page view to Matomo (if "pageViewDefinition" is defined)
 * - both
 *
 * NOTES:
 *
 * Make sure to not duplicate action types in the list. If you need to track two checkboxes (which are caught by
 * REDUX_FORM_CHANGE action type, add it as another object into the array that belongs to
 * REDUX_FORM_CHANGE.
 * You can find the example in CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN - there are four objects defined in an array
 * that belongs to CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN;
 */
export const trackedReduxActions = {
    // Clicking on the Fast Track checkbox in Campaign Request
    [REDUX_FORM_CHANGE]: [
        {
            requiredPropertiesInAction: {
                meta: {
                    form: campaignRequest.NAME,
                    field: 'fastTrack',
                },
                payload: true,
            },
            eventDefinition: {
                eventCategory: 'CRF',
                eventAction: 'clicked',
                eventName: 'Fast_Track',
            },
        },
    ],
    // Clicking on DBM channel in Campaign request when dropdown with all channels are displayed
    [PLANNING_REQUEST_SELECT_CHANNEL]: [
        {
            requiredPropertiesInAction: {
                channel: 'dbmChannel',
            },
            eventDefinition: {
                eventCategory: 'CRF',
                eventAction: 'selected',
                eventName: 'DBM_Channel',
            },
        },
    ],
    // Clicking on "Apply to all" link next to dates in Campaign Request
    [PLANNING_REQUEST_SET_START_DATE_ON_ALL_CHANNELS]: [
        {
            requiredPropertiesInAction: {
                type: PLANNING_REQUEST_SET_START_DATE_ON_ALL_CHANNELS,
            },
            eventDefinition: {
                eventCategory: 'CRF',
                eventAction: 'clicked',
                eventName: 'Apply_to_all',
            },
        },
    ],
    // Submitting a form in Campaign request
    [PLANNING_REQUEST_SUBMIT_FORM]: [
        {
            requiredPropertiesInAction: {
                type: PLANNING_REQUEST_SUBMIT_FORM,
            },
            eventDefinition: {
                eventCategory: 'CRF',
                eventAction: 'clicked',
                eventName: 'Submit_CR',
            },
        },
    ],
    // Clicking on the "Add Channel" in the Campaign request
    [PLANNING_REQUEST_CLICK_ON_ADD_CHANNEL_BUTTON]: [
        {
            requiredPropertiesInAction: {
                type: PLANNING_REQUEST_CLICK_ON_ADD_CHANNEL_BUTTON,
            },
            eventDefinition: {
                eventCategory: 'CRF',
                eventAction: 'clicked',
                eventName: 'Add_Channel',
            },
            pageViewDefinition: {
                customUrl: '/add-channel',
                documentTitle: '(add channel)',
            },
        },
    ],
    // Selecting a certain campaign in campaign planning dashboard to be displayed in the right sidebar
    [CAMPAIGN_PLANNING_DASHBOARD_SELECT_CAMPAIGN]: [
        {
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_SELECT_CAMPAIGN,
            },
            eventDefinition: {
                eventCategory: 'PD',
                eventAction: 'clicked',
                eventName: 'Campaign_Detail',
            },
        },
    ],
    // Exporting a certain campaign in campaign planning dashboard
    [CAMPAIGN_PLANNING_DASHBOARD_EXPORT_EXCEL_ALL_FIELDS]: [
        {
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_EXPORT_EXCEL_ALL_FIELDS,
            },
            eventDefinition: {
                eventCategory: 'PD',
                eventAction: 'selected',
                eventName: 'Export_Excel',
            },
        },
    ],
    // Opening "Add Team" selectbox in campaign planning dashboard
    [CAMPAIGN_PLANNING_DASHBOARD_CLICK_ON_ADD_TEAM_BUTTON]: [
        {
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_CLICK_ON_ADD_TEAM_BUTTON,
            },
            eventDefinition: {
                eventCategory: 'PD',
                eventAction: 'clicked',
                eventName: 'Add_Team',
            },
        },
    ],
    // Opening a campaign request detail from the campaign planning dashboard
    [TRANSITION]: [
        {
            requiredPropertiesInAction: {
                route: 'planning-request',
            },
            eventDefinition: {
                eventCategory: 'PD',
                eventAction: 'clicked',
                eventName: 'Campaign_View',
            },
        },
    ],
    // Clicking on the "Add employee" button in the team administration
    [EMPLOYEE_DASHBOARD_CLICKED_ON_ADD_EMPLOYEE_BUTTON]: [
        {
            requiredPropertiesInAction: {
                type: EMPLOYEE_DASHBOARD_CLICKED_ON_ADD_EMPLOYEE_BUTTON,
            },
            eventDefinition: {
                eventCategory: 'TA',
                eventAction: 'clicked',
                eventName: 'Add_Employee',
            },
        },
    ],
    [CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR]: [
        {
            // Clicking on the detail tab in the right sidebar in the campaign planning dashboard
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR,
                tabId: 'detail',
            },
            pageViewDefinition: {
                customUrl: '/campaign_detail',
                documentTitle: '(campaign detail)',
            },
        },
        {
            // Clicking on the comments tab in the right sidebar in the campaign planning dashboard
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR,
                tabId: 'comments',
            },
            pageViewDefinition: {
                customUrl: '/comments',
                documentTitle: '(comments)',
            },
        },
        {
            // Clicking on the history tab in the right sidebar in the campaign planning dashboard
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR,
                tabId: 'history',
            },
            pageViewDefinition: {
                customUrl: '/history',
                documentTitle: '(history)',
            },
        },
        {
            // Clicking on the change request tab in the right sidebar in the campaign planning dashboard
            requiredPropertiesInAction: {
                type: CAMPAIGN_PLANNING_DASHBOARD_CHANGE_SELECTED_TAB_OR_CAMPAIGN_IN_RIGHT_SIDEBAR,
                tabId: 'change-request',
            },
            pageViewDefinition: {
                customUrl: '/change-request',
                documentTitle: '(change request)',
            },
        },
    ],
};

export const trackedReduxActionTypes = Object.keys(trackedReduxActions);
