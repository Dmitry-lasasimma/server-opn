import type { Request, Response } from "express";
import axios from "axios";
import {
	createdTopupService,
	findTopupByIDService,
	updateTopupByIDService,
	deleteTopupByIDService,
	fetchTopupsWithPagination,
	deleteManyTopupsService,
} from "../../services/topup";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";
import { filterTopupFields, generateTopupId } from "./helper";

export const createTopup = async (req: Request, res: Response) => {
	try {
		const user = (req as RequestWithUser).user;
		const { packageName, credit, price, pointPrice, type, isAvailable, point } = req.body;
		const topupID: string = generateTopupId();

		//Create user with Create User Service
		const record = await createdTopupService(
			topupID,
			packageName,
			credit,
			price,
			pointPrice,
			type,
			isAvailable,
			point,
			user,
		);

		// console.log("record?._id", record?._id)
		// let id: string = record?._id?.toString() ?? '';
		if (type === "PROMOTION") {
			// send notification โค้ดโปรโมชั่น ชำระเงินแล้ว…ได้…ยังได้ 10 แต้มอีกด้วย
			console.log("send promotion noti")
			try {
				let notificationBody = {
					id: record?._id,
					title: `Promotion ${packageName}!`,
					detail: `โปรโมชั่น ${packageName} เติมเงิน ${price} THB ได้ ${credit} THB และ ยังได้ ${point} POINT.`,
					type: "PROMOTION",
					platform: "EV",
					recipientRole: "CUSTOMER"
				}
				console.log("notificationBody", notificationBody)
				const response = await axios.post(
					`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications/all-users`,
					notificationBody,
					{
						headers: {
							Authorization: `${req.headers["authorization"]}`,
						},
					},
				);
				console.log("response", response)
				console.log("Notification sent successfully:", response.data);
			} catch (error) {
				console.error("Error sending notification:", error);
				throw error;
			}
		}

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: "Create record Successful",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		if ((error as Error).message === "NAME_ALREADY_EXISTED") {
			res.status(400).json({
				code: messages.NAME_ALREADY_EXISTED.code,
				message: messages.NAME_ALREADY_EXISTED.message,
				detail: (error as Error).message,
			});
			return;
		}
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};


export const getTopupByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const record = await findTopupByIDService(id);

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
			message: "Get data successfully",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getTopups = async (req: Request, res: Response) => {
	try {
		const { skip = "0", limit = "10", ...query } = req.query;
		const parsedSkip = parseInt(skip as string, 10);
		const parsedLimit = parseInt(limit as string, 10);

		// Generate filter object
		const filter = filterTopupFields(query);

		// Fetch topups and count using the reusable function
		const { topups, totalCount } = await fetchTopupsWithPagination(filter, parsedSkip, parsedLimit);

		// Return results
		if (!topups || topups.length === 0) {
			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				message: "No Topup found",
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			total: totalCount,
			topups,
		});
		return;
	} catch (error) {
		console.error("Error fetching topups:", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateTopupByID = async (req: Request, res: Response) => {
	try {
		const { packageName, credit, price, pointPrice, type, isAvailable, point } = req.body; // Extract update data from request body
		const id = req.params.id;
		const user = (req as RequestWithUser).user;
		// Update the Record via the service function
		const updatedRecord = await updateTopupByIDService(
			id,
			{ packageName, credit, price, pointPrice, type, isAvailable, point },
			user,
		);

		if (!updatedRecord) {
			res.status(200).json({
				code: messages.NOT_FOUND.code,
				message: "Record not found",
				detail: `No Record found with the ID ${id}`,
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Record updated successfully",
			updatedRecord,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const deleteManyTopups = async (req: Request, res: Response) => {
	try {
		const { arrayIds } = req.body;
		// Ensure arrayIds is valid and is an array
		if (!Array.isArray(arrayIds) || arrayIds.length === 0) {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: "Invalid or empty array of IDs",
			});
			return;
		}

		// Delete the Records via the service function
		const deletedRecord = await deleteManyTopupsService(arrayIds);

		// If no records were deleted, return a 404 response
		if (deletedRecord.deletedCount === 0) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: "No records found with the provided IDs",
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Records deleted successfully",
			deletedCount: deletedRecord.deletedCount,
		});
	} catch (error) {
		console.error("Error in deleteManyTopups:", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};
