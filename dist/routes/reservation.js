"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservation_1 = require("../controllers/reservation");
const middlewares_1 = require("../middlewares");
const reservation_2 = require("../validators/reservation");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, reservation_2.validateCreateReservation, reservation_1.createReservation);
// router.post(
// 	"/create-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		createReservation(req, res);
// 	},
// );
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, reservation_2.validateParamID, reservation_1.getReservationByID);
// router.get(
// 	"/get-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		getReservationByID(req, res);
// 	},
// );
router.get("/", middlewares_1.checkAuthorizationMiddleware, reservation_1.getReservations);
// router.get(
// 	"/get-many-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		getReservations(req, res);
// 	},
// );
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, reservation_2.validateParamID, reservation_1.updateReservationByID);
// router.put(
// 	"/update-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		updateReservationByID(req, res);
// 	},
// );
router.delete("/:id", middlewares_1.checkAuthorizationMiddleware, reservation_2.validateParamID, reservation_1.deleteReservationByID);
// router.delete(
// 	"/delete-reservation",
// 	CheckAuthorizationMiddleware(),
// 	(req: Request, res: Response) => {
// 		deleteReservationByID(req, res);
// 	},
// );
exports.default = router;
