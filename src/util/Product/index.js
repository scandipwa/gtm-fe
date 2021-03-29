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
export const getConfigurableParametersFromFilters = (product, selectedFilters) => {
    const { variants = [] } = product;
    const filterKeys = Object.keys(selectedFilters);

    if (filterKeys.length < 0) {
        return { indexes: [], parameters: {} };
    }

    const indexes = getVariantsIndexes(variants, selectedFilters);
    const [index] = indexes;

    if (!variants[index]) {
        return { indexes: [], parameters: {} };
    }
    const { attributes } = variants[index];

    const parameters = Object.entries(attributes)
        .reduce((parameters, [key, { attribute_value }]) => {
            if (filterKeys.includes(key)) {
                return { ...parameters, [key]: attribute_value };
            }

            return parameters;
        }, {});

    return { indexes, index, parameters };
};

export const getCurrentVariantIndexFromFilters = (product, selectedFilters) => {
    if (!Object.keys(selectedFilters).length) {
        return -1;
    }

    const { index } = getConfigurableParametersFromFilters(product, selectedFilters);
    return index >= 0 ? index : -1;
};
