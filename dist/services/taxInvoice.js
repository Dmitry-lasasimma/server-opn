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
exports.deleteTaxInvoiceByIDService = exports.updateTaxInvoiceByIDService = exports.fetchTaxInvoicesWithPagination = exports.findAllTaxInvoicesServiceCount = exports.findAllTaxInvoicesService = exports.findTaxInvoicesByUserService = exports.findTaxInvoiceByIDService = exports.createdTaxInvoiceService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const taxInvoice_1 = require("../models/taxInvoice");
const mongodb_1 = require("mongodb");
const paymentHistory_1 = require("../models/paymentHistory");
dotenv_1.default.config();
// POST
const createdTaxInvoiceService = (paymentId, taxInfo, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = yield paymentHistory_1.paymentHistoryModel
            .findOne({ _id: new mongodb_1.ObjectId(paymentId) })
            .exec();
        if (!paymentData) {
            throw new Error("Invalid payment id");
        }
        // Check if already exists
        const existingRecord = yield taxInvoice_1.TaxInvoice.findOne({ paymentId: paymentId });
        if (existingRecord) {
            throw new Error("payment id already exists");
        }
        // console.log("taxData: ", taxInfo);
        // Create new user
        const newRecord = new taxInvoice_1.TaxInvoice({
            user: userData.id,
            paymentId,
            invoiceNumber: paymentData.transactionID,
            status: taxInvoice_1.TaxInvoiceStatusEnum.REQUESTING,
            taxInfo,
            paymentTimeStamp: paymentData.createdAt,
            receivedCredit: paymentData.credit,
            price: paymentData.price,
            topupPackage: paymentData.topupPackage,
            paymentChannel: paymentData.paymentChannel,
            createdBy: userData.id,
            createdByFullName: userData.fullName,
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
        throw error;
    }
});
exports.createdTaxInvoiceService = createdTaxInvoiceService;
// GET
const findTaxInvoiceByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield taxInvoice_1.TaxInvoice.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findTaxInvoiceByIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findTaxInvoiceByIDService = findTaxInvoiceByIDService;
// GET
const findTaxInvoicesByUserService = (user, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(user);
        const records = yield taxInvoice_1.TaxInvoice.find({ user: userId }) // Case-insensitive search
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findTaxInvoicesByUserService:", error);
        throw new Error("Failed to retrieve data ");
    }
});
exports.findTaxInvoicesByUserService = findTaxInvoicesByUserService;
const findAllTaxInvoicesService = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield taxInvoice_1.TaxInvoice.find({})
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findAllTaxInvoicesService:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllTaxInvoicesService = findAllTaxInvoicesService;
const findAllTaxInvoicesServiceCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recordsCount = yield taxInvoice_1.TaxInvoice.countDocuments({}).exec();
        return recordsCount;
    }
    catch (error) {
        console.error("Error in findAllTaxInvoicesServiceCount:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllTaxInvoicesServiceCount = findAllTaxInvoicesServiceCount;
const fetchTaxInvoicesWithPagination = (filter, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taxInvoices = yield taxInvoice_1.TaxInvoice.find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalCount = yield taxInvoice_1.TaxInvoice.countDocuments(filter).exec();
        console.log("totalCount", totalCount);
        return { taxInvoices, totalCount };
    }
    catch (error) {
        console.error("Error in fetchTaxInvoicesWithPagination:", error);
        throw error;
    }
});
exports.fetchTaxInvoicesWithPagination = fetchTaxInvoicesWithPagination;
//PUT
const updateTaxInvoiceByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield taxInvoice_1.TaxInvoice.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateTaxInvoiceByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updateTaxInvoiceByIDService = updateTaxInvoiceByIDService;
// DELETE
const deleteTaxInvoiceByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield taxInvoice_1.TaxInvoice.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deleteTaxInvoiceByIDService:", error);
        throw new Error("Failed to delete record");
    }
});
exports.deleteTaxInvoiceByIDService = deleteTaxInvoiceByIDService;
