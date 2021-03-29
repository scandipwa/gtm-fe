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
import { cloneElement } from 'react';

import Event, {
    EVENT_GTM_PRODUCT_CLICK
} from '../../util/Event';

/** ProductCard */
export const ProductCard_renderCardWrapper = (args, callback, instance) => {
    const [children] = args;
    const handleClick = () => {
        const {
            currentVariantIndex: configurableVariantIndex,
            selectedFilters,
            product
        } = instance.props;

        const productToPass = Object.keys(selectedFilters).length
            ? { ...product, configurableVariantIndex }
            : product;

        Event.dispatch(EVENT_GTM_PRODUCT_CLICK, productToPass);

        instance.registerSharedElement();
    };

    const originalLink = callback(...args);

    return cloneElement(
        originalLink,
        { onClick: handleClick },
        children
    );
};

export default {
    'Component/ProductCard/Component': {
        'member-function': {
            renderCardWrapper: ProductCard_renderCardWrapper
        }
    }
};
