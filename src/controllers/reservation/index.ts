import type { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
	createdReservationService,
	findReservationByIDService,
	findReservationsByUserService,
	findAllReservationsService,
	findAllReservationsServiceCount,
	updateReservationByIDService,
	deleteReservationByIDService,
} from "../../services/reservation";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";

export const createReservation = async (req: Request, res: Response) => {
	try {
		const {
			user,
			chargingStation,
			chargerMachine,
			startTime,
			endTime,
			credit,
			status,
		} = req.body;
		const userToken = (req as RequestWithUser).user;
		const record = await createdReservationService(
			user,
			chargingStation,
			chargerMachine,
			startTime,
			endTime,
			credit,
			status,
			userToken,
		);

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
// export const createReservation = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const {
// 			user,
// 			chargingStation,
// 			chargerMachine,
// 			startTime,
// 			endTime,
// 			credit,
// 			status,
// 		} = req.body;

// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({
// 				message: messages.BAD_REQUEST,
// 				details: errors.array().map((err) => ({
// 					detail: err.msg,
// 				})),
// 			});
// 		}
// 		const userToken = req.user; // Safely access 'user'
// 		if (!userToken) {
// 			return res.status(403).json({
// 				message: "User not found or unauthorized",
// 			});
// 		}
// 		const record = await createdReservationService(
// 			user,
// 			chargingStation,
// 			chargerMachine,
// 			startTime,
// 			endTime,
// 			credit,
// 			status,
// 			userToken,
// 		);

// 		return res.status(200).json({
// 			message: "Create record Successful",
// 			record,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		res.status(500).json({
// 			message: messages.INTERNAL_SERVER_ERROR,
// 			detail: (error as Error).message,
// 		});
// 	}
// };

export const getReservationByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const record = await findReservationByIDService(id);

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
// export const getReservationByID = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const { id } = req.query; // Extract the 'id' from the query string
// 		if (!id || typeof id !== "string") {
// 			return res.status(400).json({
// 				message: "Invalid or missing ID in query parameters",
// 				detail: "Please provide a valid ID in the query string.",
// 			});
// 		}

// 		const record = await findReservationByIDService(id);

// 		if (!record) {
// 			return res.status(404).json({
// 				message: messages.NOT_FOUND,
// 				detail: "record not found with this id",
// 			});
// 		}

// 		return res.status(200).json({
// 			message: "Get data successfully",
// 			record,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: messages.INTERNAL_SERVER_ERROR,
// 			detail: (error as Error).message,
// 		});
// 	}
// };

export const getReservations = async (req: Request, res: Response) => {
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
			Data = await findReservationsByUserService(user, parsedSkip, parsedLimit);
			RecordsCount = await findAllReservationsServiceCount();
		} else {
			Data = await findAllReservationsService(parsedSkip, parsedLimit);
			RecordsCount = await findAllReservationsServiceCount();
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
// export const getReservations = async (req: RequestWithUser, res: Response) => {
// 	try {
// 		const { user, skip, limit } = req.query;
// 		// Ensure skip and limit are valid numbers
// 		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
// 		const parsedLimit = Number.parseInt(limit as string, 10) || 10;

// 		// If a question is provided, search by question; otherwise, get all FAQs
// 		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
// 		let Data;
// 		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
// 		let RecordsCount;
// 		if (user && typeof user === "string") {
// 			Data = await findReservationsByUserService(user, parsedSkip, parsedLimit);
// 			RecordsCount = await findAllReservationsServiceCount();
// 		} else {
// 			Data = await findAllReservationsService(parsedSkip, parsedLimit);
// 			RecordsCount = await findAllReservationsServiceCount();
// 		}

// 		if (!Data || Data.length === 0) {
// 			return res.status(404).json({
// 				message: "No Record found",
// 				detail: "No Records match the provided criteria",
// 			});
// 		}

// 		return res.status(200).json({
// 			total: RecordsCount,
// 			message: "Get Records successfully",
// 			Data,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 	}
// };

export const updateReservationByID = async (req: Request, res: Response) => {
	try {
		const {
			user,
			chargingStation,
			chargerMachine,
			startTime,
			endTime,
			credit,
			status,
		} = req.body; // Extract update data from request body
		const id = req.params.id;
		const userToken = (req as RequestWithUser).user;

		// Update the Record via the service function
		const updatedRecord = await updateReservationByIDService(
			id,
			{
				user,
				chargingStation,
				chargerMachine,
				startTime,
				endTime,
				credit,
				status,
			},
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
// export const updateReservationByID = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const {
// 			user,
// 			chargingStation,
// 			chargerMachine,
// 			startTime,
// 			endTime,
// 			credit,
// 			status,
// 		} = req.body; // Extract update data from request body

// 		const { id } = req.query; // Extracting the 'id' from the query string
// 		if (!id || typeof id !== "string") {
// 			return res.status(400).json({
// 				message: "Invalid or missing ID in query parameters",
// 				detail: "Please provide a valid FAQ ID in the query string.",
// 			});
// 		}

// 		const userToken = req.user; // Safely access 'user'
// 		// check user
// 		if (!userToken) {
// 			return res.status(403).json({
// 				message: "User not found or unauthorized",
// 			});
// 		}

// 		// Update the Record via the service function
// 		const updatedRecord = await updateReservationByIDService(
// 			id,
// 			{
// 				user,
// 				chargingStation,
// 				chargerMachine,
// 				startTime,
// 				endTime,
// 				credit,
// 				status,
// 			},
// 			userToken,
// 		);

// 		if (!updatedRecord) {
// 			return res.status(404).json({
// 				message: "Record not found",
// 				detail: `No Record found with the ID ${id}`,
// 			});
// 		}

// 		return res.status(200).json({
// 			message: "Record updated successfully",
// 			updatedRecord,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 	}
// };

export const deleteReservationByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		// Delete the Record via the service function
		const deletedRecord = await deleteReservationByIDService(id);

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
// export const deleteReservationByID = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const { id } = req.query; // Extracting the 'id' from the query string
// 		if (!id || typeof id !== "string") {
// 			return res.status(400).json({
// 				message: "Invalid or missing ID in query parameters",
// 				detail: "Please provide a valid FAQ ID in the query string.",
// 			});
// 		}

// 		const user = req.user; // Safely access 'user'
// 		// Verify Token
// 		if (!user) {
// 			return res.status(403).json({
// 				message: "User not found or unauthorized",
// 			});
// 		}

// 		// Delete the Record via the service function
// 		const deletedRecord = await deleteReservationByIDService(id);

// 		if (!deletedRecord) {
// 			return res.status(404).json({
// 				message: "record not found",
// 				detail: `No record found with the ID ${id}`,
// 			});
// 		}

// 		return res.status(200).json({
// 			message: "record deleted successfully",
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 	}
// };
