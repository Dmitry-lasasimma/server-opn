import dotenv from "dotenv";
import {
	type IPaymentHistory,
	paymentHistoryModel,
} from "../models/paymentHistory";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";
import mongoose, { type Document, Schema } from "mongoose";

dotenv.config();

// POST
export const createdPaymentHistoryService = async (

	{ user,
		paymentID,
		topupPackage,
		topupPackageID,
		credit,
		remainingCredit,
		isPromotion,
		promotionCredit,
		price,
		point,
		currency,
		status,
		paymentType,
		paymentChannel,
		cardType,
		cardLast4,
		omiseTransactionID,
		omiseTransactionDetail,
		omiseCardID,
		transactionID,
		bankName,
		bankTransactionDetail,
		bankMessage,
		bankCode,
		destMerchantId,
		destMerchantName,
		taxRate,
		taxPrice,
		totalPriceWithTax,
		createdBy,
		createdByFullName,

	}:
		{
			user: string,
			paymentID?: string,
			topupPackage: string,
			topupPackageID: string,
			credit: number,
			remainingCredit: number,
			isPromotion: boolean,
			promotionCredit: number,
			price: number,
			point: number,
			currency?: string,
			status: string,
			paymentType: string,
			paymentChannel: string,
			cardType?: string,
			cardLast4?: string,
			omiseTransactionID?: string,
			omiseTransactionDetail?: string,
			omiseCardID?: string,
			transactionID: string,
			bankName?: string,
			bankTransactionDetail?: string,
			bankMessage?: string,
			bankCode?: string,
			destMerchantId?: string,
			destMerchantName?: string,
			taxRate?: number,
			taxPrice?: number,
			totalPriceWithTax?: number,
			createdBy: string,
			createdByFullName: string,
		}
): Promise<IPaymentHistory | null> => {
	try {
		// // Check if the user already exists
		// const existingPackageName = await PaymentHistory.findOne({ packageName });
		// if (existingPackageName) {
		//     throw '404';
		// }
		// var createdBy = userData.id
		// Create new user
		const newRecord = new paymentHistoryModel({
			user,
			paymentID,
			topupPackage,
			topupPackageID,
			credit,
			remainingCredit,
			isPromotion,
			promotionCredit,
			price,
			point,
			currency,
			status,
			paymentType,
			paymentChannel,
			cardType,
			cardLast4,
			omiseTransactionID,
			omiseTransactionDetail,
			omiseCardID,
			transactionID,
			bankName,
			bankTransactionDetail,
			bankMessage,
			bankCode,
			destMerchantId,
			destMerchantName,
			taxRate,
			taxPrice,
			totalPriceWithTax,
			createdBy,
			createdByFullName,
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
export const findPaymentHistoryByIDService = async (
	id: string,
): Promise<IPaymentHistory | null> => {
	try {
		const record = await paymentHistoryModel
			.findOne({ _id: new ObjectId(id) })
			.populate({
				path: 'taxinvoiceId',
				model: 'TaxInvoice',
				select: 'status',
			})
			.exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findPaymentHistoryByIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};
// GET
// export const findPaymentHistoriesByPackageService = async (
//   packageName: string,
//   skip: number,
//   limit: number
// ) => {
//   try {
//     const records = await Topup.find({
//       packageName: { $regex: new RegExp(packageName, "i") },
//     }) // Case-insensitive search
//       .skip(skip) // Skip the specified number of records
//       .limit(limit) // Limit the number of records returned
//       .select("-__v")
//       .exec();

//     return records;
//   } catch (error) {
//     console.error("Error in findTopupsByPackageService:", error);
//     throw new Error("Failed to retrieve data by question");
//   }
// };
export const fetchPaymentHistoriesWithPagination = async (
	filter: object,
	skip: number,
	limit: number
): Promise<{ payments: any[]; totalCount: number }> => {
	try {
		const payments = await paymentHistoryModel
			.find(filter)
			.skip(skip)
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
		const totalCount = await paymentHistoryModel.countDocuments(filter).exec();

		return { payments, totalCount };
	} catch (error) {
		console.error("Error in fetchPaymentHistoriessWithPagination:", error);
		throw new Error("Failed to retrieve all data");
	}
};
//Get paymentHistories with populate taxInvoices
export const fetchPaymentHistoriesPopulateTaxinvoicesWithPagination = async (
	filter: object,
	taxInvoiceStatus: string,
	skip: number,
	limit: number
): Promise<{ payments: any[]; totalCount: number }> => {
	try {
		const payments = await paymentHistoryModel
			.find(filter)
			.skip(skip)
			.sort({ createdAt: -1 })
			.limit(limit)
			.populate({
				path: 'taxinvoiceId',
				model: 'TaxInvoice',
				select: 'status',
				match: { status: taxInvoiceStatus }, // Replace 'desiredStatus' with the actual status you want to filter by
			})
			.exec();
		const totalCount = await paymentHistoryModel.countDocuments(filter).exec();
		if (taxInvoiceStatus !== "") {
			// Optionally filter out payments where taxinvoiceId is null
			const filteredPayments = payments.filter(payment => payment.taxinvoiceId !== null);
			return { payments: filteredPayments, totalCount: filteredPayments.length };
		}

		return { payments, totalCount };
	} catch (error) {
		console.error("Error in fetchPaymentHistoriessWithPagination:", error);
		throw new Error("Failed to retrieve all data");
	}
};
//Get paymentHistories for query taxInvoice=null
export const fetchPaymentHistoriessWithPaginationNullInvoiceId = async (
	filter: object,
	skip: number,
	limit: number
): Promise<{ payments: any[]; totalCount: number }> => {
	try {
		const payments = await paymentHistoryModel
			.find(filter)
			.skip(skip)
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
		const totalCount = await paymentHistoryModel.countDocuments(filter).exec();

		return { payments, totalCount };
	} catch (error) {
		console.error("Error in fetchPaymentHistoriessWithPagination:", error);
		throw new Error("Failed to retrieve all data");
	}
};

export const findAllPaymentHistoriesServicev1 = async (
	skip: number,
	limit: number,
) => {
	try {
		const records = await paymentHistoryModel
			.find({})
			.skip(skip) // Skip the specified number of records
			.limit(limit) // Limit the number of records returned
			.select("-__v")
			.exec();

		return records;
	} catch (error) {
		console.error("Error in findAllPaymentHistoriesService:", error);
		throw new Error("Failed to retrieve all data");
	}
};
export const findAllPaymentHistoriesServiceCount = async () => {
	try {
		const recordsCount = await paymentHistoryModel.countDocuments({}).exec();

		return recordsCount;
	} catch (error) {
		console.error("Error in findAllPaymentHistoriesServiceCount:", error);
		throw new Error("Failed to retrieve all data");
	}
};
//PUT
export const updatePaymentHistoryByIDService = async (
	id: string,
	updateData: {
		user: string;
		topupPackage: string;
		topupPackageID: string;
		credit: number;
		price: number;
		status: string;
		paymentMethod: string;
		cardType: string;
		cardLast4: string;
		stripeTransactionID: string;
		stripeTransactionDetail: string;
		stripeCardID: string;
		transactionID: string;
		bankName: string;
		bankTransactionDetail: string;
		bankMessage: string;
		bankCode: string;
		destMerchantId: string;
		destMerchantName: string;
		taxRate: number;
		taxPrice: number;
		totalPriceWithTax: number;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await paymentHistoryModel
			.findByIdAndUpdate(
				{ _id: new ObjectId(id) },
				{
					...updateData,
					updatedBy: userData.id,
					updatedByFullName: userData.fullName,
					updatedAt: new Date(),
				}, // Update fields and set updatedBy and updatedAt
				{ new: true, runValidators: true }, // Return the updated document and run validation on updates
			)
			.exec();

		return updatedRecord;
	} catch (error) {
		console.error("Error in updatePaymentHistoryByIDService:", error);
		throw new Error("Failed to update record");
	}
};
// DELETE
export const deletePaymentHistoryByIDService = async (id: string) => {
	try {
		const deletedRecord = await paymentHistoryModel
			.findByIdAndDelete({
				_id: new ObjectId(id),
			})
			.exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deletePaymentHistoryByIDService:", error);
		throw new Error("Failed to delete record");
	}
};
// updatePaymentHistoryByTransactionIDService


// updatePaymentHistoryByTransactionIDService
export const updatePaymentHistoryByTransactionIDService = async (
	id: string,
	status: string,
) => {
	try {
		const updatedRecords = await paymentHistoryModel
			.updateMany(
				{ omiseTransactionID: id },
				{
					$set: {
						status,
						updatedAt: new Date(),
					},
				}, // Update fields and set updatedBy and updatedAt
			)
			.exec();

		console.log(updatedRecords);

		return updatedRecords;
	} catch (error) {
		console.error("Error in updatePaymentHistoryByTransactionIDService:", error);
		throw new Error("Failed to update record");
	}
};

export const findPaymentHistoryByOmiseIDService = async (
	id: string,
): Promise<IPaymentHistory | null> => {
	try {
		const record = await paymentHistoryModel
			.findOne({ omiseTransactionID: id })
			.exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findPaymentHistoryByOmiseIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};

// updatePaymentHistoryInvoiceByIDService
export const updatePaymentHistoryInvoiceByIDService = async (
	id: string,
	taxinvoiceId: mongoose.Types.ObjectId,
) => {
	try {
		// let taxinvoiceObjectId = new ObjectId(taxinvoiceId);
		const updatedRecords = await paymentHistoryModel
			.updateOne(
				{ _id: new ObjectId(id) },
				{
					$set: {
						taxinvoiceId,
						updatedAt: new Date(),
					},
				}, // Update fields and set updatedBy and updatedAt
			)
			.exec();

		console.log(updatedRecords);

		return updatedRecords;
	} catch (error) {
		console.error("Error in updatePaymentHistoryInvoiceByIDService:", error);
		throw error;
	}
};

// getDataForDashboardService
export const fetchPaymentHistoriesForDashboardByUserIDService = async (
	userId: string,
	queryCard: string | any,
	queryBank: string | any,
	queryPoint: string | any,
	startDateInput: string | any,
	endDateInput: string | any,
) => {
	try {
		const fields: string[] = [];
		if (queryCard) fields.push(queryCard);
		if (queryBank) fields.push(queryBank);
		if (queryPoint) fields.push(queryPoint);

		const startDate = startDateInput || "2024-12-01";
		const endDate = endDateInput || "2090-12-31";

		console.log("startDate: ", startDate);
		console.log("endDate: ", endDate);

		console.log("fields: ", fields);

		const pipeline = [
			{
				$match: {
					paymentChannel: { $in: fields },
					user: userId, // Match user ID dynamically
					createdAt: {
						...(startDate && { $gte: new Date(startDate) }), // Filter by startDate if provided
						...(endDate && { $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) }) // Filter by endDate + 1 day
					}
				}
			},
			{
				$group: {
					_id: null, // Group all documents into a single group
					totalCredit: { $sum: "$credit" }, // Sum the "credit" field
					totalprice: { $sum: "$price" }, // Sum the "price" field
					totalpromotionCredit: { $sum: "$promotionCredit" } // Sum the "promotionCredit" field
				}
			},
			{
				$project: {
					_id: 0, // Exclude the _id field
					totalCredit: 1, // Include the totalCredit field in the result
					totalprice: 1, // Include the totalprice field in the result
					totalpromotionCredit: 1 // Include the totalpromotionCredit field in the result
				}
			}
		];

		console.log("pipeline: ", pipeline);

		// Execute the aggregation pipeline
		const result = await paymentHistoryModel.aggregate(pipeline);

		if (!result) {
			throw new Error("Failed to retrieve data");
		}
		const formattedResult = result.length > 0 ? result[0] : { totalCredit: 0, totalprice: 0, totalpromotionCredit: 0 };

		return formattedResult;
	} catch (error) {
		console.error("Error in fetchPaymentHistoriesForDashboardService:", error);
		throw error;
	}
};
export const fetchPaymentHistoriesForDashboardService = async (
	queryCard: string | any,
	queryBank: string | any,
	queryPoint: string | any,
	startDateInput: string | any,
	endDateInput: string | any,
) => {
	try {
		const fields: string[] = [];
		if (queryCard) fields.push(queryCard);
		if (queryBank) fields.push(queryBank);
		if (queryPoint) fields.push(queryPoint);

		const startDate = startDateInput || "2024-12-01";
		const endDate = endDateInput || "2090-12-31";

		console.log("startDate: ", startDate);
		console.log("endDate: ", endDate);

		console.log("fields: ", fields);

		const pipeline = [
			{
				$match: {
					paymentChannel: { $in: fields },
					createdAt: {
						...(startDate && { $gte: new Date(startDate) }), // Filter by startDate if provided
						...(endDate && { $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) }) // Filter by endDate + 1 day
					}
				}
			},
			{
				$group: {
					_id: null, // Group all documents into a single group
					totalCredit: { $sum: "$credit" }, // Sum the "credit" field
					totalprice: { $sum: "$price" }, // Sum the "price" field
					totalpromotionCredit: { $sum: "$promotionCredit" } // Sum the "promotionCredit" field
				}
			},
			{
				$project: {
					_id: 0, // Exclude the _id field
					totalCredit: 1, // Include the totalCredit field in the result
					totalprice: 1, // Include the totalprice field in the result
					totalpromotionCredit: 1 // Include the totalpromotionCredit field in the result
				}
			}
		];

		console.log("pipeline: ", pipeline);

		// Execute the aggregation pipeline
		const result = await paymentHistoryModel.aggregate(pipeline);

		if (!result) {
			throw new Error("Failed to retrieve data");
		}
		const formattedResult = result.length > 0 ? result[0] : { totalCredit: 0, totalprice: 0, totalpromotionCredit: 0 };

		return formattedResult;
	} catch (error) {
		console.error("Error in fetchPaymentHistoriesForDashboardService:", error);
		throw error;
	}
};

//create charge payment history
export const createdChargePaymentHistoryService = async (

	{
		user,
		credit,
		status,
		paymentType,
		chargeStartTime,
		chargeEndTime,
		energyImport,
		chargingStationName,
		chargerMachineName,
		chargerTypeName,
		createdBy,
		createdByFullName,
	}:
		{
			user: string,
			credit: number,
			status: string,
			paymentType: string,
			chargeStartTime: Date,
			chargeEndTime: Date,
			energyImport: number,
			chargingStationName: string,
			chargerMachineName: string,
			chargerTypeName: string,
			createdBy: string,
			createdByFullName: string,
		}
): Promise<IPaymentHistory | null> => {
	try {
		// // Check if the user already exists
		// const existingPackageName = await PaymentHistory.findOne({ packageName });
		// if (existingPackageName) {
		//     throw '404';
		// }
		// var createdBy = userData.id
		// Create new user
		const newRecord = new paymentHistoryModel({
			user,
			credit,
			status,
			paymentType,
			chargeStartTime,
			chargeEndTime,
			energyImport,
			chargingStationName,
			chargerMachineName,
			chargerTypeName,
			createdBy,
			createdByFullName,
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
//create reserve payment history
export const createdReservePaymentHistoryService = async (

	{
		user,
		credit,
		status,
		paymentType,
		title,
		detail,
		createdBy,
		createdByFullName,
	}:
		{
			user: string,
			credit: number,
			status: string,
			paymentType: string,
			title: string,
			detail: string,
			createdBy: string,
			createdByFullName: string,
		}
): Promise<IPaymentHistory | null> => {
	try {
		const newRecord = new paymentHistoryModel({
			user,
			credit,
			status,
			paymentType,
			title,
			detail,
			createdBy,
			createdByFullName,
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
//create fee payment history
export const createdFeePaymentHistoryService = async (

	{
		user,
		credit,
		creditFee,
		durationFee,
		status,
		paymentType,
		title,
		detail,
		createdBy,
		createdByFullName,
	}:
		{
			user: string,
			credit: number,
			creditFee: number,
			durationFee: number,
			status: string,
			paymentType: string,
			title: string,
			detail: string,
			createdBy: string,
			createdByFullName: string,
		}
): Promise<IPaymentHistory | null> => {
	try {
		const newRecord = new paymentHistoryModel({
			user,
			credit,
			creditFee,
			durationFee,
			status,
			paymentType,
			title,
			detail,
			createdBy,
			createdByFullName,
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