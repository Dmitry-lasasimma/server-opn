"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationChargeFee_1 = require("../controllers/reservationChargeFee");
const middlewares_1 = require("../middlewares");
const reservation_1 = require("../validators/reservation");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, reservation_1.validateCreateReservation, reservationChargeFee_1.createReservationChargeFee);
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, reservation_1.validateParamID, reservationChargeFee_1.getReservationChargeFeeByID);
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, reservation_1.validateParamID, reservationChargeFee_1.updateReservationChargeFeeByID);
exports.default = router;
