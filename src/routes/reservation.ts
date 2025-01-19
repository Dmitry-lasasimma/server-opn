import express, { type Request, type Response } from "express";
import {
	createReservation,
	getReservationByID,
	getReservations,
	updateReservationByID,
	deleteReservationByID,
} from "../controllers/reservation";
import { CheckAuthorizationMiddleware } from "../middlewares";
import { checkAuthorizationMiddleware } from "../middlewares";
import {
	validateCreateReservation,
	validateParamID,
} from "../validators/reservation";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	validateCreateReservation,
	createReservation,
);
// router.post(
// 	"/create-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		createReservation(req, res);
// 	},
// );

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getReservationByID,
);
// router.get(
// 	"/get-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		getReservationByID(req, res);
// 	},
// );

router.get("/", checkAuthorizationMiddleware, getReservations);
// router.get(
// 	"/get-many-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		getReservations(req, res);
// 	},
// );

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	updateReservationByID,
);
// router.put(
// 	"/update-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		updateReservationByID(req, res);
// 	},
// );

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	deleteReservationByID,
);
// router.delete(
// 	"/delete-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		deleteReservationByID(req, res);
// 	},
// );

export default router;
