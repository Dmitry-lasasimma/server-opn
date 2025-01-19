import mongoose from "mongoose";
interface TaxInvoiceFilter {
    user?: mongoose.Types.ObjectId;
    status?: string;
    createdAt?: { $gte?: Date; $lte?: Date };
    email?: string;
    // "taxInfo.taxEmail"?: string; // Add this to allow direct filtering on nested field
    "taxInfo.taxEmail"?: { $regex: RegExp }; // Modify this to handle regex for nested field
}


/**
 * Filters Topup fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
export const filterTaxInvoiceFields = (query: any): TaxInvoiceFilter => {
    let filter: TaxInvoiceFilter = {};

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
        filter = {
            ...filter,
            "taxInfo.taxEmail": { $regex: new RegExp(query.email, "i") }, // Case-insensitive regex search
        };
    }

    // Filter by status (REQUESTING, APPROVED, REJECTED, CANCELED)
    if (query.status) {
        filter = {
            ...filter,
            status: query.status,
        };
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

        if (isNaN(startDate?.getTime() || 0) || isNaN(endDate?.getTime() || 0)) {
            throw new Error("Invalid date format. Please provide valid startDate and endDate.");
        }

        // Add +1 day to endDate
        if (endDate) {
            endDate.setUTCDate(endDate.getUTCDate() + 1);
        }

        filter = {
            ...filter,
            createdAt: {
                ...(startDate && { $gte: startDate }),
                ...(endDate && { $lte: endDate }),
            },
        };
    }

    return filter;
};
