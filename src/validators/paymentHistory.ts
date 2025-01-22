import type { Request, Response, NextFunction } from "express";
import { PaymentStatusEnum, PaymentMethodEnum, PaymentTypeEnum } from "../models/paymentHistory";
import { messages } from "../config";

export const validateCreateCard = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// const { cardToken } = req.body;
	const { cardName, cardCity, cardPostalCode, cardNumber, cardSecurityCode, cardExpirationMonth, cardExpirationYear } = req.body;
	const errors: string[] = [];

	// if (!cardToken) {
	// 	errors.push("CardToken is required.");
	// }

	if (!cardName) {
		errors.push("Card name is required.");
	}

	// if (!cardCity) {
	// 	errors.push("Card city is required.");
	// }

	// if (!cardPostalCode) {
	// 	errors.push("Card postal code is required.");
	// }

	if (!cardNumber) {
		errors.push("Card number is required.");
	}

	if (!cardSecurityCode) {
		errors.push("Card security code is required.");
	}

	if (!cardExpirationMonth) {
		errors.push("Card expiration month is required.");
	}

	if (!cardExpirationYear) {
		errors.push("Card expiration year is required.");
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

export const validateCreatePaymentWithStripe = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { stripeCardId, price, topupPackage, credit } = req.body;

	if (!stripeCardId) {
		res.status(400).json({
			message: messages.BAD_REQUEST,
			detail: "Missing required fields: stripeCardId",
		});
		return;
	}

	if (!price) {
		res.status(400).json({
			message: messages.BAD_REQUEST,
			detail: "Missing required fields: price",
		});
		return;
	}

	if (!topupPackage) {
		res.status(400).json({
			message: messages.BAD_REQUEST,
			detail: "Missing required fields: topupPackage",
		});
		return;
	}

	if (!credit) {
		res.status(400).json({
			message: messages.BAD_REQUEST,
			detail: "Missing required fields: credit",
		});
		return;
	}

	next();
};

export const validateCreatePaymentHistory = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const {
		user,
		paymentID,
		topupPackage,
		credit,
		price,
		status,
		paymentMethod,
		cardType,
		cardLast4,
		stripeTransactionID,
		stripeTransactionDetail,
		stripeCardID,
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
	} = req.body;
	const errors: string[] = [];

	if (typeof user !== "string" || user.trim().length === 0) {
		errors.push("User is required and must be a non-empty string.");
	}
	if (typeof paymentID !== "string" || paymentID.trim().length === 0) {
		errors.push("PaymentID is required and must be a non-empty string.");
	}
	if (typeof topupPackage !== "string" || topupPackage.trim().length === 0) {
		errors.push("TopupPackage is required and must be a non-empty string.");
	}
	// Validate credit
	if (typeof credit !== "number" || Number.isNaN(credit)) {
		errors.push("Credit is required and must be a valid number.");
	}
	// Validate price
	if (typeof price !== "number" || Number.isNaN(price)) {
		errors.push("Price is required and must be a valid number.");
	}
	// Validate status
	if (
		typeof status !== "string" ||
		!Object.values(PaymentStatusEnum).includes(status as PaymentStatusEnum)
	) {
		errors.push(
			`Status is required and must be one of: ${Object.values(PaymentStatusEnum).join(", ")}`,
		);
	}
	// Validate paymentMethod
	if (
		typeof paymentMethod !== "string" ||
		!Object.values(PaymentMethodEnum).includes(
			paymentMethod as PaymentMethodEnum,
		)
	) {
		errors.push(
			`PaymentMethod is required and must be one of: ${Object.values(PaymentMethodEnum).join(", ")}`,
		);
	}
	// Validate cardType
	if (typeof cardType !== "string" || cardType.trim().length === 0) {
		errors.push("CardType is required and must be a non-empty string.");
	}
	// Validate cardLast4
	if (typeof cardLast4 !== "string" || cardLast4.trim().length === 0) {
		errors.push("CardLast4 is required and must be a non-empty string.");
	}
	// Validate stripeTransactionID
	if (
		typeof stripeTransactionID !== "string" ||
		stripeTransactionID.trim().length === 0
	) {
		errors.push(
			"StripeTransactionID is required and must be a non-empty string.",
		);
	}
	// Validate stripeTransactionDetail
	if (
		typeof stripeTransactionDetail !== "string" ||
		stripeTransactionDetail.trim().length === 0
	) {
		errors.push(
			"stripeTransactionDetail is required and must be a non-empty string.",
		);
	}
	// Validate stripeCardID
	if (typeof stripeCardID !== "string" || stripeCardID.trim().length === 0) {
		errors.push("stripeCardID is required and must be a non-empty string.");
	}
	// Validate transactionID
	if (typeof transactionID !== "string" || transactionID.trim().length === 0) {
		errors.push("transactionID is required and must be a non-empty string.");
	}
	// Validate bankName
	if (typeof bankName !== "string" || bankName.trim().length === 0) {
		errors.push("bankName is required and must be a non-empty string.");
	}
	// Validate bankTransactionDetail
	if (
		typeof bankTransactionDetail !== "string" ||
		bankTransactionDetail.trim().length === 0
	) {
		errors.push(
			"bankTransactionDetail is required and must be a non-empty string.",
		);
	}
	// Validate bankMessage
	if (typeof bankMessage !== "string" || bankMessage.trim().length === 0) {
		errors.push("bankMessage is required and must be a non-empty string.");
	}
	// Validate bankCode
	if (typeof bankCode !== "string" || bankCode.trim().length === 0) {
		errors.push("bankCode is required and must be a non-empty string.");
	}
	// Validate destMerchantId
	if (
		typeof destMerchantId !== "string" ||
		destMerchantId.trim().length === 0
	) {
		errors.push("destMerchantId is required and must be a non-empty string.");
	}
	// Validate destMerchantName
	if (
		typeof destMerchantName !== "string" ||
		destMerchantName.trim().length === 0
	) {
		errors.push("destMerchantName is required and must be a non-empty string.");
	}
	// Validate taxRate
	if (typeof taxRate !== "number" || Number.isNaN(taxRate)) {
		errors.push("taxRate is required and must be a valid number.");
	}
	// Validate taxPrice
	if (typeof taxPrice !== "number" || Number.isNaN(taxPrice)) {
		errors.push("taxPrice is required and must be a valid number.");
	}
	// Validate totalPriceWithTax
	if (
		typeof totalPriceWithTax !== "number" ||
		Number.isNaN(totalPriceWithTax)
	) {
		errors.push("totalPriceWithTax is required and must be a valid number.");
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

//OMISE validate payment
export const validateCreatePaymentWithOmise = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const { currency, price } = req.body;

	if (!currency) {
		res.status(400).json({
			message: messages.BAD_REQUEST,
			detail: "Missing required fields: currency",
		});
		return;
	}

	if (!price) {
		res.status(400).json({
			message: messages.BAD_REQUEST,
			detail: "Missing required fields: price",
		});
		return;
	}

	next();
};

