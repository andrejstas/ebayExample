import {getAll as doGetAll} from 'core/server';

export default {
    /**
     * Gets the current roles of the signed user. The roles are then used to set the custom dimensions.
     */
    getMyRole: doGetAll('/rest/matomo/1.0/roles/myrole'),
};
