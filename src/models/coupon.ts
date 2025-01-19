import mongoose, { type Document, Schema } from "mongoose";

export interface CouponCode {
	code: string;
	isUsed: boolean;
}

export interface ICoupon extends Document {
	name: string;
	amount: number;
	point: number;
	startDate: Date;
	endDate: Date;
	couponCodes: CouponCode;
	status: boolean;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const CouponSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	point: {
		type: Number,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	couponCodes: [
		{
			code: String,
			isUsed: {
				type: Boolean,
				default: false,
			},
		},
	],
	status: {
		type: Boolean,
		default: true,
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

export const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);
