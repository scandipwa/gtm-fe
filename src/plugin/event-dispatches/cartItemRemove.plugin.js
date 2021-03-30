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
    EVENT_GTM_PRODUCT_REMOVE_FROM_CART
} from '../../util/Event';

// TODO split
export class RemoveItemPlugin {
    handleRemoveItem = (args, callback, instance) => {
        callback(...args);
        const { item } = instance.props;
        const { qty: quantity } = item;

        this.handleRemoveState = {
            item,
            quantity
        };
    };

    removeProductFromCart = (args, callback) => {
        const { item, quantity } = this.handleRemoveState;

        return callback(...args)
            .then(
                (result) => {
                    Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_CART, {
                        item,
                        quantity
                    });

                    return result;
                }
            );
    };
}

const {
    handleRemoveItem,
    removeProductFromCart
} = new RemoveItemPlugin();

export default {
    'Component/CartItem/Container': {
        'member-function': {
            handleRemoveItem
        }
    },
    'Store/Cart/Dispatcher': {
        'member-function': {
            removeProductFromCart
        }
    }
};
