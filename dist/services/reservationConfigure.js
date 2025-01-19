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
exports.updateReservationConfigureByIDService = exports.findReservationConfigureByIDService = exports.createdReservationConfigureService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const reservationConfigure_1 = require("../models/reservationConfigure");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// POST
const createdReservationConfigureService = (credit, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create new user
        const newRecord = new reservationConfigure_1.ReservationConfigure({
            credit,
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
exports.createdReservationConfigureService = createdReservationConfigureService;
// GET
const findReservationConfigureByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield reservationConfigure_1.ReservationConfigure.findOne({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findReservationConfigureByIDService:", error);
        throw error;
    }
});
exports.findReservationConfigureByIDService = findReservationConfigureByIDService;
//PUT
const updateReservationConfigureByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield reservationConfigure_1.ReservationConfigure.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateReservationConfigureByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updateReservationConfigureByIDService = updateReservationConfigureByIDService;
