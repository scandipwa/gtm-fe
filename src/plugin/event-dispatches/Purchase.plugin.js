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
import Event, { EVENT_GTM_PURCHASE } from '../../util/Event';

export const PLACE_ORDER_MUTATION = 's_placeOrder';

export class PurchasePlugin {
    transactionId = 0;

    setDetailsStep = (args, callback, instance) => {
        const [orderID] = args;
        const {
            totals: { items = [] }
        } = instance.props;

        const { paymentTotals: totals } = instance.state;

        Event.dispatch(
            EVENT_GTM_PURCHASE,
            { orderID, transactionID: this.transactionId, totals: { ...totals, items } }
        );

        return callback(...args);
    };

    fetchMutation = (args, callback, instance) => {
        const {
            rawMutation: name = ''
        } = args;

        const response = callback(...args);

        if (name === PLACE_ORDER_MUTATION) {
            return response.then(
                (result) => {
                    const { placeOrder: { order: { transaction_id } } } = result;
                    this.transactionId = transaction_id;
                    return result;
                }
            );
        }

        return response;
    };
}

const {
    setDetailsStep,
    fetchMutation
} = new PurchasePlugin();

export default {
    'Route/Checkout/Container': {
        'member-function': {
            setDetailsStep
        }
    },
    'Util/Request/fetchMutation': {
        function: fetchMutation
    }
};
