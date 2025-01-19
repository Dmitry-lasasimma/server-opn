import dotenv from "dotenv";
import {
	type IReservationConfigure,
	ReservationConfigure,
} from "../models/reservationConfigure";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdReservationConfigureService = async (
	credit: number,
	userData: TokenData,
): Promise<IReservationConfigure | null> => {
	try {
		// Create new user
		const newRecord = new ReservationConfigure({
			credit,
			createdBy: userData.id,
			createdByFullName: userData.fullName,
		});

		// Save the user to the database
		const savedRecord = await newRecord.save();

		return savedRecord;
	} catch (error) {
		console.log("Error creating Record: ", error);
		throw error;
	}
};
// GET
export const findReservationConfigureByIDService = async (
	id: string,
): Promise<IReservationConfigure | null> => {
	try {
		const record = await ReservationConfigure.findOne({
			_id: new ObjectId(id),
		}).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findReservationConfigureByIDService:", error);
		throw error;
	}
};
//PUT
export const updateReservationConfigureByIDService = async (
	id: string,
	updateData: {
		credit: number;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await ReservationConfigure.findByIdAndUpdate(
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
		console.error("Error in updateReservationConfigureByIDService:", error);
		throw new Error("Failed to update record");
	}
};
