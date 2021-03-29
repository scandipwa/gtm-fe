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
import { BILLING_STEP } from 'Route/Checkout/Checkout.config';

import { CHECKOUT_EVENT_DELAY } from '../../component/GoogleTagManager/events/Checkout.event';
import Event, {
    EVENT_GTM_CHECKOUT
} from '../../util/Event';

export const GTM_CART_PAGE_STEP = 1;
export const GTM_SHIPPING_STEP = 2;
export const GTM_BILLING_STEP = 3;

export const componentDidMount = (args, callback, instance) => {
    const { totals = {} } = instance.props;
    const { checkoutStep } = instance.state || {};

    setTimeout(
        () => Event.dispatch(EVENT_GTM_CHECKOUT, {
            totals,
            step: checkoutStep ? GTM_SHIPPING_STEP : GTM_CART_PAGE_STEP
        }),
        CHECKOUT_EVENT_DELAY
    );

    return callback(...args);
};

export const componentDidUpdate = (args, callback, instance) => {
    const [, prevState] = args;

    const { checkoutStep, isLoading } = instance.state;
    const { checkoutStep: prevCheckoutStep } = prevState;

    if (
        !isLoading
        && checkoutStep === BILLING_STEP
        && checkoutStep !== prevCheckoutStep
    ) {
        const { totals } = instance.props;
        Event.dispatch(EVENT_GTM_CHECKOUT, {
            totals,
            step: GTM_BILLING_STEP
        });
    }

    return callback(...args);
};

export default {
    'Route/Checkout/Container': {
        'member-function': {
            componentDidMount,
            componentDidUpdate
        }
    },
    'Route/CartPage/Container': {
        'member-function': {
            componentDidMount
        }
    }
};
