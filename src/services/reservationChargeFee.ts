import dotenv from "dotenv";
import {
	type IReservationChargeFee,
	ReservationChargeFee,
} from "../models/reservationChargeFee";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdReservationChargeFeeService = async (
	minute: number,
	credit: number,
	userData: TokenData,
): Promise<IReservationChargeFee | null> => {
	try {
		// Create new user
		const newRecord = new ReservationChargeFee({
			minute,
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
export const findReservationChargeFeeByIDService = async (
	id: string,
): Promise<IReservationChargeFee | null> => {
	try {
		const record = await ReservationChargeFee.findOne({
			_id: new ObjectId(id),
		}).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findReservationByIDService:", error);
		throw error;
	}
};
//PUT
export const updateReservationChargeFeeByIDService = async (
	id: string,
	updateData: {
		minute: number;
		credit: number;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await ReservationChargeFee.findByIdAndUpdate(
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
		console.error("Error in updateReservationChargeFeeByIDService:", error);
		throw new Error("Failed to update record");
	}
};
