import express, { type Request, type Response } from "express";
import {
	createCoupon,
	getCouponByID,
	getCoupons,
	updateCouponByID,
	deleteCouponByID,
	generateCoupon,
	redeemCoupon,
	deleteManyCoupons,
	cronJobGetCoupons,
} from "../controllers/coupon";
import { checkAuthorizationMiddleware, checkAuthorizationAdminRole } from "../middlewares";
import {
	validateCreateCoupon,
	validateParamID,
	validateGenerateCoupon,
	validateCheckCoupon,
	validateDeleteManyCoupon,
} from "../validators/coupon";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateCreateCoupon,
	createCoupon,
);

//cron job
router.get("/cron-job", cronJobGetCoupons);

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	getCouponByID,
);

router.get("/", checkAuthorizationMiddleware, checkAuthorizationAdminRole, getCoupons);


router.put(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	updateCouponByID,
);

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	deleteCouponByID,
);

// generate coupon
router.post("/generate-coupon", validateGenerateCoupon, generateCoupon);

// check coupon and redeem
router.post("/redeem", checkAuthorizationMiddleware, validateCheckCoupon, redeemCoupon);

router.delete(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateDeleteManyCoupon,
	deleteManyCoupons,
);
export default router;
