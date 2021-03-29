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

import { Field } from 'Util/Query';

export class GtmQuery {
    _getGTMConfigurationFields = () => ([
        'enabled',
        'gtm_id',
        this.getEventsField()
    ]);

    getEventsField = () => new Field('events').addFieldList(this.getEvents());

    getEvents = () => ([
        'gtm_general_init',
        'gtm_impressions',
        'gtm_product_click',
        'gtm_product_detail',
        'gtm_product_add_to_cart',
        'gtm_product_remove_from_cart',
        'gtm_purchase',
        'gtm_checkout',
        'gtm_checkout_option',
        'gtm_user_login',
        'gtm_user_register',
        'gtm_not_found',
        'gtm_category_filters',
        'gtm_additional'
    ]);

    getGTMConfiguration = () => new Field('getGtm')
        .setAlias('gtm')
        .addFieldList(this._getGTMConfigurationFields());
}

export default new GtmQuery();
