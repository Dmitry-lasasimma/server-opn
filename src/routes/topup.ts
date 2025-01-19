import express, { type Request, type Response } from "express";
import {
	createTopup,
	getTopupByID,
	getTopups,
	updateTopupByID,
	deleteManyTopups,
} from "../controllers/topup";
import { checkAuthorizationMiddleware, checkAuthorizationAdminRole, } from "../middlewares";
import { validateCreateTopup, validateParamID, validateDeleteManyTopup } from "../validators/topup";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	validateCreateTopup,
	createTopup,
);

router.get("/:id", checkAuthorizationMiddleware, validateParamID, getTopupByID);

router.get("/", checkAuthorizationMiddleware, getTopups);

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	updateTopupByID,
);

router.delete(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateDeleteManyTopup,
	deleteManyTopups,
);

export default router;
