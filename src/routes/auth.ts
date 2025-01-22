import express, { type Request, type Response } from "express";
import {
	loginAdmin,
	loginUser,
	registerUser,
	resetPassword,
	verifyRefreshToken,
	checkPin,
	updatePin,
	deleteUser,
	loginUserPhone,
	registerUserPhone,
	phoneResetPassword,
} from "../controllers/auth";
import {
	userLoginValidator,
	validateLogin,
	validateLoginPhone,
	validateResetPassword,
	validateVerifyRefreshToken,
	validatePhoneResetPassword,
} from "../validators/auth";
import { checkAuthorizationMiddleware, checkAuthorizationRefreshToken } from "../middlewares";

const router = express.Router();

router.post("/login", validateLogin, loginUser);

// for phone number login
router.post("/login-phone", validateLoginPhone, loginUserPhone);

router.post("/register", registerUser);

// for phone number register
router.post("/register-phone", registerUserPhone);

router.put("/reset-password", checkAuthorizationMiddleware, validateResetPassword, resetPassword);

// reset password use phone number
router.put("/reset-password-phone", checkAuthorizationMiddleware, validatePhoneResetPassword, phoneResetPassword);

router.post("/login-admin", loginAdmin);

router.post(
	"/verify-refresh-token",
	validateVerifyRefreshToken,
	checkAuthorizationRefreshToken,
	(req: Request, res: Response) => {
		verifyRefreshToken(req, res);
	},
);

router.delete("/delete-account", checkAuthorizationMiddleware, deleteUser)

router.post("/check-pin", checkAuthorizationMiddleware, checkPin);

router.post("/reset-pin", checkAuthorizationMiddleware, updatePin);

export default router;
