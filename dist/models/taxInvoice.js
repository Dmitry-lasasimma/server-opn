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
exports.TaxInvoice = exports.TaxInvoiceStatusEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var TaxInvoiceStatusEnum;
(function (TaxInvoiceStatusEnum) {
    TaxInvoiceStatusEnum["REQUESTING"] = "REQUESTING";
    TaxInvoiceStatusEnum["APPROVED"] = "APPROVED";
    TaxInvoiceStatusEnum["REJECTED"] = "REJECTED";
    TaxInvoiceStatusEnum["CANCELED"] = "COMPLETE";
    TaxInvoiceStatusEnum["NULL"] = "NULL";
})(TaxInvoiceStatusEnum || (exports.TaxInvoiceStatusEnum = TaxInvoiceStatusEnum = {}));
const TaxInvoiceSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    paymentId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(TaxInvoiceStatusEnum),
        default: TaxInvoiceStatusEnum.REQUESTING,
        required: true,
    },
    rejectionReason: {
        type: String,
        required: false,
    },
    taxInfo: {
        taxUserID: { type: String, required: true },
        taxName: { type: String, required: true },
        taxID: { type: String, required: true },
        taxEmail: { type: String, required: true },
        taxAddress: { type: String, required: true },
    },
    paymentTimeStamp: {
        type: Date,
        required: true,
    },
    receivedCredit: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    topupPackage: {
        type: String,
        required: true,
    },
    paymentChannel: {
        type: String,
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
exports.TaxInvoice = mongoose_1.default.model("TaxInvoice", TaxInvoiceSchema);
