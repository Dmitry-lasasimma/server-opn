import { Coupon, ICoupon } from "../../models/coupon";

interface CouponFilter {
    // packageName?: string | RegExp;
    // type?: string;
    status?: boolean;
    // price?: { $gte?: number; $lte?: number };
    // credit?: { $gte?: number; $lte?: number };
    // createdAt?: { $gte?: Date; $lte?: Date };
}

/**
 * Filters Topup fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
export const filterCouponFields = (query: any): CouponFilter => {
    let filter: CouponFilter = {};

    if (query.status) {
        filter = {
            ...filter,
            status: query.status,
        };
    }

    return filter;
};

export const updateCouponStatus = async (coupons: ICoupon[]) => {
    const currentDate = new Date();

    coupons.forEach((coupon) => {
        const endDate = new Date(coupon.endDate);
        if (currentDate > endDate) {
            Coupon.updateOne(
                { _id: coupon._id },
                { status: false },
            ).exec();
            coupon.status = false;
        }
    });

    return coupons;
};