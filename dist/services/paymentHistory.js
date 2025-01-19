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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createdFeePaymentHistoryService = exports.createdReservePaymentHistoryService = exports.createdChargePaymentHistoryService = exports.fetchPaymentHistoriesForDashboardService = exports.fetchPaymentHistoriesForDashboardByUserIDService = exports.updatePaymentHistoryInvoiceByIDService = exports.findPaymentHistoryByOmiseIDService = exports.updatePaymentHistoryByTransactionIDService = exports.deletePaymentHistoryByIDService = exports.updatePaymentHistoryByIDService = exports.findAllPaymentHistoriesServiceCount = exports.findAllPaymentHistoriesServicev1 = exports.fetchPaymentHistoriessWithPaginationNullInvoiceId = exports.fetchPaymentHistoriesPopulateTaxinvoicesWithPagination = exports.fetchPaymentHistoriesWithPagination = exports.findPaymentHistoryByIDService = exports.createdPaymentHistoryService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const paymentHistory_1 = require("../models/paymentHistory");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// POST
const createdPaymentHistoryService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, paymentID, topupPackage, topupPackageID, credit, remainingCredit, isPromotion, promotionCredit, price, point, currency, status, paymentType, paymentChannel, cardType, cardLast4, omiseTransactionID, omiseTransactionDetail, omiseCardID, transactionID, bankName, bankTransactionDetail, bankMessage, bankCode, destMerchantId, destMerchantName, taxRate, taxPrice, totalPriceWithTax, createdBy, createdByFullName, }) {
    try {
        // // Check if the user already exists
        // const existingPackageName = await PaymentHistory.findOne({ packageName });
        // if (existingPackageName) {
        //     throw '404';
        // }
        // var createdBy = userData.id
        // Create new user
        const newRecord = new paymentHistory_1.paymentHistoryModel({
            user,
            paymentID,
            topupPackage,
            topupPackageID,
            credit,
            remainingCredit,
            isPromotion,
            promotionCredit,
            price,
            point,
            currency,
            status,
            paymentType,
            paymentChannel,
            cardType,
            cardLast4,
            omiseTransactionID,
            omiseTransactionDetail,
            omiseCardID,
            transactionID,
            bankName,
            bankTransactionDetail,
            bankMessage,
            bankCode,
            destMerchantId,
            destMerchantName,
            taxRate,
            taxPrice,
            totalPriceWithTax,
            createdBy,
            createdByFullName,
        });
        // Save the user to the database
        const savedRecord = yield newRecord.save();
        // Return the created user without sensitive fields (e.g., pin)
        return savedRecord.toObject({
            versionKey: false,
            transform: (_, ret) => {
                // biome-ignore lint/performance/noDelete: <explanation>
                delete ret.pin;
                return ret;
            },
        });
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw new Error("Error creating Record");
    }
});
exports.createdPaymentHistoryService = createdPaymentHistoryService;
// GET
const findPaymentHistoryByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield paymentHistory_1.paymentHistoryModel
            .findOne({ _id: new mongodb_1.ObjectId(id) })
            .populate({
            path: 'taxinvoiceId',
            model: 'TaxInvoice',
            select: 'status',
        })
            .exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findPaymentHistoryByIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findPaymentHistoryByIDService = findPaymentHistoryByIDService;
