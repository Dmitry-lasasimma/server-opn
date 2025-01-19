import mongoose, { type Document, Schema } from "mongoose";

export interface IReservationConfigure extends Document {
	credit: number;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const ReservationConfigureSchema: Schema = new Schema({
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

export const ReservationConfigure = mongoose.model<IReservationConfigure>(
	"ReservationConfigure",
	ReservationConfigureSchema,
);
