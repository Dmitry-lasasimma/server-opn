"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponStatus = exports.filterCouponFields = void 0;
const coupon_1 = require("../../models/coupon");
/**
 * Filters Topup fields based on query parameters.
 * @param query - The request query object.
 * @returns A filter object for MongoDB queries.
 */
const filterCouponFields = (query) => {
    let filter = {};
    if (query.status) {
        filter = Object.assign(Object.assign({}, filter), { status: query.status });
    }
    return filter;
};
exports.filterCouponFields = filterCouponFields;
const updateCouponStatus = (coupons) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    coupons.forEach((coupon) => {
        const endDate = new Date(coupon.endDate);
        if (currentDate > endDate) {
            coupon_1.Coupon.updateOne({ _id: coupon._id }, { status: false }).exec();
            coupon.status = false;
        }
    });
    return coupons;
});
exports.updateCouponStatus = updateCouponStatus;
