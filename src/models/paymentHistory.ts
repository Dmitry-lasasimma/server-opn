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
	topupPackage: string;
	topupPackageID: mongoose.Types.ObjectId;
	credit: number;
	price: number;
	point: number;
	currency: string;
	status: PaymentStatusEnum;
	paymentChannel: PaymentMethodEnum;
	cardType: string;
	cardLast4: string;
	stripeTransactionID: string;
	omiseTransactionID: string;
	stripeTransactionDetail: string;
	omiseTransactionDetail: string;
	stripeCardID: string;
	omiseCardID: string;
	transactionID: string;
	bankName: string;
	bankTransactionDetail: string;
	bankMessage: string;
	bankCode: string;
	destMerchantId: string;
	destMerchantName: string;
	taxinvoiceId: mongoose.Types.ObjectId;
	taxRate: number;
	taxPrice: number;
	totalPriceWithTax: number;
	paymentType: PaymentTypeEnum; //new
	chargeStartTime: Date; //new
	chargeEndTime: Date; //new
	energyImport: number; //new
	chargingStationName: string; //new
	chargerMachineName: string; //new
	chargerTypeName: string; //new
	title: string; //new
	detail: string; //new
	durationFee: number; //new
	creditFee: number; //new
	remainingCredit: number; //new
	isPromotion: boolean; //new
	promotionCredit: number; //new
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
		type: mongoose.Types.ObjectId,
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

export const paymentHistoryModel = mongoose.model<IPaymentHistory>(
	"PaymentHistory",
	PaymentHistorySchema,
);