// GET
// export const findPaymentHistoriesByPackageService = async (
//   packageName: string,
//   skip: number,
//   limit: number
// ) => {
//   try {
//     const records = await Topup.find({
//       packageName: { $regex: new RegExp(packageName, "i") },
//     }) // Case-insensitive search
//       .skip(skip) // Skip the specified number of records
//       .limit(limit) // Limit the number of records returned
//       .select("-__v")
//       .exec();
//     return records;
//   } catch (error) {
//     console.error("Error in findTopupsByPackageService:", error);
//     throw new Error("Failed to retrieve data by question");
//   }
// };
const fetchPaymentHistoriesWithPagination = (filter, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield paymentHistory_1.paymentHistoryModel
            .find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalCount = yield paymentHistory_1.paymentHistoryModel.countDocuments(filter).exec();
        return { payments, totalCount };
    }
    catch (error) {
        console.error("Error in fetchPaymentHistoriessWithPagination:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.fetchPaymentHistoriesWithPagination = fetchPaymentHistoriesWithPagination;
//Get paymentHistories with populate taxInvoices
const fetchPaymentHistoriesPopulateTaxinvoicesWithPagination = (filter, taxInvoiceStatus, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield paymentHistory_1.paymentHistoryModel
            .find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate({
            path: 'taxinvoiceId',
            model: 'TaxInvoice',
            select: 'status',
            match: { status: taxInvoiceStatus }, // Replace 'desiredStatus' with the actual status you want to filter by
        })
            .exec();
        const totalCount = yield paymentHistory_1.paymentHistoryModel.countDocuments(filter).exec();
        if (taxInvoiceStatus !== "") {
            // Optionally filter out payments where taxinvoiceId is null
            const filteredPayments = payments.filter(payment => payment.taxinvoiceId !== null);
            return { payments: filteredPayments, totalCount: filteredPayments.length };
        }
        return { payments, totalCount };
    }
    catch (error) {
        console.error("Error in fetchPaymentHistoriessWithPagination:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.fetchPaymentHistoriesPopulateTaxinvoicesWithPagination = fetchPaymentHistoriesPopulateTaxinvoicesWithPagination;
//Get paymentHistories for query taxInvoice=null
const fetchPaymentHistoriessWithPaginationNullInvoiceId = (filter, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield paymentHistory_1.paymentHistoryModel
            .find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalCount = yield paymentHistory_1.paymentHistoryModel.countDocuments(filter).exec();
        return { payments, totalCount };
    }
    catch (error) {
        console.error("Error in fetchPaymentHistoriessWithPagination:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.fetchPaymentHistoriessWithPaginationNullInvoiceId = fetchPaymentHistoriessWithPaginationNullInvoiceId;
const findAllPaymentHistoriesServicev1 = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield paymentHistory_1.paymentHistoryModel
            .find({})
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findAllPaymentHistoriesService:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllPaymentHistoriesServicev1 = findAllPaymentHistoriesServicev1;
const findAllPaymentHistoriesServiceCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recordsCount = yield paymentHistory_1.paymentHistoryModel.countDocuments({}).exec();
        return recordsCount;
    }
    catch (error) {
        console.error("Error in findAllPaymentHistoriesServiceCount:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllPaymentHistoriesServiceCount = findAllPaymentHistoriesServiceCount;
//PUT
const updatePaymentHistoryByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield paymentHistory_1.paymentHistoryModel
            .findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true })
            .exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updatePaymentHistoryByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updatePaymentHistoryByIDService = updatePaymentHistoryByIDService;
// DELETE
const deletePaymentHistoryByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield paymentHistory_1.paymentHistoryModel
            .findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        })
            .exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deletePaymentHistoryByIDService:", error);
        throw new Error("Failed to delete record");
    }
});
exports.deletePaymentHistoryByIDService = deletePaymentHistoryByIDService;
// updatePaymentHistoryByTransactionIDService
// updatePaymentHistoryByTransactionIDService
const updatePaymentHistoryByTransactionIDService = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecords = yield paymentHistory_1.paymentHistoryModel
            .updateMany({ omiseTransactionID: id }, {
            $set: {
                status,
                updatedAt: new Date(),
            },
        })
            .exec();
        console.log(updatedRecords);
        return updatedRecords;
    }
    catch (error) {
        console.error("Error in updatePaymentHistoryByTransactionIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updatePaymentHistoryByTransactionIDService = updatePaymentHistoryByTransactionIDService;
const findPaymentHistoryByOmiseIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield paymentHistory_1.paymentHistoryModel
            .findOne({ omiseTransactionID: id })
            .exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findPaymentHistoryByOmiseIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findPaymentHistoryByOmiseIDService = findPaymentHistoryByOmiseIDService;
// updatePaymentHistoryInvoiceByIDService
const updatePaymentHistoryInvoiceByIDService = (id, taxinvoiceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let taxinvoiceObjectId = new ObjectId(taxinvoiceId);
        const updatedRecords = yield paymentHistory_1.paymentHistoryModel
            .updateOne({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                taxinvoiceId,
                updatedAt: new Date(),
            },
        })
            .exec();
        console.log(updatedRecords);
        return updatedRecords;
    }
    catch (error) {
        console.error("Error in updatePaymentHistoryInvoiceByIDService:", error);
        throw error;
    }
});
exports.updatePaymentHistoryInvoiceByIDService = updatePaymentHistoryInvoiceByIDService;
// getDataForDashboardService
const fetchPaymentHistoriesForDashboardByUserIDService = (userId, queryCard, queryBank, queryPoint, startDateInput, endDateInput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fields = [];
        if (queryCard)
            fields.push(queryCard);
        if (queryBank)
            fields.push(queryBank);
        if (queryPoint)
            fields.push(queryPoint);
        const startDate = startDateInput || "2024-12-01";
        const endDate = endDateInput || "2090-12-31";
        console.log("startDate: ", startDate);
        console.log("endDate: ", endDate);
        console.log("fields: ", fields);
        const pipeline = [
            {
                $match: {
                    paymentChannel: { $in: fields },
                    user: userId, // Match user ID dynamically
                    createdAt: Object.assign(Object.assign({}, (startDate && { $gte: new Date(startDate) })), (endDate && { $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) }) // Filter by endDate + 1 day
                    )
                }
            },
            {
                $group: {
                    _id: null, // Group all documents into a single group
                    totalCredit: { $sum: "$credit" }, // Sum the "credit" field
                    totalprice: { $sum: "$price" }, // Sum the "price" field
                    totalpromotionCredit: { $sum: "$promotionCredit" } // Sum the "promotionCredit" field
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    totalCredit: 1, // Include the totalCredit field in the result
                    totalprice: 1, // Include the totalprice field in the result
                    totalpromotionCredit: 1 // Include the totalpromotionCredit field in the result
                }
            }
        ];
        console.log("pipeline: ", pipeline);
        // Execute the aggregation pipeline
        const result = yield paymentHistory_1.paymentHistoryModel.aggregate(pipeline);
        if (!result) {
            throw new Error("Failed to retrieve data");
        }
        const formattedResult = result.length > 0 ? result[0] : { totalCredit: 0, totalprice: 0, totalpromotionCredit: 0 };
        return formattedResult;
    }
    catch (error) {
        console.error("Error in fetchPaymentHistoriesForDashboardService:", error);
        throw error;
    }
});
exports.fetchPaymentHistoriesForDashboardByUserIDService = fetchPaymentHistoriesForDashboardByUserIDService;
const fetchPaymentHistoriesForDashboardService = (queryCard, queryBank, queryPoint, startDateInput, endDateInput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fields = [];
        if (queryCard)
            fields.push(queryCard);
        if (queryBank)
            fields.push(queryBank);
        if (queryPoint)
            fields.push(queryPoint);
        const startDate = startDateInput || "2024-12-01";
        const endDate = endDateInput || "2090-12-31";
        console.log("startDate: ", startDate);
        console.log("endDate: ", endDate);
        console.log("fields: ", fields);
        const pipeline = [
            {
                $match: {
                    paymentChannel: { $in: fields },
                    createdAt: Object.assign(Object.assign({}, (startDate && { $gte: new Date(startDate) })), (endDate && { $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) }) // Filter by endDate + 1 day
                    )
                }
            },
            {
                $group: {
                    _id: null, // Group all documents into a single group
                    totalCredit: { $sum: "$credit" }, // Sum the "credit" field
                    totalprice: { $sum: "$price" }, // Sum the "price" field
                    totalpromotionCredit: { $sum: "$promotionCredit" } // Sum the "promotionCredit" field
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    totalCredit: 1, // Include the totalCredit field in the result
                    totalprice: 1, // Include the totalprice field in the result
                    totalpromotionCredit: 1 // Include the totalpromotionCredit field in the result
                }
            }
        ];
        console.log("pipeline: ", pipeline);
        // Execute the aggregation pipeline
        const result = yield paymentHistory_1.paymentHistoryModel.aggregate(pipeline);
        if (!result) {
            throw new Error("Failed to retrieve data");
        }
        const formattedResult = result.length > 0 ? result[0] : { totalCredit: 0, totalprice: 0, totalpromotionCredit: 0 };
        return formattedResult;
    }
    catch (error) {
        console.error("Error in fetchPaymentHistoriesForDashboardService:", error);
        throw error;
    }
});
exports.fetchPaymentHistoriesForDashboardService = fetchPaymentHistoriesForDashboardService;
//create charge payment history
const createdChargePaymentHistoryService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, credit, status, paymentType, chargeStartTime, chargeEndTime, energyImport, chargingStationName, chargerMachineName, chargerTypeName, createdBy, createdByFullName, }) {
    try {
        // // Check if the user already exists
        // const existingPackageName = await PaymentHistory.findOne({ packageName });
        // if (existingPackageName) {
        //     throw '404';
        // }
        // var createdBy = userData.id
        // Create new user
        const newRecord = new paymentHistory_1.paymentHistoryModel({
            user,
            credit,
            status,
            paymentType,
            chargeStartTime,
            chargeEndTime,
            energyImport,
            chargingStationName,
            chargerMachineName,
            chargerTypeName,
            createdBy,
            createdByFullName,
        });
        // Save the user to the database
        const savedRecord = yield newRecord.save();
        // Return the created user without sensitive fields (e.g., pin)
        return savedRecord.toObject({
            versionKey: false,
            transform: (_, ret) => {
                // biome-ignore lint/performance/noDelete: <explanation>
                delete ret.pin;
                return ret;
            },
        });
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw new Error("Error creating Record");
    }
});
exports.createdChargePaymentHistoryService = createdChargePaymentHistoryService;
//create reserve payment history
const createdReservePaymentHistoryService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, credit, status, paymentType, title, detail, createdBy, createdByFullName, }) {
    try {
        const newRecord = new paymentHistory_1.paymentHistoryModel({
            user,
            credit,
            status,
            paymentType,
            title,
            detail,
            createdBy,
            createdByFullName,
        });
        // Save the user to the database
        const savedRecord = yield newRecord.save();
        // Return the created user without sensitive fields (e.g., pin)
        return savedRecord.toObject({
            versionKey: false,
            transform: (_, ret) => {
                // biome-ignore lint/performance/noDelete: <explanation>
                delete ret.pin;
                return ret;
            },
        });
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw new Error("Error creating Record");
    }
});
exports.createdReservePaymentHistoryService = createdReservePaymentHistoryService;
//create fee payment history
const createdFeePaymentHistoryService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, credit, creditFee, durationFee, status, paymentType, title, detail, createdBy, createdByFullName, }) {
    try {
        const newRecord = new paymentHistory_1.paymentHistoryModel({
            user,
            credit,
            creditFee,
            durationFee,
            status,
            paymentType,
            title,
            detail,
            createdBy,
            createdByFullName,
        });
        // Save the user to the database
        const savedRecord = yield newRecord.save();
        // Return the created user without sensitive fields (e.g., pin)
        return savedRecord.toObject({
            versionKey: false,
            transform: (_, ret) => {
                // biome-ignore lint/performance/noDelete: <explanation>
                delete ret.pin;
                return ret;
            },
        });
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw new Error("Error creating Record");
    }
});
exports.createdFeePaymentHistoryService = createdFeePaymentHistoryService;
