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
exports.aggregateWalletByUserService = exports.findWalletByUserServicev1 = exports.deleteWalletByIDService = exports.serverUpdateWalletByIDService = exports.updateWalletByIDService = exports.findAllWalletsServiceCount = exports.findAllWalletsService = exports.findOneWalletByUserService = exports.findWalletByUserService = exports.findWalletByIDService = exports.createdWalletService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const wallet_1 = require("../models/wallet");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// POST
const createdWalletService = (user, credit, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if already exists
        const existingRecord = yield wallet_1.Wallet.findOne({ user });
        if (existingRecord) {
            throw "404";
        }
        // var createdBy = userData.id
        // Create new user
        const newRecord = new wallet_1.Wallet({
            user,
            credit,
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
        throw new Error("Error creating Record");
    }
});
exports.createdWalletService = createdWalletService;
// GET
const findWalletByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield wallet_1.Wallet.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findWalletByIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findWalletByIDService = findWalletByIDService;
// GET
const findWalletByUserService = (user, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(user);
        const records = yield wallet_1.Wallet.find({ user: userId }) // Case-insensitive search
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findWalletsByUserService:", error);
        throw new Error("Failed to retrieve data ");
    }
});
exports.findWalletByUserService = findWalletByUserService;
const findOneWalletByUserService = (user, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(user);
        const records = yield wallet_1.Wallet.findOne({ user: userId }) // Case-insensitive search
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findWalletsByUserService:", error);
        throw new Error("Failed to retrieve data ");
    }
});
exports.findOneWalletByUserService = findOneWalletByUserService;
const findAllWalletsService = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield wallet_1.Wallet.find({})
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findAllWalletsService:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllWalletsService = findAllWalletsService;
const findAllWalletsServiceCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recordsCount = yield wallet_1.Wallet.countDocuments({}).exec();
        return recordsCount;
    }
    catch (error) {
        console.error("Error in findAllWalletsServiceCount:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllWalletsServiceCount = findAllWalletsServiceCount;
//PUT
const updateWalletByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield wallet_1.Wallet.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateWalletByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updateWalletByIDService = updateWalletByIDService;
const serverUpdateWalletByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield wallet_1.Wallet.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateWalletByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.serverUpdateWalletByIDService = serverUpdateWalletByIDService;
// DELETE
const deleteWalletByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield wallet_1.Wallet.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deleteWalletByIDService:", error);
        throw new Error("Failed to delete record");
    }
});
exports.deleteWalletByIDService = deleteWalletByIDService;
//debug find wallet by user id
const findWalletByUserServicev1 = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(user);
        const records = yield wallet_1.Wallet.find({ user: userId }) // Case-insensitive search
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findWalletByUserServicev1:", error);
        throw new Error("Failed to retrieve data ");
    }
});
exports.findWalletByUserServicev1 = findWalletByUserServicev1;
//wallet aggregate
const aggregateWalletByUserService = (aggregationPipeline) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('aggregationPipeline', aggregationPipeline)
        const records = yield wallet_1.Wallet.aggregate(aggregationPipeline);
        console.log('records', records);
        return records;
    }
    catch (error) {
        console.error("Error in aggregateWalletByUserService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.aggregateWalletByUserService = aggregateWalletByUserService;
