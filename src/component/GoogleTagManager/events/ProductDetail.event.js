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

import Event, { EVENT_GTM_GENERAL_INIT, EVENT_GTM_PRODUCT_DETAIL } from '../../../util/Event';
import ProductHelper from '../utils';
import BaseEvent from './BaseEvent.event';

export const SPAM_PROTECTION_TIMEOUT = 2000;
export const EVENT_EXECUTION_DELAY = 500;

/**
 * Product detail push event
 */
export class ProductDetail extends BaseEvent {
    /**
     * Last product path name
     *
     * @type {null|string}
     */
    lastPath = null;

    /**
     * Bind on product detail
     */
    bindEvent() {
        Event.observer(EVENT_GTM_PRODUCT_DETAIL, ({ product, pathname }) => {
            setTimeout(() => {
                this.handle(product, pathname);
            }, EVENT_EXECUTION_DELAY);
        });

        Event.observer(EVENT_GTM_GENERAL_INIT, () => {
            this.lastPath = null;
        });
    }

    /**
     * Handle product detail event
     *
     * @param product
     * @param pathname
     */
    handler(product, pathname) {
        const { sku, type_id } = product;
        if (this.spamProtection(SPAM_PROTECTION_TIMEOUT, sku)
            || pathname === this.lastPath
        ) {
            return;
        }

        this.lastPath = pathname;

        const productToPass = type_id === 'simple'
            ? ProductHelper.getProductData(product, true)
            : ProductHelper.getProductData(product);

        this.pushEventData({
            ecommerce: {
                detail: {
                    products: [productToPass]
                }
            }
        });
    }
}

export default ProductDetail;
