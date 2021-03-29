import {
    PDP,
    CART,
    MENU,
    SEARCH,
    CATEGORY,
    CHECKOUT,
    CMS_PAGE,
    HOME_PAGE,
    CUSTOMER_ACCOUNT
} from 'Component/Header/Header.config';

export const URL_REWRITE = 'url-rewrite';
export const PASSWORD_CHANGE = 'password-change';
export const CONFIRM_ACCOUNT = 'confirm_account';

import withGTM from '../component/GoogleTagManager/withGTM.hoc';

const wrapperFunction = (route) => (args, callback) => withGTM(callback(...args), route);

export default {
    'Route/HomePage/Container': { 'member-function': { render: wrapperFunction(HOME_PAGE) } },
    'Route/CategoryPage/Container': { 'member-function': { render: wrapperFunction(CATEGORY) } },
    'Route/ProductPage/Container': { 'member-function': { render: wrapperFunction(PDP) } },
    'Route/SearchPage/Container': { 'member-function': { render: wrapperFunction(SEARCH) } },
    'Route/CmsPage/Container': { 'member-function': { render: wrapperFunction(CMS_PAGE) } },
    'Route/CartPage/Container': { 'member-function': { render: wrapperFunction(CART) } },
    'Route/Checkout/Container': { 'member-function': { render: wrapperFunction(CHECKOUT) } },
    'Route/PasswordChangePage/Container': { 'member-function': { render: wrapperFunction(PASSWORD_CHANGE) } },
    'Route/ConfirmAccountPage/Container': { 'member-function': { render: wrapperFunction(CONFIRM_ACCOUNT) } },
    'Route/MyAccount/Container': { 'member-function': { render: wrapperFunction(CUSTOMER_ACCOUNT) } },
    'Route/MenuPage/Container': { 'member-function': { render: wrapperFunction(MENU) } },
    'Route/UrlRewrites/Container': { 'member-function': { render: wrapperFunction(URL_REWRITE) } }
};
