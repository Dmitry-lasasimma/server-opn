import mongoose, { type Document, Schema } from "mongoose";

export enum ReservationStatusEnum {
	CONFIRMED = "CONFIRMED",
	CANCELED = "CANCELED",
}

export interface IReservation extends Document {
	user: mongoose.Types.ObjectId;
	chargingStation: mongoose.Types.ObjectId;
	chargerMachine: string;
	startTime: string;
	endTime: string;
	credit: number;
	status: ReservationStatusEnum;
	createdAt: Date;
	createdBy: mongoose.Types.ObjectId;
	createdByFullName: string;
	updatedAt: Date;
	updatedBy: mongoose.Types.ObjectId;
	updatedByFullName: string;
}

const ReservationSchema: Schema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	chargingStation: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	chargerMachine: {
		type: String,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: Object.values(ReservationStatusEnum),
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

export const Reservation = mongoose.model<IReservation>(
	"Reservation",
	ReservationSchema,
);
