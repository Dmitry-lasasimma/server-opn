"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const card_1 = require("../controllers/card");
const middlewares_1 = require("../middlewares");
const paymentHistory_1 = require("../validators/paymentHistory");
const card_2 = require("../validators/card");
const router = express_1.default.Router();
// router.post("/", checkAuthorizationMiddleware, validateCreateCard, createCard);
router.post("/create-customer", middlewares_1.checkAuthorizationMiddleware, paymentHistory_1.validateCreateCard, card_1.createCard);
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, card_1.getCardByID);
router.get("/", middlewares_1.checkAuthorizationMiddleware, card_1.getCards);
router.delete("/:id", middlewares_1.checkAuthorizationMiddleware, card_1.deleteCardByID);
router.put("/default-card/:id", middlewares_1.checkAuthorizationMiddleware, card_2.validateUpdateDefaultCard, card_1.updateDefaultCard);
exports.default = router;
