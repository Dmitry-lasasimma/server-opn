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
exports.paymentHistoryModel = exports.PaymentTypeEnum = exports.PaymentMethodEnum = exports.PaymentStatusEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["SUCCESS"] = "SUCCESS";
    PaymentStatusEnum["FAILED"] = "FAILED";
    PaymentStatusEnum["PENDING"] = "PENDING";
})(PaymentStatusEnum || (exports.PaymentStatusEnum = PaymentStatusEnum = {}));
var PaymentMethodEnum;
(function (PaymentMethodEnum) {
    PaymentMethodEnum["BANK"] = "BANK";
    PaymentMethodEnum["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethodEnum["PROMPTPAY"] = "PROMPTPAY";
    PaymentMethodEnum["POINT"] = "POINT";
})(PaymentMethodEnum || (exports.PaymentMethodEnum = PaymentMethodEnum = {}));
var PaymentTypeEnum;
(function (PaymentTypeEnum) {
    PaymentTypeEnum["TOPUP"] = "TOPUP";
    PaymentTypeEnum["CHARGE"] = "CHARGE";
    PaymentTypeEnum["FEE"] = "FEE";
    PaymentTypeEnum["RESERVE"] = "RESERVE";
})(PaymentTypeEnum || (exports.PaymentTypeEnum = PaymentTypeEnum = {}));
const PaymentHistorySchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true,
    },
    paymentID: {
        type: String,
        // required: true,
    },
    topupPackage: {
        type: String,
        required: false,
    },
    topupPackageID: {
        type: String,
        required: false,
    },
    credit: {
        type: Number,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    point: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatusEnum),
        default: PaymentStatusEnum.PENDING,
        required: true,
    },
    paymentChannel: {
        type: String,
        enum: Object.values(PaymentMethodEnum),
        // default: PaymentMethodEnum.BANK,
        required: false,
    },
    cardType: {
        type: String,
        required: false,
    },
    cardLast4: {
        type: String,
        required: false,
    },
    stripeTransactionID: {
        type: String,
        required: false,
    },
    omiseTransactionID: {
        type: String,
        required: false,
    },
    stripeTransactionDetail: {
        type: String,
        required: false,
    },
    omiseTransactionDetail: {
        type: String,
        required: false,
    },
    stripeCardID: {
        type: String,
        required: false,
    },
    omiseCardID: {
        type: String,
        required: false,
    },
    transactionID: {
        type: String,
        required: false,
    },
    bankName: {
        type: String,
        required: false,
    },
    bankTransactionDetail: {
        type: String,
        required: false,
    },
    bankMessage: {
        type: String,
        required: false,
    },
    bankCode: {
        type: String,
        required: false,
    },
    destMerchantId: {
        type: String,
        required: false,
    },
    destMerchantName: {
        type: String,
        required: false,
    },
    taxinvoiceId: {
        type: mongoose_1.default.Types.ObjectId,
        required: false,
        default: null,
    },
    taxRate: {
        type: Number,
        required: false,
    },
    taxPrice: {
        type: Number,
        required: false,
    },
    totalPriceWithTax: {
        type: Number,
        required: false,
    },
    paymentType: {
        type: String,
        required: true,
        enum: Object.values(PaymentTypeEnum),
    },
    chargeStartTime: {
        type: Date,
        required: false,
    },
    chargeEndTime: {
        type: Date,
        required: false,
    },
    energyImport: {
        type: Number,
        required: false,
    },
    chargingStationName: {
        type: String,
        required: false,
    },
    chargerMachineName: {
        type: String,
        required: false,
    },
    chargerTypeName: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    detail: {
        type: String,
        required: false,
    },
    durationFee: {
        type: Number,
        required: false,
    },
    creditFee: {
        type: Number,
        required: false,
    },
    remainingCredit: {
        type: Number,
        required: false,
    },
    isPromotion: {
        type: Boolean,
        required: true,
        default: false,
    },
    promotionCredit: {
        type: Number,
        required: false,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: String,
    createdByFullName: String,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: String,
    updatedByFullName: String,
});
exports.paymentHistoryModel = mongoose_1.default.model("PaymentHistory", PaymentHistorySchema);
