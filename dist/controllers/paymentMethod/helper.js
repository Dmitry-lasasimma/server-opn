"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentMethodsStatus = exports.filterPayementMethodFields = void 0;
/**
 * Filters PaymentMethod fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
const filterPayementMethodFields = (query) => {
    let filter = {};
    // Filter by name
    if (query.name) {
        filter = Object.assign(Object.assign({}, filter), { name: new RegExp(query.name, "i") });
    }
    if (query.status) {
        filter = Object.assign(Object.assign({}, filter), { status: query.status });
    }
    return filter;
};
exports.filterPayementMethodFields = filterPayementMethodFields;
const checkPaymentMethodsStatus = (dataset) => {
    // Check if all payment methods have their status as false
    const allFalse = dataset.paymentMethods.every((method) => method.status === false);
    return !allFalse; // Return true if not all are false, otherwise false
};
exports.checkPaymentMethodsStatus = checkPaymentMethodsStatus;
