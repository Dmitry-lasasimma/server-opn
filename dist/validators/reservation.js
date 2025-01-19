"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParamID = exports.validateCreateReservation = void 0;
const reservation_1 = require("../models/reservation");
const validateCreateReservation = (req, res, next) => {
    // const { user, payment, invoiceNumber, status } = req.body;
    const { user, chargingStation, chargerMachine, startTime, endTime, credit, status, } = req.body;
    const errors = [];
    // Validate user
    if (typeof user !== "string" || user.trim().length === 0) {
        errors.push("User is required and must be a non-empty string.");
    }
    // Validate chargingStation
    if (typeof chargingStation !== "string" ||
        chargingStation.trim().length === 0) {
        errors.push("ChargingStation is required and must be a non-empty string.");
    }
    // // Validate user
    // if (!mongoose.Types.ObjectId.isValid(user)) {
    // 	errors.push("User must be a valid ObjectId.");
    // }
    // // Validate chargingStation
    // if (!mongoose.Types.ObjectId.isValid(chargingStation)) {
    // 	errors.push("ChargingStation must be a valid ObjectId.");
    // }
    // Validate chargerMachine
    if (typeof chargerMachine !== "string" ||
        chargerMachine.trim().length === 0) {
        errors.push("ChargerMachine is required and must be a non-empty string.");
    }
    // Validate startTime
    if (typeof startTime !== "string" || startTime.trim().length === 0) {
        errors.push("StartTime is required and must be a non-empty string.");
    }
    // Validate endTime
    if (typeof endTime !== "string" || endTime.trim().length === 0) {
        errors.push("EndTime is required and must be a non-empty string.");
    }
    // Validate credit
    if (typeof credit !== "number" || Number.isNaN(credit)) {
        errors.push("Credit is required and must be a valid number.");
    }
    // Validate status
    if (typeof status !== "string" ||
        !Object.values(reservation_1.ReservationStatusEnum).includes(status)) {
        errors.push(`Status is required and must be one of: ${Object.values(reservation_1.ReservationStatusEnum).join(", ")}`);
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateCreateReservation = validateCreateReservation;
const validateParamID = (req, res, next) => {
    // const { question, answer } = req.body;
    const errors = [];
    const id = req.params.id;
    // const { id } = req.query; // Extracting the 'id' from the query string
    if (!id || typeof id !== "string") {
        errors.push("Please provide a valid ID in the query.");
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }
    next();
};
exports.validateParamID = validateParamID;
