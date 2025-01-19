"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParamID = exports.validateCreateWallet = void 0;
const validateCreateWallet = (req, res, next) => {
    // const { packageName, credit, price, type } = req.body;
    const { user, credit } = req.body;
    const errors = [];
    // Validate packageName
    if (typeof user !== "string" || user.trim().length === 0) {
        errors.push("User is required and must be a non-empty string.");
    }
    // // Validate user
    // if (!mongoose.Types.ObjectId.isValid(user)) {
    // 	errors.push("User must be a valid ObjectId.");
    // }
    // Validate credit
    if (typeof credit !== "number" || Number.isNaN(credit)) {
        errors.push("Credit is required and must be a valid number.");
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
exports.validateCreateWallet = validateCreateWallet;
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
