import dotenv from "dotenv";
import { type ITaxInvoice, TaxInvoice, TaxInvoiceStatusEnum } from "../models/taxInvoice";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";
import {
	paymentHistoryModel,
} from "../models/paymentHistory";
import {
	IUser,
} from "../models/user";

dotenv.config();

// POST
export const createdTaxInvoiceService = async (
	paymentId: string,
	taxInfo: IUser["taxInfo"],
	userData: TokenData,
): Promise<ITaxInvoice | null> => {
	try {
		const paymentData = await paymentHistoryModel
			.findOne({ _id: new ObjectId(paymentId) })
			.exec();

		if (!paymentData) {
			throw new Error("Invalid payment id");
		}
		// Check if already exists
		const existingRecord = await TaxInvoice.findOne({ paymentId: paymentId });
		if (existingRecord) {
			throw new Error("payment id already exists");
		}
		// console.log("taxData: ", taxInfo);
		// Create new user
		const newRecord = new TaxInvoice({
			user: userData.id,
			paymentId,
			invoiceNumber: paymentData.transactionID,
			status: TaxInvoiceStatusEnum.REQUESTING,
			taxInfo,
			paymentTimeStamp: paymentData.createdAt,
			receivedCredit: paymentData.credit,
			price: paymentData.price,
			topupPackage: paymentData.topupPackage,
			paymentChannel: paymentData.paymentChannel,
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
export const findTaxInvoiceByIDService = async (
	id: string,
): Promise<ITaxInvoice | null> => {
	try {
		const record = await TaxInvoice.findOne({ _id: new ObjectId(id) }).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findTaxInvoiceByIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};
// GET
export const findTaxInvoicesByUserService = async (
	user: string,
	skip: number,
	limit: number,
) => {
	try {
		const userId = new ObjectId(user);
		const records = await TaxInvoice.find({ user: userId }) // Case-insensitive search
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findTaxInvoicesByUserService:", error);
		throw new Error("Failed to retrieve data ");
	}
};
export const findAllTaxInvoicesService = async (
	skip: number,
	limit: number,
) => {
	try {
		const records = await TaxInvoice.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findAllTaxInvoicesService:", error);
		throw new Error("Failed to retrieve all data");
	}
};
export const findAllTaxInvoicesServiceCount = async () => {
	try {
		const recordsCount = await TaxInvoice.countDocuments({}).exec();

		return recordsCount;
	} catch (error) {
		console.error("Error in findAllTaxInvoicesServiceCount:", error);
		throw new Error("Failed to retrieve all data");
	}
};
export const fetchTaxInvoicesWithPagination = async (
	filter: object,
	skip: number,
	limit: number
): Promise<{ taxInvoices: any[]; totalCount: number }> => {
	try {
		const taxInvoices = await TaxInvoice.find(filter)
			.skip(skip)
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();

		const totalCount = await TaxInvoice.countDocuments(filter).exec();
		console.log("totalCount", totalCount)

		return { taxInvoices, totalCount };
	} catch (error) {
		console.error("Error in fetchTaxInvoicesWithPagination:", error);
		throw error;
	}
};
//PUT
export const updateTaxInvoiceByIDService = async (
	id: string,
	updateData: {
		status: string;
		rejectionReason: string;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await TaxInvoice.findByIdAndUpdate(
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
		console.error("Error in updateTaxInvoiceByIDService:", error);
		throw new Error("Failed to update record");
	}
};
// DELETE
export const deleteTaxInvoiceByIDService = async (id: string) => {
	try {
		const deletedRecord = await TaxInvoice.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteTaxInvoiceByIDService:", error);
		throw new Error("Failed to delete record");
	}
};
