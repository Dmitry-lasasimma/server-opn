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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJobGetCoupons = exports.deleteManyCoupons = exports.redeemCoupon = exports.generateCoupon = exports.deleteCouponByID = exports.updateCouponByID = exports.getCoupons = exports.getCouponByID = exports.createCoupon = void 0;
// import { validationResult } from "express-validator";
const coupon_1 = require("../../services/coupon");
const config_1 = require("../../config");
const helper_1 = require("./helper");
const createCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, amount, point, startDate, endDate, couponCodes, status } = req.body;
        console.log("couponCodes", couponCodes);
        const record = yield (0, coupon_1.createdCouponService)(name, amount, point, startDate, endDate, couponCodes, status, user);
        res.status(200).json({
            message: "Create record Successful",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.createCoupon = createCoupon;
const getCouponByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, coupon_1.findCouponByIDService)(id);
        if (!record) {
            res.status(404).json({
                message: config_1.messages.NOT_FOUND,
                detail: "record not found with this id",
            });
            return;
        }
        res.status(200).json({
            message: "Get data successfully",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.getCouponByID = getCouponByID;
const getCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { skip = "0", limit = "10" } = _a, query = __rest(_a, ["skip", "limit"]);
        const parsedSkip = parseInt(skip, 10);
        const parsedLimit = parseInt(limit, 10);
        // Generate filter object
        const filter = (0, helper_1.filterCouponFields)(query);
        // Fetch topups and count using the reusable function
        const { coupons, totalCount } = yield (0, coupon_1.fetchCouponsWithPagination)(filter, parsedSkip, parsedLimit);
        const couponsUpdated = yield (0, helper_1.updateCouponStatus)(coupons);
        // Return results
        if (!coupons || coupons.length === 0) {
            res.status(200).json({
                code: config_1.messages.SUCCESSFULLY.code,
                message: config_1.messages.NOT_FOUND.message,
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            total: totalCount,
            coupons: couponsUpdated,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.getCoupons = getCoupons;
const updateCouponByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, amount, point, startDate, endDate, status } = req.body; // Extract update data from request body
        const id = req.params.id;
        const user = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, coupon_1.updateCouponByIDService)(id, { name, amount, point, startDate, endDate, status }, user);
        if (!updatedRecord) {
            res.status(404).json({
                message: "Record not found",
                detail: `No Record found with the ID ${id}`,
            });
            return;
        }
        res.status(200).json({
            message: "Record updated successfully",
            updatedRecord,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.updateCouponByID = updateCouponByID;
const deleteCouponByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Delete the Record via the service function
        const deletedRecord = yield (0, coupon_1.deleteCouponByIDService)(id);
        if (!deletedRecord) {
            res.status(404).json({
                message: "record not found",
                detail: `No record found with the ID ${id}`,
            });
            return;
        }
        res.status(200).json({
            message: "record deleted successfully",
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.deleteCouponByID = deleteCouponByID;
// generate coupon
const generateCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const record = yield (0, coupon_1.generatedCouponService)(amount);
        res.status(200).json({
            message: "Create record Successful",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.generateCoupon = generateCoupon;
// check coupon
const redeemCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { code } = req.body;
        const point = yield (0, coupon_1.checkCouponService)(req, code, user);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: config_1.messages.SUCCESSFULLY.message,
            respone: point,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error.message);
        if (error.message === "COUPON_NOT_FOUND") {
            res.status(404).json({
                code: config_1.messages.COUPON_NOT_FOUND.code,
                message: config_1.messages.COUPON_NOT_FOUND.message,
                detail: config_1.messages.COUPON_NOT_FOUND.detail,
            });
            return;
        }
        if (error.message === "COUPON_ALREADY_EXPIRED") {
            res.status(404).json({
                code: config_1.messages.COUPON_ALREADY_EXPIRED.code,
                message: config_1.messages.COUPON_ALREADY_EXPIRED.message,
                detail: config_1.messages.COUPON_ALREADY_EXPIRED.detail,
            });
            return;
        }
        if (error.message === "COUPON_ALREADY_USED") {
            res.status(404).json({
                code: config_1.messages.COUPON_ALREADY_USED.code,
                message: config_1.messages.COUPON_ALREADY_USED.message,
                detail: config_1.messages.COUPON_ALREADY_USED.detail
            });
            return;
        }
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.redeemCoupon = redeemCoupon;
// delete many coupons
const deleteManyCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { arrayIds } = req.body;
        // Ensure arrayIds is valid and is an array
        if (!Array.isArray(arrayIds) || arrayIds.length === 0) {
            res.status(400).json({
                code: config_1.messages.BAD_REQUEST.code,
                message: "Invalid or empty array of IDs",
            });
            return;
        }
        // Delete the Records via the service function
        const deletedRecord = yield (0, coupon_1.deleteManyCouponsService)(arrayIds);
        // If no records were deleted, return a 404 response
        if (deletedRecord.deletedCount === 0) {
            res.status(404).json({
                code: config_1.messages.NOT_FOUND.code,
                message: "No records found with the provided IDs",
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Records deleted successfully",
            deletedCount: deletedRecord.deletedCount,
        });
    }
    catch (error) {
        console.error("Error in deleteManyTopups:", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.deleteManyCoupons = deleteManyCoupons;
// for cron job
const cronJobGetCoupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Cron job running");
        const _a = req.query, { skip = "0", limit = "50" } = _a, query = __rest(_a, ["skip", "limit"]);
        const parsedSkip = parseInt(skip, 10);
        const parsedLimit = parseInt(limit, 10);
        // Generate filter object
        const filter = (0, helper_1.filterCouponFields)(query);
        // Fetch topups and count using the reusable function
        const { coupons, totalCount } = yield (0, coupon_1.fetchCouponsWithPagination)(filter, parsedSkip, parsedLimit);
        yield (0, helper_1.updateCouponStatus)(coupons);
        // Return results
        if (!coupons || coupons.length === 0) {
            res.status(200).json({
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message,
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            total: totalCount,
            coupons: {},
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.cronJobGetCoupons = cronJobGetCoupons;