//ChargePayment validate
export const validateCreateChargePaymentHistory = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const {
		credit,
		status,
		paymentType,
		chargeStartTime,
		chargeEndTime,
		energyImport,
		chargingStationName,
		chargerMachineName,
		chargerTypeName,
	} = req.body;
	const errors: string[] = [];

	// Validate user
	// if (typeof user !== "string" || user.trim().length === 0) {
	// 	errors.push("User is required and must be a non-empty string.");
	// }
	// Validate credit
	// if (typeof credit !== "number" || Number.isNaN(credit)) {
	// 	errors.push("Credit is required and must be a valid number.");
	// }
	// Validate credit
	if (typeof credit !== "number" || Number.isNaN(credit)) {
		errors.push("credit is required and must be a valid number.");
	}
	// Validate status
	// if (
	// 	typeof status !== "string" ||
	// 	!Object.values(PaymentStatusEnum).includes(status as PaymentStatusEnum)
	// ) {
	// 	errors.push(
	// 		`Status is required and must be one of: ${Object.values(PaymentStatusEnum).join(", ")}`,
	// 	);
	// }
	// Validate paymentType
	// if (
	// 	typeof paymentType !== "string" ||
	// 	!Object.values(PaymentTypeEnum).includes(
	// 		paymentType as PaymentTypeEnum,
	// 	)
	// ) {
	// 	errors.push(
	// 		`paymentType is required and must be one of: ${Object.values(PaymentTypeEnum).join(", ")}`,
	// 	);
	// }
	// Validate chargeStartTime
	if (typeof chargeStartTime !== "string" || chargeStartTime.trim().length === 0) {
		errors.push("chargeStartTime is required and must be a non-empty string.");
	}
	// Validate chargeEndTime
	if (typeof chargeEndTime !== "string" || chargeEndTime.trim().length === 0) {
		errors.push("chargeEndTime is required and must be a non-empty string.");
	}
	// Validate energyImport
	if (typeof energyImport !== "number" || Number.isNaN(energyImport)) {
		errors.push("energyImport is required and must be a valid number.");
	}
	// Validate chargingStationName
	if (typeof chargingStationName !== "string" || chargingStationName.trim().length === 0) {
		errors.push("chargingStationName is required and must be a non-empty string.");
	}
	// Validate chargerMachineName
	if (typeof chargerMachineName !== "string" || chargerMachineName.trim().length === 0) {
		errors.push("chargerMachineName is required and must be a non-empty string.");
	}
	// Validate chargerTypeName
	if (typeof chargerTypeName !== "string" || chargerTypeName.trim().length === 0) {
		errors.push("chargerTypeName is required and must be a non-empty string.");
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

// Reserve payment validate
export const validateCreateReservePaymentHistory = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const {
		credit,
		// title,
		// detail,
	} = req.body;
	const errors: string[] = [];

	// Validate credit
	if (typeof credit !== "number" || Number.isNaN(credit)) {
		errors.push("Price is required and must be a valid number.");
	}
	// // Validate title
	// if (typeof title !== "string" || title.trim().length === 0) {
	// 	errors.push("title is required and must be a non-empty string.");
	// }
	// // Validate detail
	// if (typeof detail !== "string" || detail.trim().length === 0) {
	// 	errors.push("detail is required and must be a non-empty string.");
	// }
	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			errors,
		});
		return;
	}

	next();
};

// Fee payment validate
export const validateCreateFeePaymentHistory = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const {
		creditFee,
		durationFee,
	} = req.body;
	const errors: string[] = [];

	// Validate creditFee
	if (typeof creditFee !== "number" || Number.isNaN(creditFee)) {
		errors.push("creditFee is required and must be a valid number.");
	}
	// Validate durationFee
	if (typeof durationFee !== "number" || Number.isNaN(durationFee)) {
		errors.push("durationFee is required and must be a valid number.");
	}
	// // Validate title
	// if (typeof title !== "string" || title.trim().length === 0) {
	// 	errors.push("title is required and must be a non-empty string.");
	// }
	// // Validate detail
	// if (typeof detail !== "string" || detail.trim().length === 0) {
	// 	errors.push("detail is required and must be a non-empty string.");
	// }
	if (errors.length > 0) {
		res.status(400).json({
			message: "Validation failed",
			errors,
		});
		return;
	}

	next();
};