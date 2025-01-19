import dotenv from "dotenv";
import { type IWallet, Wallet } from "../models/wallet";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createdWalletService = async (
	user: string,
	credit: number,
	userData: TokenData,
): Promise<IWallet | null> => {
	try {
		// Check if already exists
		const existingRecord = await Wallet.findOne({ user });
		if (existingRecord) {
			throw "404";
		}
		// var createdBy = userData.id
		// Create new user
		const newRecord = new Wallet({
			user,
			credit,
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
export const findWalletByIDService = async (
	id: string,
): Promise<IWallet | null> => {
	try {
		const record = await Wallet.findOne({ _id: new ObjectId(id) }).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findWalletByIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};
// GET
export const findWalletByUserService = async (
	user: string,
	skip: number,
	limit: number,
) => {
	try {
		const userId = new ObjectId(user);
		const records = await Wallet.find({ user: userId }) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findWalletsByUserService:", error);
		throw new Error("Failed to retrieve data ");
	}
};
export const findOneWalletByUserService = async (
	user: string,
	skip: number,
	limit: number,
) => {
	try {
		const userId = new ObjectId(user);
		const records = await Wallet.findOne({ user: userId }) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findWalletsByUserService:", error);
		throw new Error("Failed to retrieve data ");
	}
};

export const findAllWalletsService = async (skip: number, limit: number) => {
	try {
		const records = await Wallet.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findAllWalletsService:", error);
		throw new Error("Failed to retrieve all data");
	}
};
export const findAllWalletsServiceCount = async () => {
	try {
		const recordsCount = await Wallet.countDocuments({}).exec();

		return recordsCount;
	} catch (error) {
		console.error("Error in findAllWalletsServiceCount:", error);
		throw new Error("Failed to retrieve all data");
	}
};
//PUT
export const updateWalletByIDService = async (
	id: string,
	updateData: { user: string; credit: number },
	userData: TokenData,
) => {
	try {
		const updatedRecord = await Wallet.findByIdAndUpdate(
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
		console.error("Error in updateWalletByIDService:", error);
		throw new Error("Failed to update record");
	}
};

export const serverUpdateWalletByIDService = async (
	id: string,
	updateData: IWallet,
	userData: TokenData,
) => {
	try {
		const updatedRecord = await Wallet.findByIdAndUpdate(
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
		console.error("Error in updateWalletByIDService:", error);
		throw new Error("Failed to update record");
	}
};
// DELETE
export const deleteWalletByIDService = async (id: string) => {
	try {
		const deletedRecord = await Wallet.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteWalletByIDService:", error);
		throw new Error("Failed to delete record");
	}
};


//debug find wallet by user id
export const findWalletByUserServicev1 = async (
	user: string
) => {
	try {
		const userId = new ObjectId(user);
		const records = await Wallet.find({ user: userId }) // Case-insensitive search
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findWalletByUserServicev1:", error);
		throw new Error("Failed to retrieve data ");
	}
};

//wallet aggregate
export const aggregateWalletByUserService = async (
	aggregationPipeline: any, // Accepts the aggregation pipeline
) => {
	try {
		// console.log('aggregationPipeline', aggregationPipeline)
		const records = await Wallet.aggregate(aggregationPipeline);
		console.log('records', records)
		return records;
	} catch (error) {
		console.error("Error in aggregateWalletByUserService:", error);
		throw new Error("Failed to retrieve data");
	}
};