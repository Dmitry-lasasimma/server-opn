import { check } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { messages } from "../config";

export const userLoginValidator = [
	check("email")
		.isEmail()
		.withMessage("Please provide a valid email")
		.isLength({ min: 6 })
		.withMessage("Email must be at least 4 characters long"),
	check("pin")
		.isLength({ min: 6 })
		.withMessage("Pin must be at least 6 characters long"),
];


export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
	const { email, pin } = req.body;

	if (!email) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST,
			detail: "Missing required field: email",
		});
		return;
	}

	if (!pin && pin.length < 6) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST,
			detail: "Missing required field: Pin or numbers long less then 6 digits",
		});
		return;
	}

	next();
}
// validate login with phone number
export const validateLoginPhone = (req: Request, res: Response, next: NextFunction): void => {
	const { countryCode, phone, pin } = req.body;

	if (!countryCode) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: countryCode",
		});
		return;
	}
	if (!phone) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: phone",
		});
		return;
	}

	if (!pin && pin.length < 6) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: Pin or numbers long less then 6 digits",
		});
		return;
	}

	next();
}

export const validateVerifyRefreshToken = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { refreshToken } = req.body;

	if (typeof refreshToken !== "string" || refreshToken.trim().length === 0) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: refreshToken",
		})
		return;
	}

	next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction): void => {
	const { email, pin } = req.body;

	if (!email) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: email",
		});
		return;
	}

	if (!pin || pin.length < 6) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: Pin or numbers long less then 6 digits",
		});
		return;
	}

	next();
}

//use phone number to reset password
export const validatePhoneResetPassword = (req: Request, res: Response, next: NextFunction): void => {
	const { phone, pin } = req.body;

	if (!phone) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: phone",
		});
		return;
	}

	if (!pin || pin.length < 6) {
		res.status(400).json({
			code: messages.BAD_REQUEST.code,
			message: messages.BAD_REQUEST.message,
			detail: "Missing required field: Pin or numbers long less then 6 digits",
		});
		return;
	}

	next();
}