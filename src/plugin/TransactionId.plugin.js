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
export const afterGetOrderField = (args, callback) => callback(...args).addFieldList(['transaction_id']);

export default {
    'Query/Checkout': {
        'member-function': {
            _getOrderField: afterGetOrderField
        }
    }
};
