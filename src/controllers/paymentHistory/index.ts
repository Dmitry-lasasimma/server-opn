import type { Request, Response } from "express";
// import { validationResult } from "express-validator";
import Stripe from "stripe";
import axios from "axios";
import { Wallet } from "../../models/wallet";

import {
	createdPaymentHistoryService,
	findPaymentHistoryByIDService,
	fetchPaymentHistoriesWithPagination,
	// findAllPaymentHistoriesServiceCount,
	updatePaymentHistoryByIDService,
	// deletePaymentHistoryByIDService,
	updatePaymentHistoryByTransactionIDService,
	findPaymentHistoryByOmiseIDService,
	fetchPaymentHistoriesForDashboardByUserIDService,
	fetchPaymentHistoriesForDashboardService,
	createdChargePaymentHistoryService,
	createdReservePaymentHistoryService,
	createdFeePaymentHistoryService,
	fetchPaymentHistoriessWithPaginationNullInvoiceId,
	// fetchPaymentHistoriesPopulateTaxinvoicesWithPagination
} from "../../services/paymentHistory";
import { findTopupByIDService } from "../../services/topup";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";
import { findUserByIDService, updateUserPoints, updateWalletCreditByUserID, findUserDataByIdService, updateUserPointService, updateWalletPointCreditByUserID } from "../../services/user";
import { verifyOmiseSignature } from "../../validators/opn";
import {
	createTransactionID,
	stripeDescription,
	stripPriceCalculate,
	createOmiseCharge,
	createPromptPayCharge,
	filterPaymentFields,
	validatePermisionRole,
} from "./helper";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// export const createPaymentHistory = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			user,
// 			paymentID,
// 			topupPackage,
// 			topupPackageID,
// 			credit,
// 			price,
// 			point,
// 			currency,
// 			status,
// 			paymentMethod,
// 			cardType,
// 			cardLast4,
// 			stripeTransactionID,
// 			stripeTransactionDetail,
// 			stripeCardID,
// 			transactionID,
// 			bankName,
// 			bankTransactionDetail,
// 			bankMessage,
// 			bankCode,
// 			destMerchantId,
// 			destMerchantName,
// 			taxRate,
// 			taxPrice,
// 			totalPriceWithTax,
// 		} = req.body;
// 		const userToken = (req as RequestWithUser).user;
// 		// Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
// 		const userData: any = await findUserByIDService(req, user.id);
// 		const wallet = await Wallet.findOne({ user: userData._id }).exec();
// 		if (!wallet) {
// 			throw {
// 				code: messages.NOT_FOUND.code,
// 				message: messages.NOT_FOUND.message
// 			}
// 		}
// 		//Create user with Create User Service
// 		const record = await createdPaymentHistoryService(
// 			{
// 				user,
// 				paymentID,
// 				topupPackage,
// 				topupPackageID,
// 				credit,
// 				remainingCredit: wallet.credit,
// 				isPromotion: false,
// 				promotionCredit: 0,
// 				price,
// 				point,
// 				currency,
// 				status,
// 				paymentType: "TOPUP",
// 				paymentChannel: paymentMethod,
// 				cardType,
// 				cardLast4,
// 				omiseTransactionID: stripeTransactionID,
// 				omiseTransactionDetail: stripeTransactionDetail,
// 				omiseCardID: stripeCardID,
// 				transactionID,
// 				bankName,
// 				bankTransactionDetail,
// 				bankMessage,
// 				bankCode,
// 				destMerchantId,
// 				destMerchantName,
// 				taxRate,
// 				taxPrice,
// 				totalPriceWithTax,
// 				createdBy: userToken.id,
// 				createdByFullName: userToken.fullName,
// 			});

// 		res.status(200).json({
// 			message: "Create record Successful",
// 			record,
// 		});
// 		return;
// 	} catch (error) {
// 		console.log("error: ", error);
// 		res.status(500).json({
// 			message: messages.INTERNAL_SERVER_ERROR,
// 			detail: (error as Error).message,
// 		});
// 		return;
// 	}
// };

