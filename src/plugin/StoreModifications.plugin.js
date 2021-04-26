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
import { UPDATE_CONFIG } from 'Store/Config/Config.action';
import BrowserDatabase from 'Util/BrowserDatabase';

import { GROUPED_PRODUCTS_GUEST } from '../component/GoogleTagManager/GoogleTagManager.config';
import GoogleTagManagerContainer from '../component/GoogleTagManager/GoogleTagManager.container';
import ProductHelper from '../component/GoogleTagManager/utils/Product';
import GtmQuery from '../query/Gtm.query';

export const handle_syncCartWithBEError = (args, callback) => callback(...args)
    .then(
        (result) => {
            GoogleTagManagerContainer.getInstance().setGroupedProducts({});
            return result;
        }
    );

export const addGtmConfigQuery = (args, callback) => {
    const original = callback(...args);
    return [
        ...(Array.isArray(original) ? original : [original]),
        GtmQuery.getGTMConfiguration()
    ];
};

export const addGtmToConfigReducerInitialState = (args, callback) => {
    const { gtm } = BrowserDatabase.getItem('config') || { gtm: {} };

    return {
        ...callback(...args),
        gtm
    };
};

export const addGtmToConfigUpdate = (args, callback, context) => {
    const [, action] = args;
    const originalUpdatedState = callback.apply(context, args);

    if (!action) {
        return originalUpdatedState;
    }

    const { config: { gtm } = {}, type } = action;

    if (type !== UPDATE_CONFIG) {
        return originalUpdatedState;
    }

    return {
        ...originalUpdatedState,
        gtm
    };
};

export const afterRequestCustomerData = (args, callback) => {
    const gtm = GoogleTagManagerContainer.getInstance();

    /** transfer grouped products data from guest to logged in user */
    const transferGroupedProductsData = (id) => {
        if (gtm.groupedProductsStorageName !== GROUPED_PRODUCTS_GUEST) {
            return;
        }

        const guestGroupedProducts = gtm.getGroupedProducts();
        gtm.setGroupedProducts({});
        gtm.updateGroupedProductsStorageName(id);

        const userGroupedProducts = gtm.getGroupedProducts();
        const result = ProductHelper.mergeGroupedProducts(guestGroupedProducts, userGroupedProducts);

        gtm.setGroupedProducts(result);
    };

    return callback(...args)
        .then((result) => {
            transferGroupedProductsData(customer.id);
            gtm.updateGroupedProductsStorageName(customer.id);

            return result;
        });
};

export default {
    'Store/Cart/Dispatcher': {
        'member-function': {
            handle_syncCartWithBEError
        }
    },
    'Store/Config/Dispatcher': {
        'member-function': {
            prepareRequest: addGtmConfigQuery
        }
    },
    'Store/Config/Reducer/getInitialState': {
        function: addGtmToConfigReducerInitialState
    },
    'Store/Config/Reducer': {
        function: addGtmToConfigUpdate
    },
    'Store/MyAccount/Dispatcher': {
        'member-function': {
            requestCustomerData: afterRequestCustomerData
        }
    }
};
