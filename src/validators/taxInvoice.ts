import type { Request, Response, NextFunction } from "express";
import { TaxInvoiceStatusEnum } from "../models/taxInvoice";

export const validateCreateTaxInvoice = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { paymentId } = req.body;
	const errors: string[] = [];

	// Validate payment
	if (typeof paymentId !== "string" || paymentId.trim().length === 0) {
		errors.push("paymentId is required and must be a non-empty string.");
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
