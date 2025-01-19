"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteManyCoupon = exports.validateCheckCoupon = exports.validateGenerateCoupon = exports.validateParamID = exports.validateCreateCoupon = void 0;
const validateCreateCoupon = (req, res, next) => {
    const { name, amount, point, startDate, endDate, couponCodes } = req.body;
    const errors = [];
    // Validate name
    if (typeof name !== "string" || name.trim().length === 0) {
        errors.push("name is required and must be a non-empty string.");
    }
    // Validate amount
    if (typeof amount !== "number" || Number.isNaN(amount)) {
        errors.push("amount is required and must be a valid number.");
    }
    // Validate point
    if (typeof point !== "number" || Number.isNaN(point)) {
        errors.push("point is required and must be a valid number.");
    }
    // Validate startDate
    if (typeof startDate !== "string" || isNaN(Date.parse(startDate))) {
        errors.push("startDate is required and must be a valid date string.");
    }
    // Validate endDate
    if (typeof endDate !== "string" || isNaN(Date.parse(endDate))) {
        errors.push("endDate is required and must be a valid date string.");
    }
    // Validate couponCodes
    if (!Array.isArray(couponCodes)) {
        errors.push("couponCodes must be an array.");
    }
    else {
        couponCodes.forEach((code, index) => {
            if (typeof code !== "string" || code.trim().length === 0) {
                errors.push(`Coupon code at index ${index} must be a non-empty string.`);
            }
        });
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateCreateCoupon = validateCreateCoupon;
const validateParamID = (req, res, next) => {
    // const { question, answer } = req.body;
    const errors = [];
    const id = req.params.id;
    // const { id } = req.query; // Extracting the 'id' from the query string
    if (!id || typeof id !== "string") {
        errors.push("Please provide a valid ID in the query.");
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateParamID = validateParamID;
const validateGenerateCoupon = (req, res, next) => {
    const { amount } = req.body;
    const errors = [];
    // Validate credit
    if (typeof amount !== "number" || Number.isNaN(amount)) {
        errors.push("Amount is required and must be a valid number.");
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateGenerateCoupon = validateGenerateCoupon;
const validateCheckCoupon = (req, res, next) => {
    const { code } = req.body;
    const errors = [];
    // Validate code
    if (typeof code !== "string" || code.trim().length === 0) {
        errors.push("Code is required and must be a non-empty string.");
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateCheckCoupon = validateCheckCoupon;
const validateDeleteManyCoupon = (req, res, next) => {
    const { arrayIds } = req.body;
    const errors = [];
    if (!arrayIds) {
        errors.push("arrayIds is required.");
    }
    // Ensure arrayIds is valid and is an array
    if (!Array.isArray(arrayIds) || arrayIds.length === 0) {
        errors.push("arrayIds is required.");
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateDeleteManyCoupon = validateDeleteManyCoupon;
