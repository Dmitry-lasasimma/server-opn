import express, { type Request, type Response } from "express";
import {
	createReservationChargeFee,
	getReservationChargeFeeByID,
	updateReservationChargeFeeByID,
} from "../controllers/reservationChargeFee";
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
	createReservationChargeFee,
);

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getReservationChargeFeeByID,
);

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	checkAuthorizationAdminRole,
	validateParamID,
	updateReservationChargeFeeByID,
);

export default router;
