"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTopupId = exports.filterTopupFields = void 0;
/**
 * Filters Topup fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
const filterTopupFields = (query) => {
    let filter = {};
    // Filter by packageName
    if (query.packageName) {
        filter = Object.assign(Object.assign({}, filter), { packageName: new RegExp(query.packageName, "i") });
    }
    // Filter by type (NORMAL or PROMOTION)
    if (query.type) {
        filter = Object.assign(Object.assign({}, filter), { type: query.type });
    }
    // Filter by price range
    if (query.minPrice || query.maxPrice) {
        filter = Object.assign(Object.assign({}, filter), { price: Object.assign(Object.assign({}, (query.minPrice && { $gte: Number(query.minPrice) })), (query.maxPrice && { $lte: Number(query.maxPrice) })) });
    }
    // Filter by credit range
    if (query.minCredit || query.maxCredit) {
        filter = Object.assign(Object.assign({}, filter), { credit: Object.assign(Object.assign({}, (query.minCredit && { $gte: Number(query.minCredit) })), (query.maxCredit && { $lte: Number(query.maxCredit) })) });
    }
    // Filter by createdAt range
    if (query.startDate || query.endDate) {
        filter = Object.assign(Object.assign({}, filter), { createdAt: Object.assign(Object.assign({}, (query.startDate && { $gte: new Date(query.startDate) })), (query.endDate && { $lte: new Date(query.endDate) })) });
    }
    if (query.isAvailable) {
        filter = Object.assign(Object.assign({}, filter), { isAvailable: query.isAvailable });
    }
    return filter;
};
exports.filterTopupFields = filterTopupFields;
const generateTopupId = () => {
    const now = new Date();
    // Extract date components
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (1-12), padded to 2 digits
    const day = String(now.getDate()).padStart(2, '0'); // Day, padded to 2 digits
    const hours = String(now.getHours()).padStart(2, '0'); // Hours, padded to 2 digits
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Minutes, padded to 2 digits
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds, padded to 2 digits
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Milliseconds, padded to 3 digits
    // Combine components to create a unique ID
    return `${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};
exports.generateTopupId = generateTopupId;
