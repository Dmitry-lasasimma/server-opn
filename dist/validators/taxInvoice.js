"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParamID = exports.validateCreateTaxInvoice = void 0;
const validateCreateTaxInvoice = (req, res, next) => {
    const { paymentId } = req.body;
    const errors = [];
    // Validate payment
    if (typeof paymentId !== "string" || paymentId.trim().length === 0) {
        errors.push("paymentId is required and must be a non-empty string.");
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
exports.validateCreateTaxInvoice = validateCreateTaxInvoice;
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
