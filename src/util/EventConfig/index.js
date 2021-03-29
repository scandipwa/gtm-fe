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

import BrowserDatabase from 'Util/BrowserDatabase';

import { EVENT_IMPRESSION } from '../../component/GoogleTagManager/GoogleTagManager.component';

/**
 * Check if push event is enabled in config
 * @param eventName
 * @returns {boolean}
 */
export const isEventEnabled = (eventName) => {
    const {
        gtm: {
            events = {}
        } = {}
    } = BrowserDatabase.getItem('config') || {};

    return !!events[mapGtmEventNames(eventName)];
};

/**
 * Map GTM event names to config event names
 * @param name
 * @returns {string}
 */
export const mapGtmEventNames = (name) => {
    switch (name) {
    case name.includes('impressions'):
        return EVENT_IMPRESSION;
    default:
        return name;
    }
};
