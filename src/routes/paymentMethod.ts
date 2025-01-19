import express from "express";
import {
    createPaymentMethod,
    getPaymentMethodByID,
    getPaymentMethods,
    updatePaymentMethodByID,
    deleteManyPaymentMethods,
    updatePaymentMethodsStatus,
} from "../controllers/paymentMethod";
import { checkAuthorizationMiddleware, checkAuthorizationAdminRole } from "../middlewares";
import {
    validateCreatePaymentMethod,
    validateParamID,
} from "../validators/paymentMethod";

const router = express.Router();

router.post(
    "/",
    checkAuthorizationMiddleware,
    checkAuthorizationAdminRole,
    validateCreatePaymentMethod,
    createPaymentMethod,
);
router.get(
    "/:id",
    validateParamID,
    getPaymentMethodByID,
);
router.get("/", getPaymentMethods);
router.put(
    "/:id",
    checkAuthorizationMiddleware,
    checkAuthorizationAdminRole,
    validateParamID,
    updatePaymentMethodByID,
);
router.put(
    "/",
    checkAuthorizationMiddleware,
    checkAuthorizationAdminRole,
    updatePaymentMethodsStatus,
);
router.delete(
    "/:id",
    checkAuthorizationMiddleware,
    validateParamID,
    deleteManyPaymentMethods,
);

export default router;
