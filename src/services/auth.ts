import dotenv from "dotenv";

import { userModel } from "../models/user";
import { generateToken } from "../utils/jwt";
import axios from "axios"; // Make sure to install axios using npm or yarn
import jwt from "jsonwebtoken";
import { messages } from "../config";

dotenv.config();

export const loginService = async (email: string, pin: string) => {
	const user = await userModel
		.findOne({ email, status: { $ne: "BLOCKED" } })
		.exec();
	if (!user) {
		throw new Error("User not found");
	}
	const isMatch = await user.matchPin(pin);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}
	const { accessToken, refreshToken } = generateToken(
		user._id as string,
		user.status,
		user.role,
		user.fullName,
	);
	return {
		message: "Login successfully",
		user,
		accessToken,
		refreshToken,
	};
};
// export const registerService = async (email: string, pin: string, firstName: string, lastName: string, licensePlate: string, userID: string, fullName: string) => {
//     const user = await userModel.create({
//         email,
//         pin,
//         firstName,
//         lastName,
//         licensePlate,
//         userID,
//         fullName
//     })
//     const { accessToken, refreshToken } = generateToken(user._id as string, fullName, user.status, user.role);
//     return {
//         message: 'Created user successfully',
//         user,
//         accessToken,
//         refreshToken
//     }
// }

export const registerService = async (
	email: string,
	pin: string,
	firstName: string,
	lastName: string,
	licensePlate: string,
	userID: string,
	fullName: string,
	deviceToken: string,
	profileImage: string,
) => {
	let user = null; // Variable to hold created user reference
	try {

		// Check if the user already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			throw messages.USER_ALREADY_EXISTS.code;
		}

		// Create user
		user = await userModel.create({
			email,
			pin,
			firstName,
			lastName,
			licensePlate,
			userID,
			fullName,
			deviceToken,
			profileImage,
		});

		// Generate tokens
		const { accessToken, refreshToken } = generateToken(
			user._id as string,
			fullName,
			user.status,
			user.role,
		);

		// Create wallet
		const walletResponse = await axios.post(
			`${process.env.PAYMENT_SERVICE_URL}/v1/api/wallets/`,
			{
				user: user._id, // Use the newly created user's ID
				credit: 0,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`, // Sending authorization token in the header
				},
			},
		);

		// Return response
		return {
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			user: {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				fullName: user.fullName,
				status: user.status,
				role: user.role,
				licensePlate: user.licensePlate,
				userID: user.userID
			},
			accessToken,
			refreshToken,
			wallet: walletResponse.data, // Include wallet info in the response if desired
		};
	} catch (error) {
		console.error("Error during registration:", error);

		// Rollback: Delete the created user if wallet creation failed
		if (user) {
			try {
				await userModel.findByIdAndDelete(user._id);
				console.log("Rolled back: Deleted user after wallet creation failure");
			} catch (rollbackError) {
				console.error(
					"Rollback error: Failed to delete user after wallet creation failure",
					rollbackError,
				);
			}
		}

		if (error == messages.USER_ALREADY_EXISTS.code) {
			throw messages.USER_ALREADY_EXISTS;
		}

		throw "Failed to register user or create wallet";
	}
};
export const registerPhoneService = async (
	countryCode: string,
	phone: string,
	pin: string,
	firstName: string,
	lastName: string,
	licensePlate: string,
	userID: string,
	fullName: string,
	deviceToken: string,
	profileImage: string
) => {
	let user = null; // Variable to hold created user reference
	try {

		// Check if the user already exists
		const existingUser = await userModel.findOne({ phone });
		if (existingUser) {
			throw messages.USER_ALREADY_EXISTS.code;
		}

		// Create user
		user = await userModel.create({
			countryCode,
			phone,
			pin,
			firstName,
			lastName,
			licensePlate,
			userID,
			fullName,
			deviceToken,
			profileImage,
		});

		// Generate tokens
		const { accessToken, refreshToken } = generateToken(
			user._id as string,
			fullName,
			user.status,
			user.role,
		);

		// Create wallet
		const walletResponse = await axios.post(
			`${process.env.PAYMENT_SERVICE_URL}/v1/api/wallets/`,
			{
				user: user._id, // Use the newly created user's ID
				credit: 0,
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`, // Sending authorization token in the header
				},
			},
		);

		// Return response
		return {
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			user: {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				fullName: user.fullName,
				status: user.status,
				role: user.role,
				licensePlate: user.licensePlate,
				userID: user.userID
			},
			accessToken,
			refreshToken,
			wallet: walletResponse.data, // Include wallet info in the response if desired
		};
	} catch (error) {
		console.error("Error during registration:", error);

		// Rollback: Delete the created user if wallet creation failed
		if (user) {
			try {
				await userModel.findByIdAndDelete(user._id);
				console.log("Rolled back: Deleted user after wallet creation failure");
			} catch (rollbackError) {
				console.error(
					"Rollback error: Failed to delete user after wallet creation failure",
					rollbackError,
				);
			}
		}

		if (error == messages.USER_ALREADY_EXISTS.code) {
			throw messages.USER_ALREADY_EXISTS;
		}

		throw "Failed to register user or create wallet";
	}
};

