"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTaxInvoiceFields = void 0;
/**
 * Filters Topup fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
const filterTaxInvoiceFields = (query) => {
    let filter = {};
    // Filter by user ID
    if (query.user) {
        filter = {
            user: query.user,
        };
    }
    // Filter by email in taxInfo
    // if (query.email) {
    //     filter = {
    //         ...filter,
    //         "taxInfo.taxEmail": query.email, // Case-insensitive search
    //     };
    // }
    if (query.email) {
        filter = Object.assign(Object.assign({}, filter), { "taxInfo.taxEmail": { $regex: new RegExp(query.email, "i") } });
    }
    // Filter by status (REQUESTING, APPROVED, REJECTED, CANCELED)
    if (query.status) {
        filter = Object.assign(Object.assign({}, filter), { status: query.status });
    }
    // Filter by createdAt range
    // if (query.startDate || query.endDate) {
    //     filter = {
    //         ...filter,
    //         createdAt: {
    //             ...(query.startDate && { $gte: new Date(query.startDate) }),
    //             ...(query.endDate && { $lte: new Date(query.endDate) }),
    //         },
    //     };
    // }
    // Filter by createdAt range
    if (query.startDate || query.endDate) {
        const startDate = query.startDate ? new Date(query.startDate) : null;
        const endDate = query.endDate ? new Date(query.endDate) : null;
        if (isNaN((startDate === null || startDate === void 0 ? void 0 : startDate.getTime()) || 0) || isNaN((endDate === null || endDate === void 0 ? void 0 : endDate.getTime()) || 0)) {
            throw new Error("Invalid date format. Please provide valid startDate and endDate.");
        }
        // Add +1 day to endDate
        if (endDate) {
            endDate.setUTCDate(endDate.getUTCDate() + 1);
        }
        filter = Object.assign(Object.assign({}, filter), { createdAt: Object.assign(Object.assign({}, (startDate && { $gte: startDate })), (endDate && { $lte: endDate })) });
    }
    return filter;
};
exports.filterTaxInvoiceFields = filterTaxInvoiceFields;
