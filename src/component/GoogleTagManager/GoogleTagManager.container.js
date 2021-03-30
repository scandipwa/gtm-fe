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

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import GoogleTagManager from './GoogleTagManager.component';

export const mapStateToProps = (state) => ({
    gtm: state.ConfigReducer.gtm,
    state
});

export const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoogleTagManager));
