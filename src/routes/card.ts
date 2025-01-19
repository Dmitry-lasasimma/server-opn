import express from "express";
import {
	createCard,
	getCardByID,
	getCards,
	deleteCardByID,
	updateDefaultCard,
} from "../controllers/card";
import { checkAuthorizationMiddleware } from "../middlewares";
import { validateCreateCard } from "../validators/paymentHistory";
import { validateUpdateDefaultCard } from "../validators/card";

const router = express.Router();

// router.post("/", checkAuthorizationMiddleware, validateCreateCard, createCard);
router.post("/create-customer", checkAuthorizationMiddleware, validateCreateCard, createCard);

router.get("/:id", checkAuthorizationMiddleware, getCardByID);

router.get("/", checkAuthorizationMiddleware, getCards);

router.delete("/:id", checkAuthorizationMiddleware, deleteCardByID);

router.put(
	"/default-card/:id",
	checkAuthorizationMiddleware,
	validateUpdateDefaultCard,
	updateDefaultCard,
);

export default router;
