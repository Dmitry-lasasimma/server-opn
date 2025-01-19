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
exports.updatePaymentMethodsStatus = exports.deleteManyPaymentMethods = exports.updatePaymentMethodByID = exports.getPaymentMethods = exports.getPaymentMethodByID = exports.createPaymentMethod = void 0;
const paymentMethod_1 = require("../../services/paymentMethod");
const config_1 = require("../../config");
const helper_1 = require("./helper");
const createPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { name, status } = req.body;
        //Create user with Create User Service
        const record = yield (0, paymentMethod_1.createPaymentMethodService)(name, status, user);
        res.status(201).json({
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: "Create record Successful",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.createPaymentMethod = createPaymentMethod;
const getPaymentMethodByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, paymentMethod_1.findPaymentMethodByIDService)(id);
        if (!record) {
            res.status(404).json({
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message,
                detail: "record not found with this id",
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Get data successfully",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getPaymentMethodByID = getPaymentMethodByID;
const getPaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { skip = "0", limit = "10" } = _a, query = __rest(_a, ["skip", "limit"]);
        const parsedSkip = parseInt(skip, 10);
        const parsedLimit = parseInt(limit, 10);
        // Generate filter object
        const filter = (0, helper_1.filterPayementMethodFields)(query);
        // Fetch topups and count using the reusable function
        const { paymentMethods, totalCount } = yield (0, paymentMethod_1.fetchPaymentMethodsWithPagination)(filter, parsedSkip, parsedLimit);
        // Return results
        if (!paymentMethods || paymentMethods.length === 0) {
            res.status(200).json({
                code: config_1.messages.NOT_FOUND.code,
                message: "No Topup found",
            });
            return;
        }
        const result = (0, helper_1.checkPaymentMethodsStatus)({ paymentMethods });
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            total: totalCount,
            status: result,
            paymentMethods,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching payment methods:", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getPaymentMethods = getPaymentMethods;
const updatePaymentMethodByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status } = req.body; // Extract update data from request body
        const id = req.params.id;
        const user = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, paymentMethod_1.updatePaymentMethodByIDService)(id, { name, status }, user);
        if (!updatedRecord) {
            res.status(200).json({
                code: config_1.messages.NOT_FOUND.code,
                message: "Record not found",
                detail: `No Record found with the ID ${id}`,
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Record updated successfully",
            updatedRecord,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.updatePaymentMethodByID = updatePaymentMethodByID;
const deleteManyPaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const deletedRecord = yield (0, paymentMethod_1.deleteManyPaymentMethodsService)(arrayIds);
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
exports.deleteManyPaymentMethods = deleteManyPaymentMethods;
const updatePaymentMethodsStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body; // Extract the status from the request body
        const user = req.user;
        // Validate input
        if (typeof status !== "boolean") {
            res.status(400).json({
                code: config_1.messages.BAD_REQUEST.code,
                message: "Invalid input: 'status' should be true or false",
            });
            return;
        }
        // Update all records with the provided status
        const updatedResult = yield (0, paymentMethod_1.updatePaymentMethodsService)({ status }, user);
        if (!updatedResult || updatedResult.modifiedCount === 0) {
            res.status(404).json({
                code: config_1.messages.NOT_FOUND.code,
                message: "No records found to update",
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "All records updated successfully",
            updatedCount: updatedResult.modifiedCount,
        });
    }
    catch (error) {
        console.error("Error in updatePaymentMethodsStatus:", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
    }
});
exports.updatePaymentMethodsStatus = updatePaymentMethodsStatus;
