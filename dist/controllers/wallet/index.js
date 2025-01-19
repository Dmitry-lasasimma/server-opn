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
exports.getWalletAggregateByUser = exports.updateWalletByUserServer = exports.getWalletByUserServer = exports.getWalletByUser = exports.deleteWalletByID = exports.updateWalletByID = exports.getWallets = exports.getWalletByID = exports.createWallet = void 0;
const mongodb_1 = require("mongodb");
const wallet_1 = require("../../services/wallet");
const config_1 = require("../../config");
const user_1 = require("../../services/user");
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, credit } = req.body;
        const userToken = req.user;
        const record = yield (0, wallet_1.createdWalletService)(user, credit, userToken);
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
exports.createWallet = createWallet;
const getWalletByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, wallet_1.findWalletByIDService)(id);
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
exports.getWalletByID = getWalletByID;
const getWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, skip, limit } = req.query;
        // Ensure skip and limit are valid numbers
        const parsedSkip = Number.parseInt(skip, 10) || 0;
        const parsedLimit = Number.parseInt(limit, 10) || 10;
        // If a question is provided, search by question; otherwise, get all FAQs
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let Data;
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let RecordsCount;
        if (user && typeof user === "string") {
            Data = yield (0, wallet_1.findWalletByUserService)(user, parsedSkip, parsedLimit);
            RecordsCount = yield (0, wallet_1.findAllWalletsServiceCount)();
        }
        else {
            Data = yield (0, wallet_1.findAllWalletsService)(parsedSkip, parsedLimit);
            RecordsCount = yield (0, wallet_1.findAllWalletsServiceCount)();
        }
        if (!Data || Data.length === 0) {
            res.status(404).json({
                message: "No Record found",
                detail: "No Records match the provided criteria",
            });
            return;
        }
        res.status(200).json({
            total: RecordsCount,
            message: "Get Records successfully",
            Data,
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
exports.getWallets = getWallets;
const updateWalletByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, credit } = req.body; // Extract update data from request body
        const id = req.params.id;
        const userToken = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, wallet_1.updateWalletByIDService)(id, { user, credit }, userToken);
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
exports.updateWalletByID = updateWalletByID;
const deleteWalletByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Delete the Record via the service function
        const deletedRecord = yield (0, wallet_1.deleteWalletByIDService)(id);
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
exports.deleteWalletByID = deleteWalletByID;
// new controller
const getWalletByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const id = req.params.id;
        const parsedSkip = Number.parseInt("0", 10) || 0;
        const parsedLimit = Number.parseInt("1", 10) || 10;
        const userToken = req.user;
        console.log("userToken: ", userToken);
        const record = yield (0, wallet_1.findWalletByUserService)(userToken.id, parsedSkip, parsedLimit);
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
            message: config_1.messages.SUCCESSFULLY.message,
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
exports.getWalletByUser = getWalletByUser;
// server controller
const getWalletByUserServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const parsedSkip = Number.parseInt("0", 10) || 0;
        const parsedLimit = Number.parseInt("1", 10) || 10;
        const record = yield (0, wallet_1.findOneWalletByUserService)(userId, parsedSkip, parsedLimit);
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
            message: config_1.messages.SUCCESSFULLY.message,
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
exports.getWalletByUserServer = getWalletByUserServer;
const updateWalletByUserServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, credit } = req.body; // Extract userId and credit from the request body
        // Fetch user data
        const userData = yield (0, user_1.findUserDataByIdService)(userId);
        // Fetch wallet data
        const wallet = yield (0, wallet_1.findOneWalletByUserService)(userId, 0, 1); // Fetch wallet with skip and limit
        if (!wallet) {
            res.status(404).json({
                code: config_1.messages.NOT_FOUND.code,
                message: "Wallet not found",
                detail: `No wallet record found for userId ${userId}`,
            });
            return;
        }
        // Calculation logic
        let remainingCredit = credit; // The credit amount to deduct
        let updatedDebtCredit = wallet.debtCredit || 0; // Start with current debt credit
        let totalSpent = 0; // Track the total amount spent
        // Deduct from wallet.credit
        if (wallet.credit >= remainingCredit) {
            wallet.credit -= remainingCredit;
            totalSpent += remainingCredit; // Add to total spent
            remainingCredit = 0; // No remaining credit to deduct
        }
        else {
            totalSpent += wallet.credit; // Add remaining wallet.credit to total spent
            remainingCredit -= wallet.credit; // Deduct what is available in wallet.credit
            wallet.credit = 0; // Wallet credit is fully used
        }
        // Deduct from wallet.pointCredit if there's remaining credit to deduct
        if (remainingCredit > 0) {
            if (wallet.pointCredit >= remainingCredit) {
                wallet.pointCredit -= remainingCredit;
                totalSpent += remainingCredit; // Add to total spent
                remainingCredit = 0; // No remaining credit to deduct
            }
            else {
                totalSpent += wallet.pointCredit; // Add remaining wallet.pointCredit to total spent
                remainingCredit -= wallet.pointCredit; // Deduct what is available in wallet.pointCredit
                wallet.pointCredit = 0; // Wallet pointCredit is fully used
            }
        }
        // If there's still remaining credit, it becomes debt
        if (remainingCredit > 0) {
            updatedDebtCredit += remainingCredit; // Add remaining credit to debt
            wallet.debtCredit = updatedDebtCredit;
        }
        // Update the spendedCredit field
        // wallet.spendedCredit = (wallet.spendedCredit || 0) + totalSpent;
        // Update the sumCredit field
        wallet.credit = wallet.credit + wallet.pointCredit;
        // Save the updated wallet record
        wallet.updatedBy = userData.id; // Assuming userData contains `id`
        wallet.updatedByFullName = userData.fullName; // Assuming userData contains `fullName`
        wallet.updatedAt = new Date(); // Update the updatedAt timestamp
        const updatedWallet = yield (0, wallet_1.serverUpdateWalletByIDService)(wallet.id, wallet, userData);
        if (!updatedWallet) {
            res.status(404).json({
                message: "Failed to update wallet",
                detail: `Failed to update wallet for userId ${userId}`,
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Wallet updated successfully",
            updatedWallet,
        });
    }
    catch (error) {
        console.error("Error in updateWalletByUserService:", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
    }
});
exports.updateWalletByUserServer = updateWalletByUserServer;
//wallet aggregate
const getWalletAggregateByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = req.user;
        console.log("userToken: ", userToken);
        const userId = new mongodb_1.ObjectId(userToken.id);
        const aggregationPipeline = [
            {
                "$match": {
                    "user": userId // Match by the user ObjectId
                }
            },
            {
                "$lookup": {
                    "from": "paymenthistories", // The collection to join
                    "let": { "walletUserId": { "$toString": "$user" } }, // Convert the wallet's ObjectId to a string
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$eq": ["$user", "$$walletUserId"] // Match the user from paymentHistory with wallet user (converted to string)
                                }
                            }
                        },
                        {
                            "$match": {
                                "$expr": {
                                    "$in": ["$paymentChannel", ["PROMPTPAY", "CREDIT_CARD", "POINT"]] // Filter by payment channels
                                }
                            }
                        },
                        {
                            "$match": {
                                "status": "SUCCESS" // Filter where status is "SUCCESS"
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "totalCredit": { "$sum": "$credit" } // Sum the 'credit' from paymentHistory
                            }
                        }
                    ],
                    "as": "paymentHistory"
                }
            },
            {
                "$lookup": {
                    "from": "charginghistories", // The charginghistories collection to join
                    "let": { "walletUserId": { "$toString": "$user" } }, // Convert wallet's ObjectId to string for comparison
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$eq": ["$user", "$$walletUserId"] // Match the user from charginghistories with wallet user (converted to string)
                                }
                            }
                        },
                        {
                            "$match": {
                                "status": "COMPLETED" // Filter where status is "COMPLETED"
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "totalChargingCredit": { "$sum": "$credit" } // Sum the 'credit' from charginghistories
                            }
                        }
                    ],
                    "as": "chargingHistory"
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "user": 1,
                    "credit": 1,
                    "totalCredit": {
                        "$ifNull": [{ "$arrayElemAt": ["$paymentHistory.totalCredit", 0] }, 0] // Default totalCredit to 0 if no records found in paymentHistory
                    },
                    "spendedCredit": {
                        "$ifNull": [{ "$arrayElemAt": ["$chargingHistory.totalChargingCredit", 0] }, 0] // Default totalChargingCredit to 0 if no records found in charginghistories
                    }
                }
            }
        ];
        console.log("aggregationPipeline", aggregationPipeline);
        const record = yield (0, wallet_1.aggregateWalletByUserService)(aggregationPipeline);
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
            message: config_1.messages.SUCCESSFULLY.message,
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
exports.getWalletAggregateByUser = getWalletAggregateByUser;
