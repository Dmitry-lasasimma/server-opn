import mongoose, { type Document, Schema } from "mongoose";

export interface ICard extends Document {
	cardID: string;
	cardHolderName: string;
	expireMonth: string;
	expireYear: string;
	email: string;
	cvc: string;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const CardSchema: Schema = new Schema({
	cardID: {
		type: String,
		required: true,
	},
	cardHolderName: {
		type: String,
		required: true,
	},
	expireMonth: {
		type: String,
		required: true,
	},
	expireYear: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: false,
	},
	cvc: {
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
		type: String,
		default: null
	},
	createdByFullName: {
		type: String,
		default: null
	},
	updatedBy: {
		type: String,
		default: null
		// ref: 'Staff'
	},
	updatedByFullName: {
		type: String,
		default: null
	},
});

export const Card = mongoose.model<ICard>("Card", CardSchema);
