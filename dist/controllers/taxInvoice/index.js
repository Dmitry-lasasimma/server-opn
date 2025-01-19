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
exports.deleteTaxInvoiceByID = exports.updateTaxInvoiceByID = exports.getTaxInvoices = exports.getTaxInvoiceByID = exports.createTaxInvoice = void 0;
const taxInvoice_1 = require("../../services/taxInvoice");
const config_1 = require("../../config");
const user_1 = require("../../services/user");
const paymentHistory_1 = require("../../services/paymentHistory");
const helper_1 = require("./helper");
const createTaxInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = req.user;
        const userData = yield (0, user_1.findUserByIDService)(req, userToken.id);
        if (!(userData === null || userData === void 0 ? void 0 : userData.taxInfo)) {
            res.status(404).json({
                code: config_1.messages.TAX_INFO_NOT_FOUND.code,
                message: config_1.messages.TAX_INFO_NOT_FOUND.message,
                detail: "User tax info not found",
            });
            return;
        }
        const { paymentId } = req.body;
        const record = yield (0, taxInvoice_1.createdTaxInvoiceService)(paymentId, userData.taxInfo, userToken);
        //update taxInvoice id into payment hostory
        const paymentHistory = yield (0, paymentHistory_1.updatePaymentHistoryInvoiceByIDService)(record.paymentId, record._id);
        if (!paymentHistory) {
            res.status(500).json({
                code: config_1.messages.INTERNAL_SERVER_ERROR.code,
                message: config_1.messages.INTERNAL_SERVER_ERROR.message,
                detail: "Failed to update payment history with tax invoice ID",
            });
            return;
        }
        res.status(201).json({
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: config_1.messages.CREATE_SUCCESSFUL.message,
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.createTaxInvoice = createTaxInvoice;
const getTaxInvoiceByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, taxInvoice_1.findTaxInvoiceByIDService)(id);
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
exports.getTaxInvoiceByID = getTaxInvoiceByID;
const getTaxInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { skip = "0", limit = "10" } = _a, query = __rest(_a, ["skip", "limit"]);
        const parsedSkip = parseInt(skip, 10);
        const parsedLimit = parseInt(limit, 10);
        // Generate filter object
        const filter = (0, helper_1.filterTaxInvoiceFields)(query);
        // console.log("filter: ", filter);
        // Fetch topups and count using the reusable function
        const { taxInvoices, totalCount } = yield (0, taxInvoice_1.fetchTaxInvoicesWithPagination)(filter, parsedSkip, parsedLimit);
        // Return results
        if (!taxInvoices || taxInvoices.length === 0) {
            res.status(200).json({
                code: config_1.messages.SUCCESSFULLY.code,
                message: config_1.messages.SUCCESSFULLY.message,
                total: totalCount,
                taxInvoices,
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            total: totalCount,
            taxInvoices,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching topups:", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getTaxInvoices = getTaxInvoices;
const updateTaxInvoiceByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, rejectionReason } = req.body; // Extract update data from request body
        const id = req.params.id;
        const userToken = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, taxInvoice_1.updateTaxInvoiceByIDService)(id, { status, rejectionReason }, userToken);
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
exports.updateTaxInvoiceByID = updateTaxInvoiceByID;
const deleteTaxInvoiceByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Delete the Record via the service function
        const deletedRecord = yield (0, taxInvoice_1.deleteTaxInvoiceByIDService)(id);
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
exports.deleteTaxInvoiceByID = deleteTaxInvoiceByID;
