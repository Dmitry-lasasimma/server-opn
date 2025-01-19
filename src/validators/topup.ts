import type { Request, Response, NextFunction } from "express";
import { TopupTypeEnum } from "../models/topup";

export const validateCreateTopup = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { packageName, credit, price, type } = req.body;
	const errors: string[] = [];

	// Validate packageName
	if (typeof packageName !== "string" || packageName.trim().length === 0) {
		errors.push("PackageName is required and must be a non-empty string.");
	}

	// Validate credit
	if (typeof credit !== "number" || Number.isNaN(credit)) {
		errors.push("Credit is required and must be a valid number.");
	}

	// Validate price
	if (typeof price !== "number" || Number.isNaN(price)) {
		errors.push("Price is required and must be a valid number.");
	}

	// Validate type
	if (
		typeof type !== "string" ||
		!Object.values(TopupTypeEnum).includes(type as TopupTypeEnum)
	) {
		errors.push(
			`Type is required and must be one of: ${Object.values(TopupTypeEnum).join(", ")}`,
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

export const validateDeleteManyTopup = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { arrayIds } = req.body;
	const errors: string[] = [];

	if (!arrayIds) {
		errors.push("arrayIds is required.");
	}
	// Ensure arrayIds is valid and is an array
	if (!Array.isArray(arrayIds) || arrayIds.length === 0) {
		errors.push("arrayIds is required.");
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