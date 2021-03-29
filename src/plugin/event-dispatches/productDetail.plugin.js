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
import Event, { EVENT_GTM_PRODUCT_DETAIL } from '../../util/Event';

/** ProductPage */
export const _gtmProductDetail = (instance) => {
    const { product, location: { pathname }, configurableVariantIndex } = instance.props;

    if (product && product.price && product.attributes) {
        Event.dispatch(EVENT_GTM_PRODUCT_DETAIL, {
            product: { ...product, configurableVariantIndex },
            pathname
        });
    }
};

export const componentDidMount = (args, callback, instance) => {
    const { areDetailsLoaded } = instance.props;

    if (areDetailsLoaded) {
        _gtmProductDetail(instance);
    }

    return callback(...args);
};

export const componentDidUpdate = (args, callback, instance) => {
    const [prevProps] = args;
    const shouldTriggerGtm = () => {
        const {
            areDetailsLoaded,
            location: { pathname }
        } = instance.props;

        const {
            areDetailsLoaded: prevAreDetailsLoaded,
            location: { pathname: prevPathname }
        } = prevProps;

        return areDetailsLoaded && (
            (areDetailsLoaded !== prevAreDetailsLoaded)
            || (pathname !== prevPathname)
        );
    };

    if (shouldTriggerGtm()) {
        _gtmProductDetail(instance);
    }

    return callback(...args);
};

export default {
    'Route/ProductPage/Component': {
        'member-function': {
            componentDidMount,
            componentDidUpdate
        }
    }
};
