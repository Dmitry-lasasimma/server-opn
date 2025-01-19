import mongoose, { type Document, Schema } from "mongoose";

export interface IPaymentMethod extends Document {
    name: string;
    status: boolean;
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
    createdByFullName: string;
    updatedAt: Date;
    updatedBy: mongoose.Types.ObjectId;
    updatedByFullName: string;
}

const PaymentMethodSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
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
        type: mongoose.Schema.Types.ObjectId,
    },
    createdByFullName: {
        type: String,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    updatedByFullName: {
        type: String,
    },
});

export const PaymentMethod = mongoose.model<IPaymentMethod>(
    "PaymentMethod",
    PaymentMethodSchema,
);
