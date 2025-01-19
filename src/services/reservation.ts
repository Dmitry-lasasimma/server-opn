import dotenv from "dotenv";
import { type IReservation, Reservation } from "../models/reservation";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdReservationService = async (
	user: string,
	chargingStation: string,
	chargerMachine: string,
	startTime: string,
	endTime: string,
	credit: number,
	status: string,
	userData: TokenData,
): Promise<IReservation | null> => {
	try {
		// // Check if already exists
		// const existingRecord = await Reservation.findOne({ user });
		// if (existingRecord) {
		//     throw '404';
		// }
		// var createdBy = userData.id
		// Create new user
		const newRecord = new Reservation({
			user,
			chargingStation,
			chargerMachine,
			startTime,
			endTime,
			credit,
			status,
			createdBy: userData.id,
			createdByFullName: userData.fullName,
		});

		// Save the user to the database
		const savedRecord = await newRecord.save();

		// Return the created user without sensitive fields (e.g., pin)
		return savedRecord.toObject({
			versionKey: false,
			transform: (_, ret) => {
				// biome-ignore lint/performance/noDelete: <explanation>
				delete ret.pin;
				return ret;
			},
		});
	} catch (error) {
		console.log("Error creating Record: ", error);

		throw new Error("Error creating Record");
	}
};
// GET
export const findReservationByIDService = async (
	id: string,
): Promise<IReservation | null> => {
	try {
		const record = await Reservation.findOne({ _id: new ObjectId(id) }).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findReservationByIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};
// GET
export const findReservationsByUserService = async (
	user: string,
	skip: number,
	limit: number,
) => {
	try {
		const userId = new ObjectId(user);
		const records = await Reservation.find({ user: userId }) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findReservationsByUserService:", error);
		throw new Error("Failed to retrieve data ");
	}
};
export const findAllReservationsService = async (
	skip: number,
	limit: number,
) => {
	try {
		const records = await Reservation.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findAllReservationsService:", error);
		throw new Error("Failed to retrieve all data");
	}
};
export const findAllReservationsServiceCount = async () => {
	try {
		const recordsCount = await Reservation.countDocuments({}).exec();

		return recordsCount;
	} catch (error) {
		console.error("Error in findAllReservationsServiceCount:", error);
		throw new Error("Failed to retrieve all data");
	}
};
//PUT
export const updateReservationByIDService = async (
	id: string,
	updateData: {
		user: string;
		chargingStation: string;
		chargerMachine: string;
		startTime: string;
		endTime: string;
		credit: number;
		status: string;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await Reservation.findByIdAndUpdate(
			{ _id: new ObjectId(id) },
			{
				...updateData,
				updatedBy: userData.id,
				updatedByFullName: userData.fullName,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		).exec();

		return updatedRecord;
	} catch (error) {
		console.error("Error in updateReservationByIDService:", error);
		throw new Error("Failed to update record");
	}
};
// DELETE
export const deleteReservationByIDService = async (id: string) => {
	try {
		const deletedRecord = await Reservation.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteReservationByIDService:", error);
		throw new Error("Failed to delete record");
	}
};
