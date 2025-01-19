import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";

import {
	createdWalletService,
	findWalletByIDService,
	findWalletByUserService,
	findAllWalletsService,
	findAllWalletsServiceCount,
	updateWalletByIDService,
	deleteWalletByIDService,
	findOneWalletByUserService,
	serverUpdateWalletByIDService,
	aggregateWalletByUserService,
} from "../../services/wallet";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";
import { findUserDataByIdService } from "../../services/user";

export const createWallet = async (req: Request, res: Response) => {
	try {
		const { user, credit } = req.body;
		const userToken = (req as RequestWithUser).user;

		const record = await createdWalletService(user, credit, userToken);

		res.status(200).json({
			message: "Create record Successful",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getWalletByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const record = await findWalletByIDService(id);

		if (!record) {
			res.status(404).json({
				message: messages.NOT_FOUND,
				detail: "record not found with this id",
			});
			return;
		}

		res.status(200).json({
			message: "Get data successfully",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getWallets = async (req: Request, res: Response) => {
	try {
		const { user, skip, limit } = req.query;
		// Ensure skip and limit are valid numbers
		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
		const parsedLimit = Number.parseInt(limit as string, 10) || 10;

		// If a question is provided, search by question; otherwise, get all FAQs
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let Data;
		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let RecordsCount;
		if (user && typeof user === "string") {
			Data = await findWalletByUserService(user, parsedSkip, parsedLimit);
			RecordsCount = await findAllWalletsServiceCount();
		} else {
			Data = await findAllWalletsService(parsedSkip, parsedLimit);
			RecordsCount = await findAllWalletsServiceCount();
		}

		if (!Data || Data.length === 0) {
			res.status(404).json({
				message: "No Record found",
				detail: "No Records match the provided criteria",
			});
			return;
		}

		res.status(200).json({
			total: RecordsCount,
			message: "Get Records successfully",
			Data,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateWalletByID = async (req: Request, res: Response) => {
	try {
		const { user, credit } = req.body; // Extract update data from request body
		const id = req.params.id;
		const userToken = (req as RequestWithUser).user;

		// Update the Record via the service function
		const updatedRecord = await updateWalletByIDService(
			id,
			{ user, credit },
			userToken,
		);

		if (!updatedRecord) {
			res.status(404).json({
				message: "Record not found",
				detail: `No Record found with the ID ${id}`,
			});
			return;
		}

		res.status(200).json({
			message: "Record updated successfully",
			updatedRecord,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

export const deleteWalletByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		// Delete the Record via the service function
		const deletedRecord = await deleteWalletByIDService(id);

		if (!deletedRecord) {
			res.status(404).json({
				message: "record not found",
				detail: `No record found with the ID ${id}`,
			});
			return;
		}

		res.status(200).json({
			message: "record deleted successfully",
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

// new controller
export const getWalletByUser = async (req: Request, res: Response) => {
	try {
		// const id = req.params.id;
		const parsedSkip = Number.parseInt("0" as string, 10) || 0;
		const parsedLimit = Number.parseInt("1" as string, 10) || 10;
		const userToken = (req as RequestWithUser).user;
		console.log("userToken: ", userToken);
		const record = await findWalletByUserService(userToken.id, parsedSkip, parsedLimit);

		if (!record) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "record not found with this id",
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

// server controller
export const getWalletByUserServer = async (req: Request, res: Response) => {
	try {
		const userId: any = req.query.userId;
		const parsedSkip = Number.parseInt("0" as string, 10) || 0;
		const parsedLimit = Number.parseInt("1" as string, 10) || 10;
		const record = await findOneWalletByUserService(userId, parsedSkip, parsedLimit);

		if (!record) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "record not found with this id",
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateWalletByUserServer = async (req: Request, res: Response) => {
	try {
		const { userId, credit } = req.body; // Extract userId and credit from the request body

		// Fetch user data
		const userData: any = await findUserDataByIdService(userId);

		// Fetch wallet data
		const wallet = await findOneWalletByUserService(userId, 0, 1); // Fetch wallet with skip and limit
		if (!wallet) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: "Wallet not found",
				detail: `No wallet record found for userId ${userId}`,
			});
			return;
		}

		// Calculation logic
		let remainingCredit = credit; // The credit amount to deduct
		let updatedDebtCredit = wallet.debtCredit || 0; // Start with current debt credit
		let totalSpent = 0; // Track the total amount spent

		// Deduct from wallet.credit
		if (wallet.credit >= remainingCredit) {
			wallet.credit -= remainingCredit;
			totalSpent += remainingCredit; // Add to total spent
			remainingCredit = 0; // No remaining credit to deduct
		} else {
			totalSpent += wallet.credit; // Add remaining wallet.credit to total spent
			remainingCredit -= wallet.credit; // Deduct what is available in wallet.credit
			wallet.credit = 0; // Wallet credit is fully used
		}

		// Deduct from wallet.pointCredit if there's remaining credit to deduct
		if (remainingCredit > 0) {
			if (wallet.pointCredit >= remainingCredit) {
				wallet.pointCredit -= remainingCredit;
				totalSpent += remainingCredit; // Add to total spent
				remainingCredit = 0; // No remaining credit to deduct
			} else {
				totalSpent += wallet.pointCredit; // Add remaining wallet.pointCredit to total spent
				remainingCredit -= wallet.pointCredit; // Deduct what is available in wallet.pointCredit
				wallet.pointCredit = 0; // Wallet pointCredit is fully used
			}
		}

		// If there's still remaining credit, it becomes debt
		if (remainingCredit > 0) {
			updatedDebtCredit += remainingCredit; // Add remaining credit to debt
			wallet.debtCredit = updatedDebtCredit;
		}

		// Update the spendedCredit field
		// wallet.spendedCredit = (wallet.spendedCredit || 0) + totalSpent;

		// Update the sumCredit field
		wallet.credit = wallet.credit + wallet.pointCredit;

		// Save the updated wallet record
		wallet.updatedBy = userData.id; // Assuming userData contains `id`
		wallet.updatedByFullName = userData.fullName; // Assuming userData contains `fullName`
		wallet.updatedAt = new Date(); // Update the updatedAt timestamp

		const updatedWallet = await serverUpdateWalletByIDService(wallet.id, wallet, userData);

		if (!updatedWallet) {
			res.status(404).json({
				message: "Failed to update wallet",
				detail: `Failed to update wallet for userId ${userId}`,
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Wallet updated successfully",
			updatedWallet,
		});
	} catch (error) {
		console.error("Error in updateWalletByUserService:", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
	}
};

//wallet aggregate
export const getWalletAggregateByUser = async (req: Request, res: Response) => {
	try {
		const userToken = (req as RequestWithUser).user;
		console.log("userToken: ", userToken);


		const userId: ObjectId = new ObjectId(userToken.id);

		const aggregationPipeline = [
			{
				"$match": {
					"user": userId // Match by the user ObjectId
				}
			},
			{
				"$lookup": {
					"from": "paymenthistories", // The collection to join
					"let": { "walletUserId": { "$toString": "$user" } }, // Convert the wallet's ObjectId to a string
					"pipeline": [
						{
							"$match": {
								"$expr": {
									"$eq": ["$user", "$$walletUserId"] // Match the user from paymentHistory with wallet user (converted to string)
								}
							}
						},
						{
							"$match": {
								"$expr": {
									"$in": ["$paymentChannel", ["PROMPTPAY", "CREDIT_CARD", "POINT"]] // Filter by payment channels
								}
							}
						},
						{
							"$match": {
								"status": "SUCCESS" // Filter where status is "SUCCESS"
							}
						},
						{
							"$group": {
								"_id": null,
								"totalCredit": { "$sum": "$credit" } // Sum the 'credit' from paymentHistory
							}
						}
					],
					"as": "paymentHistory"
				}
			},
			{
				"$lookup": {
					"from": "charginghistories", // The charginghistories collection to join
					"let": { "walletUserId": { "$toString": "$user" } }, // Convert wallet's ObjectId to string for comparison
					"pipeline": [
						{
							"$match": {
								"$expr": {
									"$eq": ["$user", "$$walletUserId"] // Match the user from charginghistories with wallet user (converted to string)
								}
							}
						},
						{
							"$match": {
								"status": "COMPLETED" // Filter where status is "COMPLETED"
							}
						},
						{
							"$group": {
								"_id": null,
								"totalChargingCredit": { "$sum": "$credit" } // Sum the 'credit' from charginghistories
							}
						}
					],
					"as": "chargingHistory"
				}
			},
			{
				"$project": {
					"_id": 1,
					"user": 1,
					"credit": 1,
					"totalCredit": {
						"$ifNull": [{ "$arrayElemAt": ["$paymentHistory.totalCredit", 0] }, 0] // Default totalCredit to 0 if no records found in paymentHistory
					},
					"spendedCredit": {
						"$ifNull": [{ "$arrayElemAt": ["$chargingHistory.totalChargingCredit", 0] }, 0] // Default totalChargingCredit to 0 if no records found in charginghistories
					}
				}
			}
		];

		console.log("aggregationPipeline", aggregationPipeline)
		const record = await aggregateWalletByUserService(aggregationPipeline);

		if (!record) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "record not found with this id",
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};



