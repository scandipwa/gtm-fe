/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */
import Event, {
    EVENT_GTM_USER_LOGIN,
    EVENT_GTM_USER_REGISTER
} from '../../util/Event';

export const createAccount = (args, callback, instance) => callback(...args)
    .then((signInPromise) => {
        Event.dispatch(EVENT_GTM_USER_REGISTER);

        return signInPromise;
    });

export const signIn = (args, callback, instance) => callback(...args)
    .then((result) => {
        Event.dispatch(EVENT_GTM_USER_LOGIN);

        return result;
    });

export default {
    'Store/MyAccount/Dispatcher': {
        'member-function': {
            createAccount,
            signIn
        }
    }
};