export const getPaymentHistoryByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const record = await findPaymentHistoryByIDService(id);

		if (!record) {
			res.status(404).json({
				message: messages.NOT_FOUND,
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
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

// export const getPaymentHistories = async (req: Request, res: Response) => {
// 	try {
// 		const userToken = (req as RequestWithUser).user;
// 		const { user: queryUser } = req.query;
// 		await validatePermisionRole(res, userToken, queryUser);
// 		// If the user is unauthorized, the response has already been sent and we should return
// 		if (res.headersSent) return;
// 		let taxInvoiceStatus = "";

// 		const { skip = "0", limit = "100", ...query } = req.query;
// 		// Ensure skip and limit are valid numbers
// 		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
// 		const parsedLimit = Number.parseInt(limit as string, 10) || 10;

// 		//if taxInvoiceStatus not query
// 		if (!query.taxInvoiceStatus) {

// 			// Generate filter object
// 			const filter = filterPaymentFields(query);

// 			// Fetch topups and count using the reusable function
// 			const { payments, totalCount } = await fetchPaymentHistoriesWithPagination(filter, parsedSkip, parsedLimit);

// 			res.status(200).json({
// 				code: messages.SUCCESSFULLY.code,
// 				messages: messages.SUCCESSFULLY.message,
// 				total: totalCount,
// 				payments,
// 			});
// 			return;
// 		}

// 		//if taxInvoiceStatus equal "NULL"
// 		if (query.taxInvoiceStatus == 'NULL') {

// 			// Generate filter object
// 			const filter = filterPaymentFields(query);

// 			// Fetch topups and count using the reusable function
// 			const { payments, totalCount } = await fetchPaymentHistoriessWithPaginationNullInvoiceId(filter, parsedSkip, parsedLimit);

// 			res.status(200).json({
// 				code: messages.SUCCESSFULLY.code,
// 				messages: messages.SUCCESSFULLY.message,
// 				total: totalCount,
// 				payments,
// 			});
// 			return;
// 		}

// 		//if have to populate taxInvoice
// 		if (query.taxInvoiceStatus) {
// 			taxInvoiceStatus = query.taxInvoiceStatus as string;
// 		}

// 		// Generate filter object
// 		const filter = filterPaymentFields(query);

// 		// Fetch topups and count using the reusable function
// 		const { payments, totalCount } = await fetchPaymentHistoriesPopulateTaxinvoicesWithPagination(filter, taxInvoiceStatus, parsedSkip, parsedLimit);

// 		res.status(200).json({
// 			code: messages.SUCCESSFULLY.code,
// 			messages: messages.SUCCESSFULLY.message,
// 			total: totalCount,
// 			payments,
// 		});
// 		return;
// 	} catch (error) {
// 		console.log("error: ", error);
// 		res.status(500).json({
// 			code: messages.INTERNAL_SERVER_ERROR.code,
// 			message: messages.INTERNAL_SERVER_ERROR.message,
// 			detail: (error as Error).message,
// 		});
// 		return;
// 	}
// };

export const updatePaymentHistoryByID = async (req: Request, res: Response) => {
	try {
		const {
			user,
			topupPackage,
			topupPackageID,
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
		} = req.body; // Extract update data from request body

		const id = req.params.id;

		const userToken = (req as RequestWithUser).user;

		// Update the Record via the service function
		const updatedRecord = await updatePaymentHistoryByIDService(
			id,
			{
				user,
				topupPackage,
				topupPackageID,
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

//========================================================================
// import { Request, Response } from 'express';
// import { findUserDataByIdService, createdPaymentHistoryService } from 'path/to/services';
// import { createOmiseCharge } from 'path/to/omise';
// import { createTransactionID } from 'path/to/utils';
// import messages from 'path/to/messages';

export const createPaymentWithOmise = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user; // user extracted from auth middleware
		const data = req.body;

		const userData: any = await findUserDataByIdService(user.id);
		const omiseCustomerId = userData.userOpnID;

		if (!omiseCustomerId) {
			res.status(400).json({
				code: messages.NOT_FOUND.code,
				message: "User does not have an Omise customer ID."
			});
			return;
		}

		const transactionID = createTransactionID();
		const amount = data.price * 100;
		const description = `Charge for order ${transactionID || "no_order_number"}`;
		const currency = data.currency;
		const returnUri = "http://www.example.com/orders/3947/complete";

		const omiseChargeRes = await createOmiseCharge(omiseCustomerId, amount, currency, description, returnUri);

		if (!omiseChargeRes) {
			res.status(500).json({
				code: messages.INTERNAL_SERVER_ERROR.code,
				message: "Omise Error: Failed to create charge",
			});
			return;
		}

		if (omiseChargeRes.status !== "successful") {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: `Charge status: ${omiseChargeRes.status}. Please handle further authentication steps.`,
			});
			return;
		}

		const omiseTransactionId = omiseChargeRes.id;
		const omiseTransactionDetail = omiseChargeRes;

		data.omiseTransactionID = omiseTransactionId;
		data.paymentID = omiseChargeRes.transaction;
		data.omiseTransactionDetail = JSON.stringify(omiseTransactionDetail);

		const status = omiseChargeRes.status === "successful" ? "SUCCESS" : "PENDING";
		const cardType = omiseChargeRes.card?.brand || "";
		const cardLast4 = omiseChargeRes.card?.last_digits || "";
		const bankName = omiseChargeRes.card?.bank || "";

		const paymentHistory = await createdPaymentHistoryService({
			user: user.id,
			paymentID: data.paymentID,
			price: data.price,
			currency: data.currency,
			status,
			paymentType: "TOPUP",
			paymentChannel: "CREDIT_CARD",
			cardType,
			cardLast4,
			omiseTransactionID: data.omiseTransactionID,
			omiseTransactionDetail: data.omiseTransactionDetail,
			omiseCardID: omiseCustomerId || "",
			transactionID,
			bankName,
			createdBy: user.id,
			createdByFullName: user.fullName,
		});

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			paymentHistory,
			omiseTransactionDetail: omiseChargeRes,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

export const createPaymentWithOmiseV1 = async (req: Request, res: Response) => {
	let omiseChargeRes: any;
	try {
		const user = (req as any).user; // user extracted from auth middleware
		const data = req.body;

		// Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
		const userData: any = await findUserDataByIdService(user.id);
		const omiseCustomerId = userData.userOpnID; // This should be the Omise customer ID associated with the user

		if (!omiseCustomerId) {
			res.status(400).json({
				code: messages.NOT_FOUND.code,
				message: "User does not have an Omise customer ID."
			});
			return;
		}
		// Create a unique transaction ID for internal use
		const transactionID: string = createTransactionID();

		// const topup = await findTopupByIDService(data.id);

		// if (!topup) {
		// 	res.status(404).json({
		// 		code: messages.NOT_FOUND.code,
		// 		message: "Topup not found."
		// 	});
		// 	return;
		// }

		// console.log("topup: --->", topup);
		// let promotionCredit = 0;
		// if (topup.type === "PROMOTION") {
		// 	promotionCredit = topup.credit - topup.price;
		// }
		const amount = data.price * 100; // Amount in the smallest currency unit
		const description = `Charge for order ${transactionID || "no_order_number"}`;
		const currency = data.currency;
		const returnUri = "http://www.example.com/orders/3947/complete"; // static URI or from request

		// Create a charge on Omise
		omiseChargeRes = await createOmiseCharge(omiseCustomerId, amount, currency, description, returnUri);

		if (!omiseChargeRes) {
			res.status(500).json({
				code: messages.INTERNAL_SERVER_ERROR.code,
				message: "Omise Error: Failed to create charge",
			});
			return;
		}

		// if (omiseChargeRes.status !== "successful" && omiseChargeRes.status !== "pending") {
		if (omiseChargeRes.status !== "successful") {
			// If the charge is not immediately successful or pending, handle accordingly
			// For example, if 'awaiting_payment', you may need a redirect or handle 3D secure flow
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: `Charge status: ${omiseChargeRes.status}. Please handle further authentication steps.`,
			});
			return;
		}

		// Extract transaction details
		const omiseTransactionId = omiseChargeRes.id;
		const omiseTransactionDetail = omiseChargeRes;

		// Add transaction details to data
		data.omiseTransactionID = omiseTransactionId;
		data.paymentID = omiseChargeRes.transaction;
		data.omiseTransactionDetail = JSON.stringify(omiseTransactionDetail);



		const status: string = omiseChargeRes.status === "successful" ? "SUCCESS" : "PENDING";

		// Omise does not provide direct cardType/cardLast4 in the same manner as Stripe, 
		// but you can get the card details from `omiseChargeRes.card`.
		const cardType = omiseChargeRes.card?.brand || "";
		const cardLast4 = omiseChargeRes.card?.last_digits || "";
		const bankName = omiseChargeRes.card?.bank || "";
		let isPromotion = false;
		let promotionCredit = 0;
		// if (topup.type === "PROMOTION") {
		// 	isPromotion = true;
		// 	promotionCredit = topup.credit - topup.price
		// }
		// const wallet = await Wallet.findOne({ user: userData._id }).exec();
		// if (!wallet) {
		// 	throw {
		// 		code: messages.NOT_FOUND.code,
		// 		message: messages.NOT_FOUND.message
		// 	}
		// }

		const paymentHistory = await createdPaymentHistoryService(
			{
				user: user.id,
				paymentID: data.paymentID,
				price: data.price,
				currency: data.currency,
				status,
				paymentType: "TOPUP",
				paymentChannel: "CREDIT_CARD",
				cardType,
				cardLast4,
				omiseTransactionID: data.omiseTransactionID,
				omiseTransactionDetail: data.omiseTransactionDetail,
				omiseCardID: data.omiseCardID = omiseCustomerId || "", // If you don't have a card ID in Omise, leave this blank or remove it
				transactionID,
				bankName,
				createdBy: user.id,
				createdByFullName: user.fullName,
			});

		// let messagesNoti = `คุณได้เติมเงินผ่าน Credit Card สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
		// // If topup type is PROMOTION, add points to the user
		// if (topup.type === "PROMOTION") {
		// 	try {
		// 		messagesNoti = `คุณได้รับ ${topup.point} พอยท์ จากการเติมเงินผ่าน Credit Card สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
		// 		// Assuming you have a function to update user points
		// 		await updateUserPoints(req, user.id, topup.point, userData.point);
		// 		console.log(`Added ${topup.point} points to user ${user.id}`);
		// 	} catch (pointError) {
		// 		console.error("Failed to update user points: ", pointError);
		// 		// Not returning here, because payment was successful. But you may handle this as needed.
		// 	}
		// }
		// try {
		// 	console.log("topup credit before: ", topup.credit);
		// 	await updateWalletCreditByUserID(topup.credit, user)
		// } catch (creditError) {
		// 	res.status(500).json({
		// 		code: messages.INTERNAL_SERVER_ERROR.code,
		// 		message: "Failed to update user credit: ", creditError,
		// 	});
		// 	return;
		// 	// console.error("Failed to update user credit: ", creditError);
		// }

		// send notification
		// try {
		// 	let notificationBody = {
		// 		title: "เติมเงินสำเร็จ!",
		// 		detail: messagesNoti,
		// 		type: "PAYMENT",
		// 		platform: "EV",
		// 		recipientRole: "CUSTOMER"
		// 	}
		// 	const response = await axios.post(
		// 		`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications/user`,
		// 		notificationBody,
		// 		{
		// 			headers: {
		// 				Authorization: `${req.headers["authorization"]}`,
		// 			},
		// 		},
		// 	);
		// 	console.log("Notification sent successfully:", response.data);
		// } catch (error) {
		// 	console.error("Error sending notification:", error);
		// 	// throw error;
		// }

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			paymentHistory,
			omiseTransactionDetail: omiseChargeRes,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};