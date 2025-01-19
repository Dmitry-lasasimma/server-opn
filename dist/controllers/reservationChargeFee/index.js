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
exports.updateReservationChargeFeeByID = exports.getReservationChargeFeeByID = exports.createReservationChargeFee = void 0;
const reservationChargeFee_1 = require("../../services/reservationChargeFee");
const config_1 = require("../../config");
const createReservationChargeFee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minute, credit } = req.body;
        const userToken = req.user;
        const record = yield (0, reservationChargeFee_1.createdReservationChargeFeeService)(minute, credit, userToken);
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
exports.createReservationChargeFee = createReservationChargeFee;
const getReservationChargeFeeByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, reservationChargeFee_1.findReservationChargeFeeByIDService)(id);
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
exports.getReservationChargeFeeByID = getReservationChargeFeeByID;
const updateReservationChargeFeeByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minute, credit } = req.body; // Extract update data from request body
        const id = req.params.id;
        const userToken = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, reservationChargeFee_1.updateReservationChargeFeeByIDService)(id, {
            minute,
            credit,
        }, userToken);
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
exports.updateReservationChargeFeeByID = updateReservationChargeFeeByID;
