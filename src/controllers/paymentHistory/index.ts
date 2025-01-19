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
	fetchPaymentHistoriesPopulateTaxinvoicesWithPagination
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

export const createPaymentHistory = async (req: Request, res: Response) => {
	try {
		const {
			user,
			paymentID,
			topupPackage,
			topupPackageID,
			credit,
			price,
			point,
			currency,
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
		const userToken = (req as RequestWithUser).user;
		// Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
		const userData: any = await findUserByIDService(req, user.id);
		const wallet = await Wallet.findOne({ user: userData._id }).exec();
		if (!wallet) {
			throw {
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message
			}
		}
		//Create user with Create User Service
		const record = await createdPaymentHistoryService(
			{
				user,
				paymentID,
				topupPackage,
				topupPackageID,
				credit,
				remainingCredit: wallet.credit,
				isPromotion: false,
				promotionCredit: 0,
				price,
				point,
				currency,
				status,
				paymentType: "TOPUP",
				paymentChannel: paymentMethod,
				cardType,
				cardLast4,
				omiseTransactionID: stripeTransactionID,
				omiseTransactionDetail: stripeTransactionDetail,
				omiseCardID: stripeCardID,
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
				createdBy: userToken.id,
				createdByFullName: userToken.fullName,
			});

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

export const getPaymentHistories = async (req: Request, res: Response) => {
	try {
		const userToken = (req as RequestWithUser).user;
		const { user: queryUser } = req.query;
		await validatePermisionRole(res, userToken, queryUser);
		// If the user is unauthorized, the response has already been sent and we should return
		if (res.headersSent) return;
		let taxInvoiceStatus = "";

		const { skip = "0", limit = "100", ...query } = req.query;
		// Ensure skip and limit are valid numbers
		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
		const parsedLimit = Number.parseInt(limit as string, 10) || 10;

		//if taxInvoiceStatus not query
		if (!query.taxInvoiceStatus) {

			// Generate filter object
			const filter = filterPaymentFields(query);

			// Fetch topups and count using the reusable function
			const { payments, totalCount } = await fetchPaymentHistoriesWithPagination(filter, parsedSkip, parsedLimit);

			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				messages: messages.SUCCESSFULLY.message,
				total: totalCount,
				payments,
			});
			return;
		}

		//if taxInvoiceStatus equal "NULL"
		if (query.taxInvoiceStatus == 'NULL') {

			// Generate filter object
			const filter = filterPaymentFields(query);

			// Fetch topups and count using the reusable function
			const { payments, totalCount } = await fetchPaymentHistoriessWithPaginationNullInvoiceId(filter, parsedSkip, parsedLimit);

			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				messages: messages.SUCCESSFULLY.message,
				total: totalCount,
				payments,
			});
			return;
		}

		//if have to populate taxInvoice
		if (query.taxInvoiceStatus) {
			taxInvoiceStatus = query.taxInvoiceStatus as string;
		}

		// Generate filter object
		const filter = filterPaymentFields(query);

		// Fetch topups and count using the reusable function
		const { payments, totalCount } = await fetchPaymentHistoriesPopulateTaxinvoicesWithPagination(filter, taxInvoiceStatus, parsedSkip, parsedLimit);

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			total: totalCount,
			payments,
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

// export const createPaymentWithStripe = async (req: Request, res: Response) => {
// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	let stripePreAuthRes: any;
// 	try {
// 		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 		const user = (req as any).user;
// 		const data = req.body;
// 		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 		const userData: any = await findUserByIDService(req, user.id);
// 		const stripeCustomerId = userData.userStripeID;

// 		const paymentMethodId = data.stripeCardId;
// 		stripePreAuthRes = await createHoldingCard(
// 			userData.fullName,
// 			paymentMethodId,
// 			stripeCustomerId,
// 			data.price,
// 		);

// 		if (!stripePreAuthRes) {
// 			res.status(500).json({
// 				message: "Stripe Error",
// 			});
// 			return;
// 		}

// 		if (stripePreAuthRes.status !== "requires_capture") {
// 			res.status(405).json({
// 				message: "Card is required 3d secure",
// 			});
// 		}

// 		// TODO: Capture or Cancel Stripe pre-authorize
// 		const stripeTransactionId = stripePreAuthRes.id;
// 		const stripeTransactionDetail = stripePreAuthRes;

// 		//TODO: assing to data
// 		data.stripeTransactionID = stripeTransactionId;
// 		data.stripeTransactionDetail = JSON.stringify(stripeTransactionDetail);

// 		//TODO: Get orderNo
// 		const transactionID: string = createTransactionID();

// 		const status: string = "SUCCESS";
// 		const paymentHistory = await createdPaymentHistoryService(
// 			{
// 				user: user.id,
// 				paymentID: data.paymentID,
// 				topupPackage: data.topupPackage,
// 				topupPackageID: data.topupPackageID,
// 				credit: data.credit,
// 				price: data.price,
// 				point: data.point,
// 				currency: data.currency,
// 				status,
// 				paymentType: "TOPUP",
// 				paymentChannel: "CREDIT_CARD",
// 				cardType: stripePreAuthRes.cardType,
// 				cardLast4: stripePreAuthRes.cardLast4,
// 				omiseTransactionID: data.stripeTransactionID,
// 				omiseTransactionDetail: data.stripeTransactionDetail,
// 				omiseCardID: data.stripeCardID,
// 				transactionID,
// 				createdBy: user.id,
// 				createdByFullName: user.fullName,
// 			});
// 		console.log("paymentHistory: ", paymentHistory);

// 		await confirmPayment(stripePreAuthRes.id, data.price);

// 		res.status(200).json({
// 			message: "Create Payment Successful",
// 			paymentHistory,
// 		});
// 		return;
// 	} catch (error) {
// 		console.log("error: ", error);
// 		await cancleHoldingCard(stripePreAuthRes?.id);
// 		res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 		return;
// 	}
// };

const createHoldingCard = async (
	firstName: string,
	paymentMethodId: string,
	stripeCustomerId: string,
	stripePriceUSD: number,
) => {
	try {
		// const total = data.total;
		const description = firstName;
		console.log("description: ", description);
		const stDescription = stripeDescription(description);
		console.log("stDescription: ", stDescription);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const newData: any = {
			// amount: stripPriceCalculate(total),
			amount: stripPriceCalculate(stripePriceUSD),
			// currency: "LAK",
			currency: "USD",
			payment_method_types: ["card"],
			capture_method: "manual",
			payment_method: paymentMethodId,
			confirm: true,
			customer: stripeCustomerId,
			description: stDescription,
		};
		const paymentIntentRes = await stripe.paymentIntents.create(newData);
		return paymentIntentRes;
	} catch (err) {
		console.log("STRIPE_ERROR: ", err);
		throw new Error("Error create Holding Card");
	}
};

const cancleHoldingCard = async (paymentIntentId: string) => {
	try {
		await stripe.paymentIntents.cancel(paymentIntentId);
	} catch (err) {
		console.log("STRIPE_ERROR: ", err);
		throw new Error("Error create cancel Holding Card");
	}
};

const confirmPayment = async (paymentIntentId: string, stripePrice: number) => {
	try {
		await stripe.paymentIntents.capture(
			paymentIntentId,
			// 'pi_3LAnxaHwyVUCIyk304BainCq',
			{
				// amount_to_capture: stripPriceCalculate(total),
				// amount_to_capture: stripPriceCalculate(stripePriceUSD),
				amount_to_capture: stripPriceCalculate(stripePrice),
			},
		);
	} catch (err) {
		console.log("error: ", err);
		throw new Error("Error Confirm Stripe Payment");
	}
};

//========================================================================
export const createPaymentWithOmise = async (req: Request, res: Response) => {
	let omiseChargeRes: any;
	try {
		const user = (req as any).user; // user extracted from auth middleware
		const data = req.body;

		// Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
		const userData: any = await findUserByIDService(req, user.id);
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

		const topup = await findTopupByIDService(data.id);

		if (!topup) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: "Topup not found."
			});
			return;
		}

		console.log("topup: --->", topup);
		// let promotionCredit = 0;
		// if (topup.type === "PROMOTION") {
		// 	promotionCredit = topup.credit - topup.price;
		// }
		const amount = topup.price * 100; // Amount in the smallest currency unit
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
		if (topup.type === "PROMOTION") {
			isPromotion = true;
			promotionCredit = topup.credit - topup.price
		}
		const wallet = await Wallet.findOne({ user: userData._id }).exec();
		if (!wallet) {
			throw {
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message
			}
		}

		const paymentHistory = await createdPaymentHistoryService(
			{
				user: user.id,
				paymentID: data.paymentID,
				topupPackage: topup.packageName,
				topupPackageID: topup.id,
				credit: topup.credit,
				remainingCredit: wallet.credit,
				isPromotion,
				promotionCredit,
				price: topup.price,
				point: topup?.point || 0,
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

export const createPromptPayPayment = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user; // Extract user from auth middleware
		const data = req.body;

		// Fetch user data to get Omise customer ID
		// const userData = await findUserByIDService(req, user.id);
		// const omiseCustomerId = userData.userOpnID; // Omise customer ID

		// if (!omiseCustomerId) {
		// 	res.status(400).json({ message: "User does not have an Omise customer ID." });
		// 	return;
		// }

		// Validate top-up details
		const topup = await findTopupByIDService(data.id);
		if (!topup) {
			res.status(404).json({ message: "Top-up not found." });
			return;
		}

		// Generate transaction details
		const transactionID = createTransactionID();
		// let promotionCredit = 0;
		// if (topup.type === "PROMOTION") {
		// 	promotionCredit = topup.credit - topup.price;
		// }
		const amount = topup.price * 100; // Amount in the smallest currency unit
		const description = `PromptPay charge for order ${transactionID}`;
		const currency = data.currency;
		const returnUri = "http://www.example.com/orders/complete"; // Static URI or dynamic as needed

		// Create PromptPay charge
		const promptPayCharge = await createPromptPayCharge(amount, currency, description, returnUri);
		if (!promptPayCharge || (promptPayCharge.status !== "pending" && promptPayCharge.status !== "successful")) {
			res.status(400).json({
				code: messages.INTERNAL_SERVER_ERROR.code,
				// message: messages.INTERNAL_SERVER_ERROR.message,
				message: `Charge creation failed with status: ${promptPayCharge?.status || "unknown"}`,
			});
			return;
		}

		// Add transaction details to the data
		const omiseTransactionId = promptPayCharge.id;
		const omiseTransactionDetail = promptPayCharge;
		data.omiseTransactionID = omiseTransactionId;
		data.paymentID = promptPayCharge.transaction;
		data.omiseTransactionDetail = JSON.stringify(omiseTransactionDetail);

		console.log("payment type: ", promptPayCharge.source.type);
		console.log("payment qr =====> ", promptPayCharge.source.scannable_code.image.download_uri);

		const status = promptPayCharge.status === "successful" ? "SUCCESS" : "PENDING";

		let isPromotion = false;
		let promotionCredit = 0;
		if (topup.type === "PROMOTION") {
			isPromotion = true;
			promotionCredit = topup.credit - topup.price
		}
		// Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
		const userData: any = await findUserByIDService(req, user.id);
		const wallet = await Wallet.findOne({ user: userData._id }).exec();
		if (!wallet) {
			throw {
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message
			}
		}

		// Save payment history
		const paymentHistory = await createdPaymentHistoryService(
			{
				user: user.id,
				paymentID: data.paymentID,
				topupPackage: topup.packageName,
				topupPackageID: topup.id,
				credit: topup.credit,
				remainingCredit: wallet.credit,
				isPromotion,
				promotionCredit,
				price: topup.price,
				point: topup?.point || 0,
				currency: data.currency,
				status,
				paymentType: "TOPUP",
				paymentChannel: "PROMPTPAY",
				omiseTransactionID: omiseTransactionId,
				omiseTransactionDetail: data.omiseTransactionDetail,
				transactionID,
				createdBy: user.id,
				createdByFullName: user.fullName
			});

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			paymentHistory,
			promptPayCharge,
		});
	} catch (error) {
		console.error("Error processing PromptPay payment: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
	}
};

