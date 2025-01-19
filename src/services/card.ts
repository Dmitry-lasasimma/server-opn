import dotenv from "dotenv";
import { type ICard, Card } from "../models/card";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// GET
export const findCardByIDService = async (
	id: string,
): Promise<ICard | null> => {
	try {
		const record = await Card.findOne({ _id: new ObjectId(id) }).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findCardByIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};
// GET
export const findCardsByCreatedByService = async (
	createdBy: string,
	skip: number,
	limit: number,
) => {
	try {
		const userId = new ObjectId(createdBy);
		const records = await Card.find({
			createdBy: userId,
		}) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findCardsByCreatedByService:", error);
		throw new Error("Failed to retrieve data ");
	}
};
export const findAllCardsService = async (skip: number, limit: number) => {
	try {
		const records = await Card.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findAllCardsService:", error);
		throw new Error("Failed to retrieve all data");
	}
};
export const findAllCardsServiceCount = async () => {
	try {
		const recordsCount = await Card.countDocuments({}).exec();

		return recordsCount;
	} catch (error) {
		console.error("Error in findAllCardsServiceCount:", error);
		throw new Error("Failed to retrieve all data");
	}
};
//PUT
export const updateCardByIDService = async (
	id: string,
	updateData: {
		cardID: string;
		cardHolderName: string;
		expireMonth: number;
		expireYear: string;
		email: string;
		cvc: string;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await Card.findByIdAndUpdate(
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
		console.error("Error in updateCardByIDService:", error);
		throw new Error("Failed to update record");
	}
};
// DELETE
export const deleteCardByIDService = async (id: string) => {
	try {
		const deletedRecord = await Card.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteCardByIDService:", error);
		throw new Error("Failed to delete record");
	}
};
