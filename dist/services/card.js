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
exports.deleteCardByIDService = exports.updateCardByIDService = exports.findAllCardsServiceCount = exports.findAllCardsService = exports.findCardsByCreatedByService = exports.findCardByIDService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const card_1 = require("../models/card");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// GET
const findCardByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield card_1.Card.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findCardByIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findCardByIDService = findCardByIDService;
// GET
const findCardsByCreatedByService = (createdBy, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(createdBy);
        const records = yield card_1.Card.find({
            createdBy: userId,
        }) // Case-insensitive search
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findCardsByCreatedByService:", error);
        throw new Error("Failed to retrieve data ");
    }
});
exports.findCardsByCreatedByService = findCardsByCreatedByService;
const findAllCardsService = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield card_1.Card.find({})
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findAllCardsService:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllCardsService = findAllCardsService;
const findAllCardsServiceCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recordsCount = yield card_1.Card.countDocuments({}).exec();
        return recordsCount;
    }
    catch (error) {
        console.error("Error in findAllCardsServiceCount:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllCardsServiceCount = findAllCardsServiceCount;
//PUT
const updateCardByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield card_1.Card.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateCardByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updateCardByIDService = updateCardByIDService;
// DELETE
const deleteCardByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield card_1.Card.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deleteCardByIDService:", error);
        throw new Error("Failed to delete record");
    }
});
exports.deleteCardByIDService = deleteCardByIDService;
