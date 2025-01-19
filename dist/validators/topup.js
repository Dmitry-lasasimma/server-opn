"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteManyTopup = exports.validateParamID = exports.validateCreateTopup = void 0;
const topup_1 = require("../models/topup");
const validateCreateTopup = (req, res, next) => {
    const { packageName, credit, price, type } = req.body;
    const errors = [];
    // Validate packageName
    if (typeof packageName !== "string" || packageName.trim().length === 0) {
        errors.push("PackageName is required and must be a non-empty string.");
    }
    // Validate credit
    if (typeof credit !== "number" || Number.isNaN(credit)) {
        errors.push("Credit is required and must be a valid number.");
    }
    // Validate price
    if (typeof price !== "number" || Number.isNaN(price)) {
        errors.push("Price is required and must be a valid number.");
    }
    // Validate type
    if (typeof type !== "string" ||
        !Object.values(topup_1.TopupTypeEnum).includes(type)) {
        errors.push(`Type is required and must be one of: ${Object.values(topup_1.TopupTypeEnum).join(", ")}`);
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
exports.validateCreateTopup = validateCreateTopup;
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
const validateDeleteManyTopup = (req, res, next) => {
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
exports.validateDeleteManyTopup = validateDeleteManyTopup;