const validatePayload = (payload: any): boolean => {
	console.log("Validating payload structure...");
	return payload && payload.object === "event" && (payload.key === "charge.complete" || payload.key === "charge.create");
};

const validateCharge = (charge: any): boolean => {
	console.log("Validating charge object...");
	console.log("Charge payload:", charge);
	return typeof charge === "object" && charge.object === "charge";
};

export const handleOmiseWebhook = async (req: Request, res: Response) => {
	try {
		const payloadOmise = req.body; // Already parsed as JSON by middleware
		console.log("Webhook payloadOmise: ", payloadOmise);

		// Validate payloadOmise structure
		if (!validatePayload(payloadOmise)) {
			console.log("Invalid webhook payload structure");
			res.status(400).json({ message: "Invalid webhook payload" });
			return;
		}
		console.log("payloadOmise structure is valid");

		// Extract charge object
		// console.log("payloadOmise data:", payloadOmise.data); // Log full data
		const charge = payloadOmise.data || null;
		console.log("Extracted charge object:", charge);

		// Validate charge object
		if (!validateCharge(charge)) {
			console.log("Invalid charge object in webhook payloadOmise");
			res.status(400).json({ message: "Invalid charge object in webhook payloadOmise" });
			return;
		}
		console.log("Charge object is valid");

		// Extract relevant fields
		const { id: chargeId, status: chargeStatus } = charge;
		// const sourceType = source?.type || "unknown";

		console.log(`Processing Charge ID: ${chargeId}, Status: ${chargeStatus}`);

		// Find payment history record by Omise charge ID
		let paymentHistorydata: any = await findPaymentHistoryByOmiseIDService(chargeId);
		if (!paymentHistorydata) {
			res.status(404).json({ message: "Payemnt history not found" });
		}

		// Validate top-up details
		const topup = await findTopupByIDService(paymentHistorydata.topupPackageID);
		if (!topup) {
			res.status(404).json({ message: "Top-up not found." });
			return;
		}
		const userData: any = await findUserDataByIdService(paymentHistorydata.user);

		let charge_status = "";
		// Handle charge status
		if (chargeStatus === "successful") {
			console.log(`Charge ${chargeId} was successful`);
			charge_status = "SUCCESS";
			await updatePaymentStatus(chargeId, "SUCCESS");
			let messagesNoti = `คุณได้เติมเงินผ่าน ${paymentHistorydata.paymentChannel} สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
			// Handle promotional points and wallet credit
			if (topup.type === "PROMOTION") {
				messagesNoti = `คุณได้รับ ${topup.point} พอยท์ จากการเติมเงินผ่าน ${paymentHistorydata.paymentChannel} สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
				await updateUserPointService(paymentHistorydata.user, topup.point, userData.point);
			}
			await updateWalletCreditByUserID(topup.credit, userData);
			// send notification
			try {
				let notificationBody = {
					recipient: paymentHistorydata.user,
					title: "เติมเงินสำเร็จ!",
					detail: messagesNoti,
					type: "PAYMENT",
					platform: "EV",
					recipientRole: "CUSTOMER"
				}
				const response = await axios.post(
					`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications`,
					notificationBody,
				);
				console.log("Notification sent successfully:", response.data);
			} catch (error) {
				console.error("Error sending notification:", error);
				// throw error;
			}
		} else if (chargeStatus === "failed") {
			console.log(`Charge ${chargeId} failed`);
			charge_status = "FAILED";
			await updatePaymentStatus(chargeId, "FAILED");
		} else if (chargeStatus === "pending") {
			console.log(`Charge ${chargeId} is pending`);
			charge_status = "PENDING";
			await updatePaymentStatus(chargeId, "PENDING");
		} else {
			console.log(`Unhandled charge status: ${chargeStatus}`);
		}

		console.log("Webhook processing complete");
		//emit socket event

		// const url = 'http://localhost:3000/v1/api/payment-socket';
		const url = process.env.SOCKET_URL as string;
		const payload = {
			userId: paymentHistorydata.user,
			payload: {
				status: charge_status,
				credit: paymentHistorydata.credit,
				transactionID: paymentHistorydata.transactionID,
				createdAt: paymentHistorydata.createdAt,
				topupPackage: paymentHistorydata.topupPackage,
				point: paymentHistorydata.point,
				paymentChannel: paymentHistorydata.paymentChannel,
				price: paymentHistorydata.price,
				currency: paymentHistorydata.currency,
			}
		};

		// console.log("===============>>>>payload: ", payload);

		try {
			const response = await axios.post(url, payload);
			console.log('============>>>Response:', response.data);
		} catch (error) {
			console.error('Error sending request:', error);
		}


		res.status(200).json({ message: "Webhook processed successfully" });
	} catch (error) {
		console.error("Error handling Omise webhook:", error);
		res.status(500).json({ message: "Internal Server Error", detail: error });
	}
};

