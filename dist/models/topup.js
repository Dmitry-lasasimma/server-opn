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
exports.Topup = exports.TopupTypeEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var TopupTypeEnum;
(function (TopupTypeEnum) {
    TopupTypeEnum["NORMAL"] = "NORMAL";
    TopupTypeEnum["PROMOTION"] = "PROMOTION";
})(TopupTypeEnum || (exports.TopupTypeEnum = TopupTypeEnum = {}));
const TopupSchema = new mongoose_1.Schema({
    topupID: {
        type: String,
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    credit: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pointPrice: {
        type: Number,
        required: false,
    },
    type: {
        type: String,
        enum: Object.values(TopupTypeEnum),
        default: TopupTypeEnum.NORMAL,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    point: {
        type: Number,
        required: false,
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
exports.Topup = mongoose_1.default.model("Topup", TopupSchema);
