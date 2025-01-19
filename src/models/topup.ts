import mongoose, { type Document, Schema } from "mongoose";

export enum TopupTypeEnum {
	NORMAL = "NORMAL",
	PROMOTION = "PROMOTION",
}

export interface ITopup extends Document {
	topupID: string;
	packageName: string;
	credit: number;
	price: number;
	pointPrice: number;
	type: TopupTypeEnum;
	isAvailable: boolean;
	point: number;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const TopupSchema: Schema = new Schema({
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

export const Topup = mongoose.model<ITopup>("Topup", TopupSchema);
