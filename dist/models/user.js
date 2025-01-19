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
exports.userModel = exports.UserStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["DRIVER"] = "DRIVER";
})(UserRole || (UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["NOT_REGISTER"] = "NOT_REGISTER";
    UserStatus["PENDING"] = "PENDING";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["REJECTED"] = "REJECTED";
    UserStatus["BLOCKED"] = "BLOCKED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: false,
        default: null
    },
    lastName: {
        type: String,
        required: false,
        default: null
    },
    fullName: {
        type: String,
        required: false,
        default: null
    },
    phone: {
        type: String,
        default: null,
        required: false
    },
    email: {
        type: String,
        default: null,
        required: false
    },
    pin: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [UserRole.CUSTOMER, UserRole.DRIVER],
        default: UserRole.CUSTOMER,
        required: true
    },
    profileImage: {
        type: String,
        required: false,
        default: null
    },
    countryCode: {
        type: String,
        required: false,
        default: null
    },
    addresses: [
        {
            village: { type: String, required: false, default: null },
            district: { type: String, required: false, default: null },
            province: { type: String, required: false, default: null }
        }
    ],
    status: {
        type: String,
        enum: [UserStatus.NOT_REGISTER, UserStatus.PENDING, UserStatus.APPROVED, UserStatus.REJECTED, UserStatus.BLOCKED],
        default: UserStatus.NOT_REGISTER,
        required: true
    },
    point: {
        type: Number,
        default: 0
    },
    userID: {
        type: String,
        required: true
    },
    userStripeID: {
        type: String,
        default: null
    },
    userOpnID: {
        type: String,
        default: null
    },
    defaultCard: {
        type: String,
        default: null
    },
    licensePlate: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    blockedAt: {
        type: Date,
        default: null
    },
    blockedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    deviceToken: {
        type: String,
        default: null
    },
    taxInfo: {
        taxUserID: { type: String, required: false, default: null },
        taxName: { type: String, required: false, default: null },
        taxID: { type: String, required: false, default: null },
        taxEmail: { type: String, required: false, default: null },
        taxAddress: { type: String, required: false, default: null },
    }
});
// Password hashing middleware
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('pin'))
            return next();
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.pin = yield bcryptjs_1.default.hash(this.pin, salt);
        next();
    });
});
// Compare passwords
UserSchema.methods.matchPin = function (enteredPin) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPin, this.pin);
    });
};
exports.userModel = mongoose_1.default.model('User', UserSchema);
