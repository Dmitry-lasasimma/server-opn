import mongoose, { type Document, Schema } from "mongoose";

export enum PaymentStatusEnum {
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	PENDING = "PENDING",
}
export enum PaymentMethodEnum {
	BANK = "BANK",
	CREDIT_CARD = "CREDIT_CARD",
	PROMPTPAY = "PROMPTPAY",
	POINT = "POINT",
}
export enum PaymentTypeEnum {
	TOPUP = "TOPUP",
	CHARGE = "CHARGE",
	FEE = "FEE",
	RESERVE = "RESERVE",
}

export interface IPaymentHistory extends Document {
	user: string;
	paymentID: string;
	price: number;
	currency: string;
	status: PaymentStatusEnum;
	paymentChannel: PaymentMethodEnum;
	cardType: string;
	cardLast4: string;
	omiseTransactionID: string;
	omiseTransactionDetail: string;
	omiseCardID: string;
	transactionID: string;
	bankName: string;
	paymentType: PaymentTypeEnum; //new
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
}

const PaymentHistorySchema = new Schema({
	user: {
		type: String,
		required: true,
	},
	paymentID: {
		type: String,
		// required: true,
	},
	price: {
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
	omiseTransactionID: {
		type: String,
		required: false,
	},
	omiseTransactionDetail: {
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
	paymentType: {
		type: String,
		required: true,
		enum: Object.values(PaymentTypeEnum),
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

export const paymentHistoryModel = mongoose.model<IPaymentHistory>(
	"PaymentHistory",
	PaymentHistorySchema,
);
