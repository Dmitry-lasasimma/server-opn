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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyTopups = exports.updateTopupByID = exports.getTopups = exports.getTopupByID = exports.createTopup = void 0;
const axios_1 = __importDefault(require("axios"));
const topup_1 = require("../../services/topup");
const config_1 = require("../../config");
const helper_1 = require("./helper");
const createTopup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { packageName, credit, price, pointPrice, type, isAvailable, point } = req.body;
        const topupID = (0, helper_1.generateTopupId)();
        //Create user with Create User Service
        const record = yield (0, topup_1.createdTopupService)(topupID, packageName, credit, price, pointPrice, type, isAvailable, point, user);
        // console.log("record?._id", record?._id)
        // let id: string = record?._id?.toString() ?? '';
        if (type === "PROMOTION") {
            // send notification โค้ดโปรโมชั่น ชำระเงินแล้ว…ได้…ยังได้ 10 แต้มอีกด้วย
            console.log("send promotion noti");
            try {
                let notificationBody = {
                    id: record === null || record === void 0 ? void 0 : record._id,
                    title: `Promotion ${packageName}!`,
                    detail: `โปรโมชั่น ${packageName} เติมเงิน ${price} THB ได้ ${credit} THB และ ยังได้ ${point} POINT.`,
                    type: "PROMOTION",
                    platform: "EV",
                    recipientRole: "CUSTOMER"
                };
                console.log("notificationBody", notificationBody);
                const response = yield axios_1.default.post(`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications/all-users`, notificationBody, {
                    headers: {
                        Authorization: `${req.headers["authorization"]}`,
                    },
                });
                console.log("response", response);
                console.log("Notification sent successfully:", response.data);
            }
            catch (error) {
                console.error("Error sending notification:", error);
                throw error;
            }
        }
        res.status(201).json({
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: "Create record Successful",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        if (error.message === "NAME_ALREADY_EXISTED") {
            res.status(400).json({
                code: config_1.messages.NAME_ALREADY_EXISTED.code,
                message: config_1.messages.NAME_ALREADY_EXISTED.message,
                detail: error.message,
            });
            return;
        }
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.createTopup = createTopup;
const getTopupByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, topup_1.findTopupByIDService)(id);
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
exports.getTopupByID = getTopupByID;
const getTopups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { skip = "0", limit = "10" } = _a, query = __rest(_a, ["skip", "limit"]);
        const parsedSkip = parseInt(skip, 10);
        const parsedLimit = parseInt(limit, 10);
        // Generate filter object
        const filter = (0, helper_1.filterTopupFields)(query);
        // Fetch topups and count using the reusable function
        const { topups, totalCount } = yield (0, topup_1.fetchTopupsWithPagination)(filter, parsedSkip, parsedLimit);
        // Return results
        if (!topups || topups.length === 0) {
            res.status(200).json({
                code: config_1.messages.SUCCESSFULLY.code,
                message: "No Topup found",
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            total: totalCount,
            topups,
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
exports.getTopups = getTopups;
const updateTopupByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { packageName, credit, price, pointPrice, type, isAvailable, point } = req.body; // Extract update data from request body
        const id = req.params.id;
        const user = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, topup_1.updateTopupByIDService)(id, { packageName, credit, price, pointPrice, type, isAvailable, point }, user);
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
exports.updateTopupByID = updateTopupByID;
const deleteManyTopups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const deletedRecord = yield (0, topup_1.deleteManyTopupsService)(arrayIds);
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
exports.deleteManyTopups = deleteManyTopups;
