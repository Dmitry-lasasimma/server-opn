import { IPaymentMethod } from "../../models/paymentMethod";
interface PaymentMethodFilter {
    name?: string | RegExp;
    status?: boolean;
    price?: { $gte?: number; $lte?: number };
    credit?: { $gte?: number; $lte?: number };
    createdAt?: { $gte?: Date; $lte?: Date };
}

/**
 * Filters PaymentMethod fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
export const filterPayementMethodFields = (query: any): PaymentMethodFilter => {
    let filter: PaymentMethodFilter = {};

    // Filter by name
    if (query.name) {
        filter = {
            ...filter,
            name: new RegExp(query.name, "i"), // Case-insensitive search
        };
    }

    if (query.status) {
        filter = {
            ...filter,
            status: query.status,
        };
    }

    return filter;
};

// type PaymentMethod = {
//     _id: string;
//     name: string;
//     status: boolean;
//     createdBy: string;
//     createdByFullName: string;
//     createdAt: string;
//     updatedAt: string;
//     updatedBy: string;
//     updatedByFullName: string;
// };
type Dataset = {
    paymentMethods: IPaymentMethod[];
};
export const checkPaymentMethodsStatus = (dataset: Dataset): boolean => {
    // Check if all payment methods have their status as false
    const allFalse = dataset.paymentMethods.every((method) => method.status === false);
    return !allFalse; // Return true if not all are false, otherwise false
};