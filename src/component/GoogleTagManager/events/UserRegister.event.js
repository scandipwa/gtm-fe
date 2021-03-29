/* eslint-disable import/no-cycle */
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

import Event, { EVENT_GTM_USER_REGISTER } from '../../../util/Event';
import BaseEvent from './BaseEvent.event';

export const USER_REGISTRATION_EVENT_DELAY = 500;
export const SPAM_PROTECTION_DELAY = 100;

/**
 * On checkout
 */
export class UserRegistrationEvent extends BaseEvent {
    /**
     * Event fire delay
     *
     * @type {number}
     */
    eventHandleDelay = USER_REGISTRATION_EVENT_DELAY;

    /**
     * Bind
     */
    bindEvent() {
        Event.observer(EVENT_GTM_USER_REGISTER, () => {
            this.handle();
        });
    }

    checkDataExists() {
        return true;
    }

    /**
     * Handle
     */
    handler() {
        if (this.spamProtection(SPAM_PROTECTION_DELAY)) {
            return;
        }

        this.pushEventData({});
    }
}

export default UserRegistrationEvent;
