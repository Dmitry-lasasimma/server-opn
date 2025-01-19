"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.ReservationStatusEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ReservationStatusEnum;
(function (ReservationStatusEnum) {
    ReservationStatusEnum["CONFIRMED"] = "CONFIRMED";
    ReservationStatusEnum["CANCELED"] = "CANCELED";
})(ReservationStatusEnum || (exports.ReservationStatusEnum = ReservationStatusEnum = {}));
const ReservationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    chargingStation: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    chargerMachine: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ReservationStatusEnum),
        required: true,
    },
    credit: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        // ref: 'Staff',
    },
    createdByFullName: {
        type: String,
    },
    updatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        // ref: 'Staff'
    },
    updatedByFullName: {
        type: String,
    },
});
exports.Reservation = mongoose_1.default.model("Reservation", ReservationSchema);
