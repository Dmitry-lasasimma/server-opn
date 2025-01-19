"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_1 = require("../controllers/coupon");
const middlewares_1 = require("../middlewares");
const coupon_2 = require("../validators/coupon");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, coupon_2.validateCreateCoupon, coupon_1.createCoupon);
//cron job
router.get("/cron-job", coupon_1.cronJobGetCoupons);
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, coupon_2.validateParamID, coupon_1.getCouponByID);
router.get("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, coupon_1.getCoupons);
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, coupon_2.validateParamID, coupon_1.updateCouponByID);
router.delete("/:id", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, coupon_2.validateParamID, coupon_1.deleteCouponByID);
// generate coupon
router.post("/generate-coupon", coupon_2.validateGenerateCoupon, coupon_1.generateCoupon);
// check coupon and redeem
router.post("/redeem", middlewares_1.checkAuthorizationMiddleware, coupon_2.validateCheckCoupon, coupon_1.redeemCoupon);
router.delete("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, coupon_2.validateDeleteManyCoupon, coupon_1.deleteManyCoupons);
exports.default = router;
