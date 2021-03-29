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
    EVENT_GTM_PRODUCT_ADD_TO_CART
} from '../../util/Event';

export const aroundAfterAddToCart = (args, callback, instance) => {
    const {
        product,
        product: { type_id, variants },
        quantity,
        configurableVariantIndex,
        groupedProductQuantity
    } = instance.props;

    if (type_id === 'grouped') {
        Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
            product: {
                ...product,
                quantities: groupedProductQuantity
            },
            isGrouped: true
        });
    } else {
        const productToAdd = variants
            ? { ...product, configurableVariantIndex }
            : product;

        Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
            product: productToAdd,
            quantity,
            configurableVariantIndex
        });
    }

    return callback(...args);
};

export default {
    'Component/AddToCart/Container': {
        'member-function': {
            afterAddToCart: aroundAfterAddToCart
        }
    }
};
