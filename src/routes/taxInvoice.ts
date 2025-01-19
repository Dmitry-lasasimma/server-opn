import express, { type Request, type Response } from "express";
import {
	createTaxInvoice,
	getTaxInvoiceByID,
	getTaxInvoices,
	updateTaxInvoiceByID,
	deleteTaxInvoiceByID,
} from "../controllers/taxInvoice";
import { checkAuthorizationMiddleware, checkAuthorizationAdminRole } from "../middlewares";
import {
	validateCreateTaxInvoice,
	validateParamID,
} from "../validators/taxInvoice";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	validateCreateTaxInvoice,
	createTaxInvoice,
);
router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getTaxInvoiceByID,
);
router.get("/", checkAuthorizationMiddleware, getTaxInvoices);

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	updateTaxInvoiceByID,
);

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	deleteTaxInvoiceByID,
);

export default router;
