/* eslint-disable max-lines */
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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CUSTOMER } from 'Store/MyAccount/MyAccount.dispatcher';
import BrowserDatabase from 'Util/BrowserDatabase';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import AddToCartEvent from './events/AddToCart.event';
import CheckoutEvent from './events/Checkout.event';
import CheckoutOptionEvent from './events/CheckoutOption.event';
import General from './events/General.event';
import Impression from './events/Impression.event';
import ProductClickEvent from './events/ProductClick.event';
import ProductDetailEvent from './events/ProductDetail.event';
import PurchaseEvent from './events/Purchase.event';
import RemoveFromCartEvent from './events/RemoveFromCart.event';
import UserLoginEvent from './events/UserLogin.event';
import UserRegisterEvent from './events/UserRegister.event';
import {
    DATA_LAYER_NAME,
    EVENT_ADD_TO_CART,
    EVENT_CHECKOUT,
    EVENT_CHECKOUT_OPTION,
    EVENT_GENERAL,
    EVENT_IMPRESSION,
    EVENT_PRODUCT_CLICK,
    EVENT_PRODUCT_DETAIL,
    EVENT_PURCHASE,
    EVENT_REMOVE_FROM_CART,
    EVENT_USER_LOGIN,
    EVENT_USER_REGISTER,
    GROUPED_PRODUCTS_GUEST,
    GROUPED_PRODUCTS_PREFIX,
    GTM_INJECTION_TIMEOUT
} from './GoogleTagManager.config';
import Scripts from './Scripts';

/** @namespace Gtm/Component/GoogleTagManager/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    gtm: state.ConfigReducer.gtm,
    state
});

/** @namespace Gtm/Component/GoogleTagManager/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    dispatch
});

/**
 * Google tag manager wrapper
 * This should have 1 instance to avoid multiple initializations
 * @namespace Gtm/Component/GoogleTagManager/Container/GoogleTagManagerContainer */
export class GoogleTagManagerContainer extends PureComponent {
    static propTypes = {
        gtm: PropTypes.shape(),
        // eslint-disable-next-line react/no-unused-prop-types
        state: PropTypes.shape(),
        // eslint-disable-next-line react/no-unused-prop-types
        dispatch: PropTypes.func
    };

    static defaultProps = {
        gtm: {
            enabled: false,
            gtm_id: ''
        },
        state: {},
        dispatch: () => {}
    };

    /**
     * Event list used in GTM
     * All used events should be registered in this data mapping
     * TODO: 404 page, categoryFilter, additional events
     *
     * @type {{[p: string]: General|Purchase|CheckoutEvent|OrderData|Impression|AddToCartEvent|ProductClickEvent|ProductDetail|CheckoutOptionEvent|RemoveFromCartEvent}}
     */
    static eventList = {
        [EVENT_GENERAL]: General,
        [EVENT_PURCHASE]: PurchaseEvent,
        [EVENT_CHECKOUT]: CheckoutEvent,
        [EVENT_CHECKOUT_OPTION]: CheckoutOptionEvent,
        [EVENT_IMPRESSION]: Impression,
        [EVENT_ADD_TO_CART]: AddToCartEvent,
        [EVENT_PRODUCT_CLICK]: ProductClickEvent,
        [EVENT_PRODUCT_DETAIL]: ProductDetailEvent,
        [EVENT_REMOVE_FROM_CART]: RemoveFromCartEvent,
        [EVENT_USER_REGISTER]: UserRegisterEvent,
        [EVENT_USER_LOGIN]: UserLoginEvent
    };

    /**
     * GoogleTagManager instance
     *
     * @type {GoogleTagManager}
     */
    static instance = null;

    /**
     * Push data to GTM
     *
     * @param event
     * @param data
     */
    static pushData(event, data) {
        if (this.getInstance()) {
            this.getInstance().processDataPush(event, data);
        }
    }

    /**
     * Append Data Layer with new data
     *
     * @param data
     */
    static appendData(data) {
        if (this.getInstance()) {
            this.getInstance().addDataLayer(data);
        }
    }

    /**
     * Get event by name
     *
     * @param name
     * @return {null|BaseEvent}
     */
    static getEvent(name) {
        if (this.getInstance()) {
            return this.getInstance().getEvent(name);
        }

        return null;
    }

    /**
     * Get GoogleTagManager Instance
     *
     * @return {GoogleTagManager}
     */
    static getInstance() {
        return this.instance;
    }

    /**
     * Is GoogleTagManager enabled
     *
     * @type {boolean}
     */
    enabled = false;

    /**
     * Prepared Data Layer
     *
     * @type {{}}
     */
    currentDataLayer = {};

    /**
     * Data layer name
     *
     * @type {string}
     */
    currentDataLayerName = DATA_LAYER_NAME;

