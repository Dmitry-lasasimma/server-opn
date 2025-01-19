import dotenv from "dotenv";
import { type ITopup, Topup } from "../models/topup";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdTopupService = async (
	topupID: string,
	packageName: string,
	credit: number,
	price: number,
	pointPrice: number,
	type: string,
	isAvailable: boolean,
	point: number,
	userData: TokenData,
): Promise<ITopup | null> => {
	try {
		// Check if the user already exists
		const existingPackageName = await Topup.findOne({ packageName });
		if (existingPackageName) {
			throw new Error(`NAME_ALREADY_EXISTED`);
			// throw new Error(`A packageName ${packageName} already exists.`);
		}
		// var createdBy = userData.id
		// Create new user
		const newRecord = new Topup({
			topupID,
			packageName,
			credit,
			price,
			pointPrice,
			type,
			isAvailable,
			point,
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

		throw error;
	}
};
// GET
export const findTopupByIDService = async (
	id: string,
): Promise<ITopup | null> => {
	try {
		const record = await Topup.findOne({ _id: new ObjectId(id) }).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findTopupByIDService:", error);
		throw error;
	}
};
// GET
export const findTopupsByPackageService = async (
	packageName: string,
	skip: number,
	limit: number,
) => {
	try {
		const records = await Topup.find({
			packageName: { $regex: new RegExp(packageName, "i") },
		}) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findTopupsByPackageService:", error);
		throw error;
	}
};

export const fetchTopupsWithPagination = async (
	filter: object,
	skip: number,
	limit: number
): Promise<{ topups: any[]; totalCount: number }> => {
	try {
		const topups = await Topup.find(filter)
			.skip(skip)
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();

		const totalCount = await Topup.countDocuments(filter).exec();

		return { topups, totalCount };
	} catch (error) {
		console.error("Error in fetchTopupsWithPagination:", error);
		throw error;
	}
};

//PUT
export const updateTopupByIDService = async (
	id: string,
	updateData: {
		packageName: string;
		credit: number;
		price: number;
		pointPrice: number;
		type: number;
		isAvailable: boolean;
		point: number;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await Topup.findByIdAndUpdate(
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
		console.error("Error in updateTopupByIDService:", error);
		throw error;
	}
};
// DELETE
export const deleteTopupByIDService = async (id: string) => {
	try {
		const deletedRecord = await Topup.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteTopupByIDService:", error);
		throw error;
	}
};
// DELETE MANY
export const deleteManyTopupsService = async (ids: string[]) => {
	try {
		const deletedRecords = await Topup.deleteMany({
			_id: { $in: ids.map((id) => new ObjectId(id)) },
		}).exec();
		return deletedRecords;
	} catch (error) {
		console.error("Error in deleteManyTopupsService:", error);
		throw error;
	}
};
