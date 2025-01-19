import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

enum UserRole {
    CUSTOMER = 'CUSTOMER',
    DRIVER = 'DRIVER'
}

export enum UserStatus {
    NOT_REGISTER = 'NOT_REGISTER',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    BLOCKED = 'BLOCKED'
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    username: string;
    pin: string;
    licensePlate: string;
    role: UserRole;
    profileImage: string;
    countryCode: string;
    addresses: {
        village: string;
        district: string;
        province: string;
    }[];
    status: UserStatus;
    point: number;
    userID: string;
    userStripeID: string;
    userOpnID: string;
    defaultCard: string;
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
    updatedAt: Date;
    updatedBy: mongoose.Types.ObjectId;
    blockedAt: Date;
    blockedBy: mongoose.Types.ObjectId;
    matchPin(enteredPin: string): Promise<boolean>;
    deviceToken: string;
    taxInfo: {
        taxUserID: string;
        taxName: string;
        taxID: string;
        taxEmail: string;
        taxAddress: string;
    };
}

const UserSchema: Schema = new Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blockedAt: {
        type: Date,
        default: null
    },
    blockedBy: {
        type: mongoose.Schema.Types.ObjectId,
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
UserSchema.pre('save', async function (next) {
    if (!this.isModified('pin')) return next();

    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin as string, salt);

    next();
});

// Compare passwords
UserSchema.methods.matchPin = async function (enteredPin: string): Promise<boolean> {
    return await bcrypt.compare(enteredPin, this.pin);
};

export const userModel = mongoose.model<IUser>('User', UserSchema);

