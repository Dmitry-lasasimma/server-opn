import mongoose, { type Document, Schema } from "mongoose";

export interface IReservationChargeFee extends Document {
	minute: number;
	credit: number;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const ReservationChargeFeeSchema: Schema = new Schema({
	minute: {
		type: Number,
		required: true,
	},
	credit: {
		type: Number,
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

export const ReservationChargeFee = mongoose.model<IReservationChargeFee>(
	"ReservationChargeFee",
	ReservationChargeFeeSchema,
);
