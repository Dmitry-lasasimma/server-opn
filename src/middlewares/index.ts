const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
import { messages } from "../config";
import dotenv from "dotenv";
import { userModel } from "../models/user";
import { staffModel } from "../models/staff";

dotenv.config();
export interface TokenData {
	id: string;
	fullName: string;
	status: string;
	role: string;
}
export interface RequestWithUser extends Request {
	user: TokenData; // Add 'user' property to the request object
}

export const checkAuthorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers["authorization"];
		if (token) {
			const accessToken: string = token.replace("Bearer ", "");
			const payloadData = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
			(req as any).user = payloadData;
			await checkUserStatus((req as any).user.id, (req as any).user.role)
			await checkStaffStatus((req as any).user.id, (req as any).user.role)
		} else {
			res.status(401).json({ code: messages.UNAUTHORIZED.code, message: messages.UNAUTHORIZED.message, detail: "Invalid signature" })
			return;
		}
		next();
	} catch (error) {
		console.log("error: ", error)
		console.log("error.name: ", (error as Error).name)
		if ((error as Error).name === "TokenExpiredError") {
			res.status(401).json({ code: messages.TOKEN_EXPIRED.code, message: messages.TOKEN_EXPIRED.message })
			return;
		}
		res.status(401).json({ code: messages.UNAUTHORIZED.code, message: messages.UNAUTHORIZED.message, detail: "Invalid signature" })
		return;
	}
}

export const checkAuthorizationManagerRole = (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;
	if (user.role !== "EV_MANAGER") {
		res.status(403).json({ code: messages.FORBIDDEN.code, message: messages.FORBIDDEN.message, detail: "Permission denied" })
		return;
	}
	next();
}

export const checkAuthorizationStaffRole = (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;
	if (user.role !== "EV_STAFF" && user.role !== "EV_MANAGER") {
		res.status(403).json({ code: messages.FORBIDDEN.code, message: messages.FORBIDDEN.message, detail: "Permission denied" })
		return;
	}
	next();
}

export const checkAuthorizationAdminRole = (req: Request, res: Response, next: NextFunction) => {
	const user = (req as any).user;
	if (user.role !== "EV_ADMIN" && user.role !== "EV_STAFF" && user.role !== "EV_MANAGER") {
		res.status(403).json({ code: messages.FORBIDDEN.code, message: messages.FORBIDDEN.message, detail: "Permission denied" })
		return;
	}
	next();
}

export const checkAuthorizationRefreshToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { refreshToken } = req.body;

		const payloadData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
		(req as any).user = payloadData;
		next();
	} catch (error) {
		console.log("error: ", error);
		res.status(401).json({ code: messages.UNAUTHORIZED.code, message: messages.UNAUTHORIZED.message, detail: "invalid signature", })
	}
}

// check user&staff status
const checkStaffStatus = async (id: string, role: string) => {
	try {
		if (role === "CUSTOMER") {
			return;
		}
		const user = await staffModel.findById(id).select("-pin -__v").exec();

		if (!user) {
			return null;
		}

		if (user.status === "BLOCKED") {
			throw new Error("USER_NOT_VALID");
		}
		return user;
	} catch (error) {
		console.error("Error in findUserByIdService:", error);
		throw error;
	}
};
const checkUserStatus = async (id: string, role: string) => {
	try {
		if (role !== "CUSTOMER") {
			return;
		}
		const user = await userModel.findById(id).select("-pin -__v").exec();

		if (!user) {
			return null;
		}

		if (user.status === "BLOCKED") {
			throw new Error("USER_NOT_VALID");
		}
		return user;
	} catch (error) {
		console.error("Error in findUserByIdService:", error);
		throw error;
	}
};