// export const registerService = async (
// 	email: string,
// 	pin: string,
// 	firstName: string,
// 	lastName: string,
// 	licensePlate: string,
// 	userID: string,
// 	fullName: string,
// ) => {
// 	try {
// 		// Create user
// 		const user = await userModel.create({
// 			email,
// 			pin,
// 			firstName,
// 			lastName,
// 			licensePlate,
// 			userID,
// 			fullName,
// 		});

// 		// Generate tokens
// 		const { accessToken, refreshToken } = generateToken(
// 			user._id as string,
// 			fullName,
// 			user.status,
// 			user.role,
// 		);

// 		// Create wallet
// 		const walletResponse = await axios.post(
// 			"http://localhost:9090/v1/api/wallet/",
// 			{
// 				user: user._id, // Use the newly created user's ID
// 				credit: 0,
// 			},
// 			{
// 				headers: {
// 					Authorization: `Bearer ${accessToken}`, // Sending authorization token in the header
// 				},
// 			},
// 		);

// 		// Return response
// 		return {
// 			message: "Created user and wallet successfully",
// 			user,
// 			accessToken,
// 			refreshToken,
// 			wallet: walletResponse.data, // Include wallet info in the response if desired
// 		};
// 	} catch (error) {
// 		console.error("Error during registration:", error);
// 		throw new Error("Failed to register user or create wallet");
// 	}
// };

interface UserData {
	id: string;
	fullName: string;
	status: string;
	role: string;
}

export const getUserDataOnRefreshToken = (
	refreshToken: string,
): UserData | "TOKEN_EXPIRED" | null => {
	try {
		// Verify the refresh token and extract user data (id and status)
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET_KEY as string,
		) as { id: string; fullName: string; status: string; role: string };
		const { id, fullName, status, role } = decoded;

		return { id, fullName, status, role };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		// Check if the error is a token expiration error
		if (error.name === "TokenExpiredError") {
			return "TOKEN_EXPIRED"; // Token expired error
		}
		// Return null for other errors (e.g., invalid token)
		return null;
	}
};

export interface TokenData {
	id: string;
	fullName: string;
	status: string;
	role: string;
}
interface JwtPayload {
	id: string;
	fullName: string;
	status: string;
	role: string;
}

// export const getUserDataOnToken = (req: Request): TokenData | null => {
// 	try {
// 		// biome-ignore lint/complexity/useLiteralKeys: <explanation>
// 		const authorization = req.headers["authorization"];
// 		if (!authorization || !authorization.startsWith("Bearer ")) {
// 			throw new Error("Invalid or missing Authorization header");
// 		}

// 		const token = authorization.split(" ")[1]; // Extract the token after "Bearer "
// 		const secretKey = process.env.JWT_SECRET_KEY as string;
// 		// console.log("JWT Secret Key:", secretKey);

// 		const decoded = jwt.verify(token, secretKey) as JwtPayload;

// 		if (
// 			typeof decoded !== "object" ||
// 			!("id" in decoded) ||
// 			!("role" in decoded)
// 		) {
// 			throw new Error("Invalid token structure");
// 		}

// 		const { id, fullName, status, role } = decoded;
// 		return { id, fullName, status, role };
// 	} catch (error) {
// 		console.error("Token verification error:", (error as Error).message);
// 		return null;
// 	}
// };
