import mongoose, { type Document, Schema } from "mongoose";

export interface IWallet extends Document {
	user: mongoose.Types.ObjectId;
	credit: number;
	moneyCredit: number; //new
	pointCredit: number; //new
	debtCredit: number;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const WalletSchema: Schema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	credit: {
		type: Number,
		default: 0,
		required: true,
	},
	pointCredit: {
		type: Number,
		default: 0,
		required: true,
	},
	moneyCredit: {
		type: Number,
		default: 0,
		required: true,
	},
	debtCredit: {
		type: Number,
		default: 0,
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

export const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);
