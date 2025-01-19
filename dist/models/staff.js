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
exports.staffModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var StaffRole;
(function (StaffRole) {
    StaffRole["EV_ADMIN"] = "EV_ADMIN";
    StaffRole["EV_MANAGER"] = "EV_MANAGER";
    StaffRole["EV_STAFF"] = "EV_STAFF";
})(StaffRole || (StaffRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["NOT_REGISTER"] = "NOT_REGISTER";
    UserStatus["PENDING"] = "PENDING";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["REJECTED"] = "REJECTED";
    UserStatus["BLOCKED"] = "BLOCKED";
})(UserStatus || (UserStatus = {}));
const StaffSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    fullName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(StaffRole),
        default: StaffRole.EV_STAFF,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.APPROVED
    },
    profileImage: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    phone: {
        type: String,
        default: null
    },
    userID: {
        type: String,
        required: true
    }
});
exports.staffModel = mongoose_1.default.model('Staff', StaffSchema);
