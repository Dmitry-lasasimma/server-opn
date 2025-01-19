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
exports.updatePaymentMethodsService = exports.deleteManyPaymentMethodsService = exports.deletePaymentMethodByIDService = exports.updatePaymentMethodByIDService = exports.fetchPaymentMethodsWithPagination = exports.findPaymentMethodByIDService = exports.createPaymentMethodService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const paymentMethod_1 = require("../models/paymentMethod");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// POST
const createPaymentMethodService = (name, status, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user already exists
        const existingName = yield paymentMethod_1.PaymentMethod.findOne({ name });
        if (existingName) {
            throw new Error(`A name ${name} already exists.`);
        }
        const newRecord = new paymentMethod_1.PaymentMethod({
            name,
            status,
            createdBy: userData.id,
            createdByFullName: userData.fullName,
        });
        // Save the user to the database
        const savedRecord = yield newRecord.save();
        return savedRecord;
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw error;
    }
});
exports.createPaymentMethodService = createPaymentMethodService;
// GET
const findPaymentMethodByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield paymentMethod_1.PaymentMethod.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findPaymentMethodByIDService:", error);
        throw error;
    }
});
exports.findPaymentMethodByIDService = findPaymentMethodByIDService;
const fetchPaymentMethodsWithPagination = (filter, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethods = yield paymentMethod_1.PaymentMethod.find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalCount = yield paymentMethod_1.PaymentMethod.countDocuments(filter).exec();
        return { paymentMethods, totalCount };
    }
    catch (error) {
        console.error("Error in fetchPaymentMethodsWithPagination:", error);
        throw error;
    }
});
exports.fetchPaymentMethodsWithPagination = fetchPaymentMethodsWithPagination;
//PUT
const updatePaymentMethodByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield paymentMethod_1.PaymentMethod.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updatePaymentMethodByIDService:", error);
        throw error;
    }
});
exports.updatePaymentMethodByIDService = updatePaymentMethodByIDService;
// DELETE
const deletePaymentMethodByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield paymentMethod_1.PaymentMethod.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deletePaymentMethodByIDService:", error);
        throw error;
    }
});
exports.deletePaymentMethodByIDService = deletePaymentMethodByIDService;
// DELETE MANY
const deleteManyPaymentMethodsService = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecords = yield paymentMethod_1.PaymentMethod.deleteMany({
            _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) },
        }).exec();
        return deletedRecords;
    }
    catch (error) {
        console.error("Error in deleteManyPaymentMethodsService:", error);
        throw error;
    }
});
exports.deleteManyPaymentMethodsService = deleteManyPaymentMethodsService;
// UPDATE MANY
const updatePaymentMethodsService = (updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = {};
        let updateResult;
        // Determine if this is a single or bulk update
        // if (id) {
        //     filter = { _id: new ObjectId(id) }; // Update a single record by ID
        // }
        // Perform the update
        updateResult = yield paymentMethod_1.PaymentMethod.updateMany(filter, {
            $set: Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }),
        }, { new: true, runValidators: true } // Ensure validation and updated document return
        ).exec();
        return updateResult;
    }
    catch (error) {
        console.error("Error in updatePaymentMethodsService:", error);
        throw error;
    }
});
exports.updatePaymentMethodsService = updatePaymentMethodsService;
