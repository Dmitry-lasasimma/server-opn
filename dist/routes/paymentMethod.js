"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentMethod_1 = require("../controllers/paymentMethod");
const middlewares_1 = require("../middlewares");
const paymentMethod_2 = require("../validators/paymentMethod");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, paymentMethod_2.validateCreatePaymentMethod, paymentMethod_1.createPaymentMethod);
router.get("/:id", paymentMethod_2.validateParamID, paymentMethod_1.getPaymentMethodByID);
router.get("/", paymentMethod_1.getPaymentMethods);
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, paymentMethod_2.validateParamID, paymentMethod_1.updatePaymentMethodByID);
router.put("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, paymentMethod_1.updatePaymentMethodsStatus);
router.delete("/:id", middlewares_1.checkAuthorizationMiddleware, paymentMethod_2.validateParamID, paymentMethod_1.deleteManyPaymentMethods);
exports.default = router;
