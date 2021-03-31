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

import Event, { EVENT_GTM_PRODUCT_CLICK } from '../../../util/Event';
import { EVENT_IMPRESSION } from '../GoogleTagManager.config';
import ProductHelper from '../utils';
import BaseEvent from './BaseEvent.event';

/**
 * Product click event
 */
export class ProductClickEvent extends BaseEvent {
    /**
     * Set delay
     *
     * @type {number}
     */
    eventHandleDelay = 0;

    /**
     * Bind click events
     */
    bindEvent() {
        Event.observer(EVENT_GTM_PRODUCT_CLICK, (product) => {
            this.handle(product);
        });
    }

    /**
     * Handle product click
     */
    handler(product) {
        const {
            position = 1,
            list = ''
        } = this.getProductFromImpression(product) || {};

        this.pushEventData({
            ecommerce: {
                click: {
                    actionField: {
                        list
                    },
                    products: [
                        {
                            ...ProductHelper.getProductData(product),
                            position
                        }
                    ]
                }
            }
        });
    }

    /**
     * Get product position in impression
     *
     * @return {*}
     * @param clickedProduct
     */
    getProductFromImpression(clickedProduct) {
        const { impressions = [] } = this.getStorage(EVENT_IMPRESSION);
        const id = ProductHelper.getSku(clickedProduct);
        const { sku } = clickedProduct;

        return impressions.find(({ id: impressionId }) => (
            impressionId === id || impressionId === sku
        ));
    }
}

export default ProductClickEvent;