const updatePaymentStatus = async (transactionId: string, status: string): Promise<void> => {
	try {
		// Find the payment record by transaction ID and update its status
		const transaction = await updatePaymentHistoryByTransactionIDService(transactionId, status);

		console.log("transaction: ", transaction)

		console.log(`Payment status for transaction ${transactionId} updated to ${status}`);
	} catch (error) {
		console.error("Error updating payment status:", error);
		throw error;
	}
};

// create a payment history record use point

export const createPointPayment = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user; // Extract user from auth middleware
		const data = req.body;

		// Fetch user data
		const userData: any = await findUserByIDService(req, user.id);

		if (!userData?.point) {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: "User points not found or invalid."
			});
			return;
		}

		// Fetch top-up package details
		const topup = await findTopupByIDService(data.id);
		if (!topup) {
			console.log("Topup not found.")
			res.status(404).json({ message: "Topup not found." });
			return;
		}
		// if (topup.type !== "PROMOTION") {
		// 	res.status(400).json({
		// 		code: messages.BAD_REQUEST.code,
		// 		message: "Topup type is not PROMOTION."
		// 	});
		// 	return;
		// }
		// let promotionCredit = 0;
		// if (topup.type === "PROMOTION") {
		// 	promotionCredit = topup.credit - topup.price;
		// }

		const requiredPoints = topup.pointPrice || 0; // Points required for the top-up

		// Check if user has sufficient points
		if (userData.point < requiredPoints) {
			res.status(409).json({
				code: messages.INSUFFICIENT_POINT.code,
				message: messages.INSUFFICIENT_POINT.message,
			});
			return;
		}

		let isPromotion = false;
		let promotionCredit = 0;
		if (topup.type === "PROMOTION") {
			isPromotion = true;
			promotionCredit = topup.credit - topup.price
		}
		// console.log("userData.id", userData._id)
		const wallet = await Wallet.findOne({ user: userData._id }).exec();
		if (!wallet) {
			throw {
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message
			}
		}
		// Deduct points from the user
		const updatedPoints = userData.point - requiredPoints;
		await updateUserPoints(req, user.id, updatedPoints); // Deduct points (negative value)

		// Create transaction ID for internal tracking
		const transactionID: string = createTransactionID();

		// Status is SUCCESS since it's an immediate point deduction
		const status: string = "SUCCESS";
		const price: number = topup.pointPrice;
		// console.log("price: ", price);

		// Create payment history
		const paymentHistory = await createdPaymentHistoryService(
			{
				user: user.id,
				topupPackage: topup.packageName,
				topupPackageID: topup.id,
				credit: topup.credit,
				remainingCredit: wallet.credit,
				isPromotion,
				promotionCredit,
				price,
				point: topup.point,
				status,
				paymentType: "TOPUP",
				paymentChannel: "POINT",
				transactionID,
				createdBy: user.id,
				createdByFullName: user.fullName,
			});

		console.log("paymentHistory: ", paymentHistory);

		let messagesNoti = `คุณได้เติมเงินผ่าน Point สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
		// If topup type is PROMOTION, add points to the user
		// if (topup.type === "PROMOTION") {
		// 	try {
		// 		messagesNoti = `คุณได้รับ ${topup.point} พอยท์ จากการเติมเงินผ่าน Point สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
		// 		// Assuming you have a function to update user points
		// 		// await updateUserPoints(req, user.id, topup.point, userData.point);
		// 		console.log(`Added ${topup.point} points to user ${user.id}`);
		// 	} catch (pointError) {
		// 		console.error("Failed to update user points: ", pointError);
		// 		// Not returning here, because payment was successful. But you may handle this as needed.
		// 	}
		// }
		// Update user's wallet with the associated credits from the top-up
		try {
			await updateWalletPointCreditByUserID(topup.credit, user);
		} catch (creditError) {
			console.error("Failed to update user wallet credit: ", creditError);
			// You may choose to handle or log this error, but do not fail the transaction
		}
		// send notification
		try {
			let notificationBody = {
				title: "เติมเงินสำเร็จ!",
				detail: messagesNoti,
				type: "PAYMENT",
				platform: "EV",
				recipientRole: "CUSTOMER"
			}
			const response = await axios.post(
				`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications/user`,
				notificationBody,
				{
					headers: {
						Authorization: `${req.headers["authorization"]}`,
					},
				},
			);
			console.log("Notification sent successfully:", response.data);
		} catch (error) {
			console.error("Error sending notification:", error);
			// throw error;
		}

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			paymentHistory,
			usedPoints: requiredPoints,
		});
		return;
	} catch (error) {
		console.error("Error processing point-based payment: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
	}
};

