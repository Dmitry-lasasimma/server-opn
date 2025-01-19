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
exports.deleteManyTopupsService = exports.deleteTopupByIDService = exports.updateTopupByIDService = exports.fetchTopupsWithPagination = exports.findTopupsByPackageService = exports.findTopupByIDService = exports.createdTopupService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const topup_1 = require("../models/topup");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// POST
const createdTopupService = (topupID, packageName, credit, price, pointPrice, type, isAvailable, point, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user already exists
        const existingPackageName = yield topup_1.Topup.findOne({ packageName });
        if (existingPackageName) {
            throw new Error(`NAME_ALREADY_EXISTED`);
            // throw new Error(`A packageName ${packageName} already exists.`);
        }
        // var createdBy = userData.id
        // Create new user
        const newRecord = new topup_1.Topup({
            topupID,
            packageName,
            credit,
            price,
            pointPrice,
            type,
            isAvailable,
            point,
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
exports.createdTopupService = createdTopupService;
// GET
const findTopupByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield topup_1.Topup.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findTopupByIDService:", error);
        throw error;
    }
});
exports.findTopupByIDService = findTopupByIDService;
// GET
const findTopupsByPackageService = (packageName, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield topup_1.Topup.find({
            packageName: { $regex: new RegExp(packageName, "i") },
        }) // Case-insensitive search
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findTopupsByPackageService:", error);
        throw error;
    }
});
exports.findTopupsByPackageService = findTopupsByPackageService;
const fetchTopupsWithPagination = (filter, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topups = yield topup_1.Topup.find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalCount = yield topup_1.Topup.countDocuments(filter).exec();
        return { topups, totalCount };
    }
    catch (error) {
        console.error("Error in fetchTopupsWithPagination:", error);
        throw error;
    }
});
exports.fetchTopupsWithPagination = fetchTopupsWithPagination;
//PUT
const updateTopupByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield topup_1.Topup.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateTopupByIDService:", error);
        throw error;
    }
});
exports.updateTopupByIDService = updateTopupByIDService;
// DELETE
const deleteTopupByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield topup_1.Topup.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deleteTopupByIDService:", error);
        throw error;
    }
});
exports.deleteTopupByIDService = deleteTopupByIDService;
// DELETE MANY
const deleteManyTopupsService = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecords = yield topup_1.Topup.deleteMany({
            _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) },
        }).exec();
        return deletedRecords;
    }
    catch (error) {
        console.error("Error in deleteManyTopupsService:", error);
        throw error;
    }
});
exports.deleteManyTopupsService = deleteManyTopupsService;
