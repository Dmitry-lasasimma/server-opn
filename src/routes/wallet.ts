import express, { type Request, type Response } from "express";
import {
	createWallet,
	getWalletByID,
	getWallets,
	updateWalletByID,
	deleteWalletByID,
	getWalletByUser,
	getWalletAggregateByUser,
	getWalletByUserServer,
	updateWalletByUserServer,
} from "../controllers/wallet";
import { checkAuthorizationMiddleware } from "../middlewares";
import { validateCreateWallet, validateParamID } from "../validators/wallet";

const router = express.Router();

router.post(
	"/",
	checkAuthorizationMiddleware,
	validateCreateWallet,
	createWallet,
);

router.get(
	"/user",
	checkAuthorizationMiddleware,
	getWalletByUser,
);

router.get(
	"/user-aggregate",
	checkAuthorizationMiddleware,
	getWalletAggregateByUser,
);

router.get(
	"/server",
	getWalletByUserServer,
);

router.put(
	"/server",
	updateWalletByUserServer,
);

router.get(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	getWalletByID,
);

router.get("/", checkAuthorizationMiddleware, getWallets);

router.put(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	updateWalletByID,
);

router.delete(
	"/:id",
	checkAuthorizationMiddleware,
	validateParamID,
	deleteWalletByID,
);



export default router;
