import type { Request, Response, NextFunction } from "express";
import { ReservationStatusEnum } from "../models/reservation";

export const validateCreateReservation = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// const { user, payment, invoiceNumber, status } = req.body;
	const {
		user,
		chargingStation,
		chargerMachine,
		startTime,
		endTime,
		credit,
		status,
	} = req.body;
	const errors: string[] = [];

	// Validate user
	if (typeof user !== "string" || user.trim().length === 0) {
		errors.push("User is required and must be a non-empty string.");
	}
	// Validate chargingStation
	if (
		typeof chargingStation !== "string" ||
		chargingStation.trim().length === 0
	) {
		errors.push("ChargingStation is required and must be a non-empty string.");
	}

	// // Validate user
	// if (!mongoose.Types.ObjectId.isValid(user)) {
	// 	errors.push("User must be a valid ObjectId.");
	// }
	// // Validate chargingStation
	// if (!mongoose.Types.ObjectId.isValid(chargingStation)) {
	// 	errors.push("ChargingStation must be a valid ObjectId.");
	// }

	// Validate chargerMachine
	if (
		typeof chargerMachine !== "string" ||
		chargerMachine.trim().length === 0
	) {
		errors.push("ChargerMachine is required and must be a non-empty string.");
	}
	// Validate startTime
	if (typeof startTime !== "string" || startTime.trim().length === 0) {
		errors.push("StartTime is required and must be a non-empty string.");
	}
	// Validate endTime
	if (typeof endTime !== "string" || endTime.trim().length === 0) {
		errors.push("EndTime is required and must be a non-empty string.");
	}
	// Validate credit
	if (typeof credit !== "number" || Number.isNaN(credit)) {
		errors.push("Credit is required and must be a valid number.");
	}
	// Validate status
	if (
		typeof status !== "string" ||
		!Object.values(ReservationStatusEnum).includes(
			status as ReservationStatusEnum,
		)
	) {
		errors.push(
			`Status is required and must be one of: ${Object.values(ReservationStatusEnum).join(", ")}`,
		);
	}

	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			errors,
		});
		return;
	}

	next();
};
export const validateParamID = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// const { question, answer } = req.body;
	const errors: string[] = [];
	const id = req.params.id;
	// const { id } = req.query; // Extracting the 'id' from the query string
	if (!id || typeof id !== "string") {
		errors.push("Please provide a valid ID in the query.");
	}
	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			errors,
		});
		return;
	}

	next();
};
