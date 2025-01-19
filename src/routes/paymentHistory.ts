import express, { type Request, type Response } from "express";
import {
	createPaymentHistory,
	getPaymentHistoryByID,
	getPaymentHistories,
	updatePaymentHistoryByID,
	// createPaymentWithStripe,
	createPaymentWithOmise,
	createPromptPayPayment,
	createPointPayment,
	handleOmiseWebhook,
	getUserDashboardPaymentHistories,
	getDashboardPaymentHistories,
	createChargePaymentHistory,
	createReservePaymentHistory,
	createFeePaymentHistory,
} from "../controllers/paymentHistory";
import { checkAuthorizationMiddleware, checkAuthorizationAdminRole } from "../middlewares";
import {
	validateCreatePaymentWithStripe,
	validateCreatePaymentHistory,
	validateParamID,
	validateCreatePaymentWithOmise,
	validateCreateChargePaymentHistory,
	validateCreateReservePaymentHistory,
	validateCreateFeePaymentHistory,
} from "../validators/paymentHistory";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	validateCreatePaymentHistory,
	createPaymentHistory,
);

router.post(
	"/charge",
	checkAuthorizationMiddleware,
	validateCreateChargePaymentHistory,
	createChargePaymentHistory,
);
router.post(
	"/reserve",
	checkAuthorizationMiddleware,
	validateCreateReservePaymentHistory,
	createReservePaymentHistory,
);
router.post(
	"/fee",
	checkAuthorizationMiddleware,
	validateCreateFeePaymentHistory,
	createFeePaymentHistory,
);

router.get("/dashboard", checkAuthorizationMiddleware, checkAuthorizationAdminRole, getDashboardPaymentHistories);

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getPaymentHistoryByID,
);


router.get("/dashboard/:id", checkAuthorizationMiddleware, getUserDashboardPaymentHistories);


router.get("/", checkAuthorizationMiddleware, getPaymentHistories);

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	updatePaymentHistoryByID,
);

// router.post(
// 	"/stripe-payment",
// 	checkAuthorizationMiddleware,
// 	validateCreatePaymentWithStripe,
// 	createPaymentWithStripe,
// );

router.post(
	"/omise-payment",
	checkAuthorizationMiddleware,
	validateCreatePaymentWithOmise,
	createPaymentWithOmise,
);

router.post(
	"/omise-promptpay-payment",
	checkAuthorizationMiddleware,
	createPromptPayPayment,
);

router.post(
	"/point-payment",
	checkAuthorizationMiddleware,
	createPointPayment,
);

router.post(
	"/omise-promptpay-webhook",
	handleOmiseWebhook,
);

export default router;
