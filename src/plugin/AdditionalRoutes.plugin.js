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
import { BEFORE_ITEMS_TYPE } from 'Component/Router/Router.config';

import GoogleTagManager from '../component/GoogleTagManager';

export const addGtmComponent = (member, context) => {
    const maxPosition = Math.max(
        member.map((route) => route.position).filter((num) => num <= 1000)
    );

    return [
        ...member,
        {
            component: <GoogleTagManager />,
            position: maxPosition + 10
        }
    ];
};

export default {
    'Component/Router/Component': {
        'member-property': {
            [BEFORE_ITEMS_TYPE]: addGtmComponent
        }
    }
};
