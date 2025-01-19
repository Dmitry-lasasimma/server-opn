import express, { type Request, type Response } from "express";
import {
	createReservationConfigure,
	getReservationConfigureByID,
	updateReservationConfigureByID,
} from "../controllers/reservationConfigure";
import {
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
} from "../middlewares";
import {
	validateCreateReservation,
	validateParamID,
} from "../validators/reservation";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateCreateReservation,
	createReservationConfigure,
);

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getReservationConfigureByID,
);

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	updateReservationConfigureByID,
);
export default router;