// controller for dashboard
export const getUserDashboardPaymentHistories = async (req: Request, res: Response) => {
	try {

		let userId: any = req.params.id;

		const { card: queryCard, bank: queryBank, point: queryPoint, startDate, endDate } = req.query;

		// Fetch topups and count using the reusable function
		const userPaymentHistory = await fetchPaymentHistoriesForDashboardByUserIDService(userId, queryCard, queryBank, queryPoint, startDate, endDate);


		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			userPaymentHistory,
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

export const getDashboardPaymentHistories = async (req: Request, res: Response) => {
	try {

		// let userId: any = req.params.id;

		const { card: queryCard, bank: queryBank, point: queryPoint, startDate, endDate } = req.query;

		// Fetch topups and count using the reusable function
		const userPaymentHistory = await fetchPaymentHistoriesForDashboardService(queryCard, queryBank, queryPoint, startDate, endDate);


		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			userPaymentHistory,
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

// create charge payment history 
export const createChargePaymentHistory = async (req: Request, res: Response) => {
	try {
		const {
			credit,
			chargeStartTime,
			chargeEndTime,
			energyImport,
			chargingStationName,
			chargerMachineName,
			chargerTypeName,
		} = req.body;
		const userToken = (req as RequestWithUser).user;
		const record = await createdChargePaymentHistoryService(
			{
				user: userToken.id,
				credit,
				status: "SUCCESS",
				paymentType: "CHARGE",
				chargeStartTime,
				chargeEndTime,
				energyImport,
				chargingStationName,
				chargerMachineName,
				chargerTypeName,
				createdBy: userToken.id,
				createdByFullName: userToken.fullName,
			});

		res.status(201).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
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
// create reserve payment history 
export const createReservePaymentHistory = async (req: Request, res: Response) => {
	try {
		const {
			credit,
		} = req.body;
		const userToken = (req as RequestWithUser).user;
		const record = await createdReservePaymentHistoryService(
			{
				user: userToken.id,
				credit,
				status: "SUCCESS",
				paymentType: "RESERVE",
				title: "จ่ายค่ามัดจำการจอง",
				detail: `ต้องจ่ายค่ามัดจำการจองก่อนทุกๆครั้งค่าจองต่อครั้งคือ ${credit}THB`,
				createdBy: userToken.id,
				createdByFullName: userToken.fullName,
			});

		res.status(201).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
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
// create fee payment history 
export const createFeePaymentHistory = async (req: Request, res: Response) => {
	try {
		const {
			creditFee,
			durationFee,
		} = req.body;
		const userToken = (req as RequestWithUser).user;
		const credit = creditFee * durationFee
		const record = await createdFeePaymentHistoryService(
			{
				user: userToken.id,
				credit,
				creditFee,
				durationFee,
				status: "SUCCESS",
				paymentType: "FEE",
				title: "จอดรถทิ้งไว้เกีนเวลาที่กำหนด",
				detail: `คุณจอดรถไว้เกีน ${durationFee} นาทีหลังชาร์จเสร็จ ค่าปรับต่อนาทีคือ ${creditFee} THB`,
				createdBy: userToken.id,
				createdByFullName: userToken.fullName,
			});
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
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};