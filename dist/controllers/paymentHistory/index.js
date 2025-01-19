"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeePaymentHistory = exports.createReservePaymentHistory = exports.createChargePaymentHistory = exports.getDashboardPaymentHistories = exports.getUserDashboardPaymentHistories = exports.createPointPayment = exports.handleOmiseWebhook = exports.createPromptPayPayment = exports.createPaymentWithOmise = exports.updatePaymentHistoryByID = exports.getPaymentHistories = exports.getPaymentHistoryByID = exports.createPaymentHistory = void 0;
// import { validationResult } from "express-validator";
const stripe_1 = __importDefault(require("stripe"));
const axios_1 = __importDefault(require("axios"));
const wallet_1 = require("../../models/wallet");
const paymentHistory_1 = require("../../services/paymentHistory");
const topup_1 = require("../../services/topup");
const config_1 = require("../../config");
const user_1 = require("../../services/user");
const helper_1 = require("./helper");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, paymentID, topupPackage, topupPackageID, credit, price, point, currency, status, paymentMethod, cardType, cardLast4, stripeTransactionID, stripeTransactionDetail, stripeCardID, transactionID, bankName, bankTransactionDetail, bankMessage, bankCode, destMerchantId, destMerchantName, taxRate, taxPrice, totalPriceWithTax, } = req.body;
        const userToken = req.user;
        // Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        const wallet = yield wallet_1.Wallet.findOne({ user: userData._id }).exec();
        if (!wallet) {
            throw {
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message
            };
        }
        //Create user with Create User Service
        const record = yield (0, paymentHistory_1.createdPaymentHistoryService)({
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
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.createPaymentHistory = createPaymentHistory;
const getPaymentHistoryByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, paymentHistory_1.findPaymentHistoryByIDService)(id);
        if (!record) {
            res.status(404).json({
                message: config_1.messages.NOT_FOUND,
                detail: "record not found with this id",
            });
            return;
        }
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: config_1.messages.SUCCESSFULLY.message,
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.getPaymentHistoryByID = getPaymentHistoryByID;
const getPaymentHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = req.user;
        const { user: queryUser } = req.query;
        yield (0, helper_1.validatePermisionRole)(res, userToken, queryUser);
        // If the user is unauthorized, the response has already been sent and we should return
        if (res.headersSent)
            return;
        let taxInvoiceStatus = "";
        const _a = req.query, { skip = "0", limit = "100" } = _a, query = __rest(_a, ["skip", "limit"]);
        // Ensure skip and limit are valid numbers
        const parsedSkip = Number.parseInt(skip, 10) || 0;
        const parsedLimit = Number.parseInt(limit, 10) || 10;
        //if taxInvoiceStatus not query
        if (!query.taxInvoiceStatus) {
            // Generate filter object
            const filter = (0, helper_1.filterPaymentFields)(query);
            // Fetch topups and count using the reusable function
            const { payments, totalCount } = yield (0, paymentHistory_1.fetchPaymentHistoriesWithPagination)(filter, parsedSkip, parsedLimit);
            res.status(200).json({
                code: config_1.messages.SUCCESSFULLY.code,
                messages: config_1.messages.SUCCESSFULLY.message,
                total: totalCount,
                payments,
            });
            return;
        }
        //if taxInvoiceStatus equal "NULL"
        if (query.taxInvoiceStatus == 'NULL') {
            // Generate filter object
            const filter = (0, helper_1.filterPaymentFields)(query);
            // Fetch topups and count using the reusable function
            const { payments, totalCount } = yield (0, paymentHistory_1.fetchPaymentHistoriessWithPaginationNullInvoiceId)(filter, parsedSkip, parsedLimit);
            res.status(200).json({
                code: config_1.messages.SUCCESSFULLY.code,
                messages: config_1.messages.SUCCESSFULLY.message,
                total: totalCount,
                payments,
            });
            return;
        }
        //if have to populate taxInvoice
        if (query.taxInvoiceStatus) {
            taxInvoiceStatus = query.taxInvoiceStatus;
        }
        // Generate filter object
        const filter = (0, helper_1.filterPaymentFields)(query);
        // Fetch topups and count using the reusable function
        const { payments, totalCount } = yield (0, paymentHistory_1.fetchPaymentHistoriesPopulateTaxinvoicesWithPagination)(filter, taxInvoiceStatus, parsedSkip, parsedLimit);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            total: totalCount,
            payments,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getPaymentHistories = getPaymentHistories;
const updatePaymentHistoryByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, topupPackage, topupPackageID, credit, price, status, paymentMethod, cardType, cardLast4, stripeTransactionID, stripeTransactionDetail, stripeCardID, transactionID, bankName, bankTransactionDetail, bankMessage, bankCode, destMerchantId, destMerchantName, taxRate, taxPrice, totalPriceWithTax, } = req.body; // Extract update data from request body
        const id = req.params.id;
        const userToken = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, paymentHistory_1.updatePaymentHistoryByIDService)(id, {
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
        }, userToken);
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
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.updatePaymentHistoryByID = updatePaymentHistoryByID;
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
const createHoldingCard = (firstName, paymentMethodId, stripeCustomerId, stripePriceUSD) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const total = data.total;
        const description = firstName;
        console.log("description: ", description);
        const stDescription = (0, helper_1.stripeDescription)(description);
        console.log("stDescription: ", stDescription);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const newData = {
            // amount: stripPriceCalculate(total),
            amount: (0, helper_1.stripPriceCalculate)(stripePriceUSD),
            // currency: "LAK",
            currency: "USD",
            payment_method_types: ["card"],
            capture_method: "manual",
            payment_method: paymentMethodId,
            confirm: true,
            customer: stripeCustomerId,
            description: stDescription,
        };
        const paymentIntentRes = yield stripe.paymentIntents.create(newData);
        return paymentIntentRes;
    }
    catch (err) {
        console.log("STRIPE_ERROR: ", err);
        throw new Error("Error create Holding Card");
    }
});
const cancleHoldingCard = (paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stripe.paymentIntents.cancel(paymentIntentId);
    }
    catch (err) {
        console.log("STRIPE_ERROR: ", err);
        throw new Error("Error create cancel Holding Card");
    }
});
const confirmPayment = (paymentIntentId, stripePrice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stripe.paymentIntents.capture(paymentIntentId, 
        // 'pi_3LAnxaHwyVUCIyk304BainCq',
        {
            // amount_to_capture: stripPriceCalculate(total),
            // amount_to_capture: stripPriceCalculate(stripePriceUSD),
            amount_to_capture: (0, helper_1.stripPriceCalculate)(stripePrice),
        });
    }
    catch (err) {
        console.log("error: ", err);
        throw new Error("Error Confirm Stripe Payment");
    }
});
//========================================================================
const createPaymentWithOmise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let omiseChargeRes;
    try {
        const user = req.user; // user extracted from auth middleware
        const data = req.body;
        // Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        const omiseCustomerId = userData.userOpnID; // This should be the Omise customer ID associated with the user
        if (!omiseCustomerId) {
            res.status(400).json({
                code: config_1.messages.NOT_FOUND.code,
                message: "User does not have an Omise customer ID."
            });
            return;
        }
        // Create a unique transaction ID for internal use
        const transactionID = (0, helper_1.createTransactionID)();
        const topup = yield (0, topup_1.findTopupByIDService)(data.id);
        if (!topup) {
            res.status(404).json({
                code: config_1.messages.NOT_FOUND.code,
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
        omiseChargeRes = yield (0, helper_1.createOmiseCharge)(omiseCustomerId, amount, currency, description, returnUri);
        if (!omiseChargeRes) {
            res.status(500).json({
                code: config_1.messages.INTERNAL_SERVER_ERROR.code,
                message: "Omise Error: Failed to create charge",
            });
            return;
        }
        // if (omiseChargeRes.status !== "successful" && omiseChargeRes.status !== "pending") {
        if (omiseChargeRes.status !== "successful") {
            // If the charge is not immediately successful or pending, handle accordingly
            // For example, if 'awaiting_payment', you may need a redirect or handle 3D secure flow
            res.status(400).json({
                code: config_1.messages.BAD_REQUEST.code,
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
        const status = omiseChargeRes.status === "successful" ? "SUCCESS" : "PENDING";
        // Omise does not provide direct cardType/cardLast4 in the same manner as Stripe, 
        // but you can get the card details from `omiseChargeRes.card`.
        const cardType = ((_a = omiseChargeRes.card) === null || _a === void 0 ? void 0 : _a.brand) || "";
        const cardLast4 = ((_b = omiseChargeRes.card) === null || _b === void 0 ? void 0 : _b.last_digits) || "";
        const bankName = ((_c = omiseChargeRes.card) === null || _c === void 0 ? void 0 : _c.bank) || "";
        let isPromotion = false;
        let promotionCredit = 0;
        if (topup.type === "PROMOTION") {
            isPromotion = true;
            promotionCredit = topup.credit - topup.price;
        }
        const wallet = yield wallet_1.Wallet.findOne({ user: userData._id }).exec();
        if (!wallet) {
            throw {
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message
            };
        }
        const paymentHistory = yield (0, paymentHistory_1.createdPaymentHistoryService)({
            user: user.id,
            paymentID: data.paymentID,
            topupPackage: topup.packageName,
            topupPackageID: topup.id,
            credit: topup.credit,
            remainingCredit: wallet.credit,
            isPromotion,
            promotionCredit,
            price: topup.price,
            point: (topup === null || topup === void 0 ? void 0 : topup.point) || 0,
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
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: config_1.messages.CREATE_SUCCESSFUL.message,
            paymentHistory,
            omiseTransactionDetail: omiseChargeRes,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.createPaymentWithOmise = createPaymentWithOmise;
const createPromptPayPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Extract user from auth middleware
        const data = req.body;
        // Fetch user data to get Omise customer ID
        // const userData = await findUserByIDService(req, user.id);
        // const omiseCustomerId = userData.userOpnID; // Omise customer ID
        // if (!omiseCustomerId) {
        // 	res.status(400).json({ message: "User does not have an Omise customer ID." });
        // 	return;
        // }
        // Validate top-up details
        const topup = yield (0, topup_1.findTopupByIDService)(data.id);
        if (!topup) {
            res.status(404).json({ message: "Top-up not found." });
            return;
        }
        // Generate transaction details
        const transactionID = (0, helper_1.createTransactionID)();
        // let promotionCredit = 0;
        // if (topup.type === "PROMOTION") {
        // 	promotionCredit = topup.credit - topup.price;
        // }
        const amount = topup.price * 100; // Amount in the smallest currency unit
        const description = `PromptPay charge for order ${transactionID}`;
        const currency = data.currency;
        const returnUri = "http://www.example.com/orders/complete"; // Static URI or dynamic as needed
        // Create PromptPay charge
        const promptPayCharge = yield (0, helper_1.createPromptPayCharge)(amount, currency, description, returnUri);
        if (!promptPayCharge || (promptPayCharge.status !== "pending" && promptPayCharge.status !== "successful")) {
            res.status(400).json({
                code: config_1.messages.INTERNAL_SERVER_ERROR.code,
                // message: messages.INTERNAL_SERVER_ERROR.message,
                message: `Charge creation failed with status: ${(promptPayCharge === null || promptPayCharge === void 0 ? void 0 : promptPayCharge.status) || "unknown"}`,
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
            promotionCredit = topup.credit - topup.price;
        }
        // Fetch user data (assuming userOmiseID is stored similarly to userStripeID)
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        const wallet = yield wallet_1.Wallet.findOne({ user: userData._id }).exec();
        if (!wallet) {
            throw {
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message
            };
        }
        // Save payment history
        const paymentHistory = yield (0, paymentHistory_1.createdPaymentHistoryService)({
            user: user.id,
            paymentID: data.paymentID,
            topupPackage: topup.packageName,
            topupPackageID: topup.id,
            credit: topup.credit,
            remainingCredit: wallet.credit,
            isPromotion,
            promotionCredit,
            price: topup.price,
            point: (topup === null || topup === void 0 ? void 0 : topup.point) || 0,
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
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: config_1.messages.CREATE_SUCCESSFUL.message,
            paymentHistory,
            promptPayCharge,
        });
    }
    catch (error) {
        console.error("Error processing PromptPay payment: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
    }
});
exports.createPromptPayPayment = createPromptPayPayment;
const validatePayload = (payload) => {
    console.log("Validating payload structure...");
    return payload && payload.object === "event" && (payload.key === "charge.complete" || payload.key === "charge.create");
};
const validateCharge = (charge) => {
    console.log("Validating charge object...");
    console.log("Charge payload:", charge);
    return typeof charge === "object" && charge.object === "charge";
};
const handleOmiseWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let paymentHistorydata = yield (0, paymentHistory_1.findPaymentHistoryByOmiseIDService)(chargeId);
        if (!paymentHistorydata) {
            res.status(404).json({ message: "Payemnt history not found" });
        }
        // Validate top-up details
        const topup = yield (0, topup_1.findTopupByIDService)(paymentHistorydata.topupPackageID);
        if (!topup) {
            res.status(404).json({ message: "Top-up not found." });
            return;
        }
        const userData = yield (0, user_1.findUserDataByIdService)(paymentHistorydata.user);
        let charge_status = "";
        // Handle charge status
        if (chargeStatus === "successful") {
            console.log(`Charge ${chargeId} was successful`);
            charge_status = "SUCCESS";
            yield updatePaymentStatus(chargeId, "SUCCESS");
            let messagesNoti = `คุณได้เติมเงินผ่าน ${paymentHistorydata.paymentChannel} สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
            // Handle promotional points and wallet credit
            if (topup.type === "PROMOTION") {
                messagesNoti = `คุณได้รับ ${topup.point} พอยท์ จากการเติมเงินผ่าน ${paymentHistorydata.paymentChannel} สำหรับแพกเกจ ${topup.packageName}. จำนวนเงินที่ชำระ: ${topup.price} THB.`;
                yield (0, user_1.updateUserPointService)(paymentHistorydata.user, topup.point, userData.point);
            }
            yield (0, user_1.updateWalletCreditByUserID)(topup.credit, userData);
            // send notification
            try {
                let notificationBody = {
                    recipient: paymentHistorydata.user,
                    title: "เติมเงินสำเร็จ!",
                    detail: messagesNoti,
                    type: "PAYMENT",
                    platform: "EV",
                    recipientRole: "CUSTOMER"
                };
                const response = yield axios_1.default.post(`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications`, notificationBody);
                console.log("Notification sent successfully:", response.data);
            }
            catch (error) {
                console.error("Error sending notification:", error);
                // throw error;
            }
        }
        else if (chargeStatus === "failed") {
            console.log(`Charge ${chargeId} failed`);
            charge_status = "FAILED";
            yield updatePaymentStatus(chargeId, "FAILED");
        }
        else if (chargeStatus === "pending") {
            console.log(`Charge ${chargeId} is pending`);
            charge_status = "PENDING";
            yield updatePaymentStatus(chargeId, "PENDING");
        }
        else {
            console.log(`Unhandled charge status: ${chargeStatus}`);
        }
        console.log("Webhook processing complete");
        //emit socket event
        // const url = 'http://localhost:3000/v1/api/payment-socket';
        const url = process.env.SOCKET_URL;
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
            const response = yield axios_1.default.post(url, payload);
            console.log('============>>>Response:', response.data);
        }
        catch (error) {
            console.error('Error sending request:', error);
        }
        res.status(200).json({ message: "Webhook processed successfully" });
    }
    catch (error) {
        console.error("Error handling Omise webhook:", error);
        res.status(500).json({ message: "Internal Server Error", detail: error });
    }
});
exports.handleOmiseWebhook = handleOmiseWebhook;
const updatePaymentStatus = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the payment record by transaction ID and update its status
        const transaction = yield (0, paymentHistory_1.updatePaymentHistoryByTransactionIDService)(transactionId, status);
        console.log("transaction: ", transaction);
        console.log(`Payment status for transaction ${transactionId} updated to ${status}`);
    }
    catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
    }
});
// create a payment history record use point
const createPointPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Extract user from auth middleware
        const data = req.body;
        // Fetch user data
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        if (!(userData === null || userData === void 0 ? void 0 : userData.point)) {
            res.status(400).json({
                code: config_1.messages.BAD_REQUEST.code,
                message: "User points not found or invalid."
            });
            return;
        }
        // Fetch top-up package details
        const topup = yield (0, topup_1.findTopupByIDService)(data.id);
        if (!topup) {
            console.log("Topup not found.");
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
                code: config_1.messages.INSUFFICIENT_POINT.code,
                message: config_1.messages.INSUFFICIENT_POINT.message,
            });
            return;
        }
        let isPromotion = false;
        let promotionCredit = 0;
        if (topup.type === "PROMOTION") {
            isPromotion = true;
            promotionCredit = topup.credit - topup.price;
        }
        // console.log("userData.id", userData._id)
        const wallet = yield wallet_1.Wallet.findOne({ user: userData._id }).exec();
        if (!wallet) {
            throw {
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message
            };
        }
        // Deduct points from the user
        const updatedPoints = userData.point - requiredPoints;
        yield (0, user_1.updateUserPoints)(req, user.id, updatedPoints); // Deduct points (negative value)
        // Create transaction ID for internal tracking
        const transactionID = (0, helper_1.createTransactionID)();
        // Status is SUCCESS since it's an immediate point deduction
        const status = "SUCCESS";
        const price = topup.pointPrice;
        // console.log("price: ", price);
        // Create payment history
        const paymentHistory = yield (0, paymentHistory_1.createdPaymentHistoryService)({
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
            yield (0, user_1.updateWalletPointCreditByUserID)(topup.credit, user);
        }
        catch (creditError) {
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
            };
            const response = yield axios_1.default.post(`${process.env.NOTIFICATION_SERVICE}/v1/api/notifications/user`, notificationBody, {
                headers: {
                    Authorization: `${req.headers["authorization"]}`,
                },
            });
            console.log("Notification sent successfully:", response.data);
        }
        catch (error) {
            console.error("Error sending notification:", error);
            // throw error;
        }
        res.status(201).json({
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: config_1.messages.CREATE_SUCCESSFUL.message,
            paymentHistory,
            usedPoints: requiredPoints,
        });
        return;
    }
    catch (error) {
        console.error("Error processing point-based payment: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
    }
});
exports.createPointPayment = createPointPayment;
// controller for dashboard
const getUserDashboardPaymentHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.params.id;
        const { card: queryCard, bank: queryBank, point: queryPoint, startDate, endDate } = req.query;
        // Fetch topups and count using the reusable function
        const userPaymentHistory = yield (0, paymentHistory_1.fetchPaymentHistoriesForDashboardByUserIDService)(userId, queryCard, queryBank, queryPoint, startDate, endDate);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            userPaymentHistory,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getUserDashboardPaymentHistories = getUserDashboardPaymentHistories;
const getDashboardPaymentHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let userId: any = req.params.id;
        const { card: queryCard, bank: queryBank, point: queryPoint, startDate, endDate } = req.query;
        // Fetch topups and count using the reusable function
        const userPaymentHistory = yield (0, paymentHistory_1.fetchPaymentHistoriesForDashboardService)(queryCard, queryBank, queryPoint, startDate, endDate);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: config_1.messages.SUCCESSFULLY.message,
            userPaymentHistory,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getDashboardPaymentHistories = getDashboardPaymentHistories;
// create charge payment history 
const createChargePaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credit, chargeStartTime, chargeEndTime, energyImport, chargingStationName, chargerMachineName, chargerTypeName, } = req.body;
        const userToken = req.user;
        const record = yield (0, paymentHistory_1.createdChargePaymentHistoryService)({
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
            code: config_1.messages.SUCCESSFULLY.code,
            message: config_1.messages.SUCCESSFULLY.message,
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.createChargePaymentHistory = createChargePaymentHistory;
// create reserve payment history 
const createReservePaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credit, } = req.body;
        const userToken = req.user;
        const record = yield (0, paymentHistory_1.createdReservePaymentHistoryService)({
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
            code: config_1.messages.SUCCESSFULLY.code,
            message: config_1.messages.SUCCESSFULLY.message,
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.createReservePaymentHistory = createReservePaymentHistory;
// create fee payment history 
const createFeePaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creditFee, durationFee, } = req.body;
        const userToken = req.user;
        const credit = creditFee * durationFee;
        const record = yield (0, paymentHistory_1.createdFeePaymentHistoryService)({
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
            code: config_1.messages.SUCCESSFULLY.code,
            message: config_1.messages.SUCCESSFULLY.message,
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.createFeePaymentHistory = createFeePaymentHistory;
