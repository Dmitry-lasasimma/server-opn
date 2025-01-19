import mongoose, { type Document, Schema } from "mongoose";

export enum TaxInvoiceStatusEnum {
	REQUESTING = "REQUESTING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
	CANCELED = "COMPLETE",
	NULL = "NULL",
}

export interface ITaxInvoice extends Document {
	user: mongoose.Types.ObjectId;
	paymentId: mongoose.Types.ObjectId;
	invoiceNumber: string;
	status: TaxInvoiceStatusEnum;
	rejectionReason: string;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
	taxInfo: {
		taxUserID: string;
		taxName: string;
		taxID: string;
		taxEmail: string;
		taxAddress: string;
	};
	paymentTimeStamp: Date;
	receivedCredit: number;
	topupPackage: string;
	paymentChannel: string;
	price: number;
}

const TaxInvoiceSchema: Schema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	paymentId: {
		type: mongoose.Types.ObjectId,
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
		type: mongoose.Schema.Types.ObjectId,
		// ref: 'Staff',
	},
	createdByFullName: {
		type: String,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		// ref: 'Staff'
	},
	updatedByFullName: {
		type: String,
	},
});

export const TaxInvoice = mongoose.model<ITaxInvoice>(
	"TaxInvoice",
	TaxInvoiceSchema,
);