    /**
     * groupedProducts
     */
    groupedProductsStorageName = GROUPED_PRODUCTS_GUEST;

    /**
     * Event data object
     *
     * @type {{}}
     */
    events = {};

    /**
     * Data storage for event data
     *
     * @type {{}}
     */
    eventDataStorage = {};

    /**
     * Grouped product storage
     */
    groupedProducts = {};

    /**
     * Did mount
     */
    componentDidMount() {
        this.initialize();
    }

    /**
     * If props is updated
     */
    componentDidUpdate() {
        this.initialize();
    }

    /**
     * Unregister component
     */
    componentWillUnmount() {
        this.destruct();
    }

    /**
     * Get event by name
     *
     * @param name
     * @return {null|*}
     */
    getEvent(name) {
        if (Object.keys(this.events).indexOf(name) >= 0) {
            return this.events[name];
        }

        return null;
    }

    /**
     * Set event storage
     *
     * @param event
     * @param data
     */
    setEventStorage(event, data) {
        this.eventDataStorage[event] = data;
    }

    /**
     * Set grouped products to storage
     *
     * @param groupedProducts
     */
    setGroupedProducts(groupedProducts) {
        BrowserDatabase.setItem(groupedProducts, this.groupedProductsStorageName, ONE_MONTH_IN_SECONDS);
        this.groupedProducts = groupedProducts;
    }

    /**
     * Get reference to grouped products
     */
    getGroupedProducts() {
        return this.groupedProducts;
    }

    /**
     * Get reference to the storage
     *
     * @param event
     * @return {*}
     */
    getEventDataStorage(event) {
        if (typeof this.eventDataStorage[event] === 'undefined') {
            this.resetEventDataStorage(event);
        }

        return this.eventDataStorage[event];
    }

    /**
     * Reset storage data
     *
     * @param event
     */
    resetEventDataStorage(event) {
        this.eventDataStorage[event] = {};
    }

    updateGroupedProducts() {
        this.groupedProducts = BrowserDatabase.getItem(this.groupedProductsStorageName) || {};
    }

    updateGroupedProductsStorageName(name) {
        this.groupedProductsStorageName = name
            ? `${ GROUPED_PRODUCTS_PREFIX }${ name }`
            : GROUPED_PRODUCTS_GUEST;

        this.updateGroupedProducts();
    }

    /**
     * Register GTM event handlers
     */
    registerEvents() {
        this.events = Object.entries(GoogleTagManagerContainer.eventList).reduce((acc, [name, Event]) => {
            acc[name] = new Event(name, this);
            acc[name].bindEvent();

            return acc;
        }, {});
    }

    /**
     * Send event and data to the GoogleTagManager
     *
     * @param event
     * @param data
     */
    processDataPush(event, data) {
        if (this.enabled) {
            this.addDataLayer(data);

            if (this.debug) {
                // eslint-disable-next-line no-console
                console.log(event, data);
            }

            window[this.currentDataLayerName].push({
                event,
                ...this.currentDataLayer
            });

            this.currentDataLayer = {};
        }
    }

    /**
     * Unregister/ destruct all parts related to the gtm
     */
    destruct() {
        Object.values(this.events).forEach((event, name) => {
            event.destruct();
            // eslint-disable-next-line fp/no-delete
            delete this.events[name];
        });

        this.events = {};
    }

    /**
     * Append current DataLayer with new nata
     *
     * @param data
     */
    addDataLayer(data) {
        if (this.enabled) {
            this.currentDataLayer = { ...this.currentDataLayer, ...data };
        }
    }

    /**
     * Initialize GTM
     */
    initialize() {
        const { gtm: { enabled } } = this.props;

        if (this.enabled || !enabled || GoogleTagManagerContainer.getInstance()) {
            return;
        }

        this.enabled = true;
        GoogleTagManagerContainer.instance = this;

        this.initGroupedProducts();
        this.injectGTMScripts();
        this.registerEvents();
    }

    /**
     * Insert GTM scripts to the document
     */
    injectGTMScripts() {
        const { gtm: { gtm_id: id } } = this.props;

        const script = document.createElement('script');
        script.innerHTML = Scripts.getScript(
            { id, dataLayerName: this.currentDataLayerName }
        );

        setTimeout(() => {
            document.head.insertBefore(script, document.head.childNodes[0]);
        }, GTM_INJECTION_TIMEOUT);
        window[this.currentDataLayerName] = window[this.currentDataLayerName] || [];
    }

    /**
     * Initialize grouped products
     */
    initGroupedProducts() {
        const customer = BrowserDatabase.getItem(CUSTOMER);

        this.updateGroupedProductsStorageName(customer && customer.id);

        this.groupedProducts = BrowserDatabase.getItem(this.groupedProductsStorageName) || {};
    }

    /**
     * Skip render
     *
     * @return {null}
     */
    render() {
        return null;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoogleTagManagerContainer));
