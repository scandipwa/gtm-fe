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
import {
    MAX_NUMBER_FILTERS,
    MAX_NUMBER_POSITION
} from './AdditionalRoutes.config';

export const addGtmComponent = (member) => {
    const maxPosition = Math.max(
        member.map((route) => route.position).filter((num) => num <= MAX_NUMBER_FILTERS)
    );

    return [
        ...member,
        {
            component: <GoogleTagManager />,
            position: maxPosition + MAX_NUMBER_POSITION
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
