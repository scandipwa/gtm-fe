const afterGetOrderField = (args, callback, instance) => {
    return callback(...args).addFieldList(['transaction_id']);
}

export default {
    'Query/Checkout': {
        'member-function': {
            '_getOrderField': afterGetOrderField
        }
    },
};
