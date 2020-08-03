import ReactPiwik from 'react-piwik';

/**
 * Connects to Matomo server.
 *
 * In case the URL and site ID is not defined, it fallbacks to empty string which is still accepted by
 * ReactPiwik and just doesn't connect to the server.
 *
 * If we sent NULL as url or siteId into ReactPiwik the whole UI would fail.
 */
export const connectToMatomoServer = () => new ReactPiwik({
    url: process.env.MATOMO_URL || `//${window.location.host}/matomo`,
    siteId: process.env.MATOMO_SITE_ID || '1',
    trackErrors: true,
});

/**
 * Sets the role dimension in the project
 * @param {string} roles
 */
export const trackRoleDimension = (roles) => {
    ReactPiwik.push(['setCustomDimension', 1, roles]);
};

/**
 * Tracks custom events - e.g. clicking on a button.
 * @param {string} eventCategory
 * @param {string} eventAction
 * @param {string} eventName
 */
export const trackEvent = (eventCategory, eventAction, eventName) => {
    ReactPiwik.push(['trackEvent', eventCategory, eventAction, eventName]);
};

/**
 * Tracks custom page views - e.g. clicking on a history tab in campaign planning dashboard or opening a new page.
 * @param {string} customUrl
 * @param {string} documentTitle
 */
export const trackPageView = (customUrl, documentTitle) => {
    ReactPiwik.push(['setCustomUrl', customUrl]);
    ReactPiwik.push(['setDocumentTitle', documentTitle]);
    ReactPiwik.push(['trackPageView']);
};
