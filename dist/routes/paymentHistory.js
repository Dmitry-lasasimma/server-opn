"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentHistory_1 = require("../controllers/paymentHistory");
const middlewares_1 = require("../middlewares");
const paymentHistory_2 = require("../validators/paymentHistory");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateCreatePaymentHistory, paymentHistory_1.createPaymentHistory);
router.post("/charge", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateCreateChargePaymentHistory, paymentHistory_1.createChargePaymentHistory);
router.post("/reserve", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateCreateReservePaymentHistory, paymentHistory_1.createReservePaymentHistory);
router.post("/fee", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateCreateFeePaymentHistory, paymentHistory_1.createFeePaymentHistory);
router.get("/dashboard", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, paymentHistory_1.getDashboardPaymentHistories);
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateParamID, paymentHistory_1.getPaymentHistoryByID);
router.get("/dashboard/:id", middlewares_1.checkAuthorizationMiddleware, paymentHistory_1.getUserDashboardPaymentHistories);
router.get("/", middlewares_1.checkAuthorizationMiddleware, paymentHistory_1.getPaymentHistories);
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateParamID, paymentHistory_1.updatePaymentHistoryByID);
// router.post(
// 	"/stripe-payment",
// 	checkAuthorizationMiddleware,
// 	validateCreatePaymentWithStripe,
// 	createPaymentWithStripe,
// );
router.post("/omise-payment", middlewares_1.checkAuthorizationMiddleware, paymentHistory_2.validateCreatePaymentWithOmise, paymentHistory_1.createPaymentWithOmise);
router.post("/omise-promptpay-payment", middlewares_1.checkAuthorizationMiddleware, paymentHistory_1.createPromptPayPayment);
router.post("/point-payment", middlewares_1.checkAuthorizationMiddleware, paymentHistory_1.createPointPayment);
router.post("/omise-promptpay-webhook", paymentHistory_1.handleOmiseWebhook);
exports.default = router;
