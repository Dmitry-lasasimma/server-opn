"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParamID = exports.validateCreatePaymentMethod = void 0;
const validateCreatePaymentMethod = (req, res, next) => {
    const { name } = req.body;
    const errors = [];
    // Validate name
    if (typeof name !== "string" || name.trim().length === 0) {
        errors.push("name is required and must be a non-empty string.");
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
exports.validateCreatePaymentMethod = validateCreatePaymentMethod;
const validateParamID = (req, res, next) => {
    const errors = [];
    const id = req.params.id;
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
