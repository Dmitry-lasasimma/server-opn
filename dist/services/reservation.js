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
exports.deleteReservationByIDService = exports.updateReservationByIDService = exports.findAllReservationsServiceCount = exports.findAllReservationsService = exports.findReservationsByUserService = exports.findReservationByIDService = exports.createdReservationService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const reservation_1 = require("../models/reservation");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// POST
const createdReservationService = (user, chargingStation, chargerMachine, startTime, endTime, credit, status, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // // Check if already exists
        // const existingRecord = await Reservation.findOne({ user });
        // if (existingRecord) {
        //     throw '404';
        // }
        // var createdBy = userData.id
        // Create new user
        const newRecord = new reservation_1.Reservation({
            user,
            chargingStation,
            chargerMachine,
            startTime,
            endTime,
            credit,
            status,
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
exports.createdReservationService = createdReservationService;
// GET
const findReservationByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield reservation_1.Reservation.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findReservationByIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findReservationByIDService = findReservationByIDService;
// GET
const findReservationsByUserService = (user, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(user);
        const records = yield reservation_1.Reservation.find({ user: userId }) // Case-insensitive search
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findReservationsByUserService:", error);
        throw new Error("Failed to retrieve data ");
    }
});
exports.findReservationsByUserService = findReservationsByUserService;
const findAllReservationsService = (skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield reservation_1.Reservation.find({})
            .skip(skip) // Skip the specified number of records
            .limit(limit) // Limit the number of records returned
            .select("-__v")
            .exec();
        return records;
    }
    catch (error) {
        console.error("Error in findAllReservationsService:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllReservationsService = findAllReservationsService;
const findAllReservationsServiceCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recordsCount = yield reservation_1.Reservation.countDocuments({}).exec();
        return recordsCount;
    }
    catch (error) {
        console.error("Error in findAllReservationsServiceCount:", error);
        throw new Error("Failed to retrieve all data");
    }
});
exports.findAllReservationsServiceCount = findAllReservationsServiceCount;
//PUT
const updateReservationByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield reservation_1.Reservation.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateReservationByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updateReservationByIDService = updateReservationByIDService;
// DELETE
const deleteReservationByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield reservation_1.Reservation.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deleteReservationByIDService:", error);
        throw new Error("Failed to delete record");
    }
});
exports.deleteReservationByIDService = deleteReservationByIDService;
