import type { Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcryptjs";

import {
	registerService,
	registerPhoneService,
} from "../../services/auth";
import {
	findUserByEmailService,
	findUserByPhoneService,
	findUserByIdService,
	updateUserService,
	findUserPinByIdService,
	updateUserServiceLogin
} from "../../services/user";
import { generateToken } from "../../utils/jwt";
import { IErrorResponse, messages } from "../../config";
import { generateUserId } from "../../utils/helper";
import { findStaffByIdService, findStaffByUserNameService } from "../../services/staff";
import jwt, { type VerifyErrors } from "jsonwebtoken";
import { UserStatus } from "../../models/user";

interface RegisterResponse {
	code: string;
	message: string;
	user: any;
	accessToken: string;
	refreshToken: string;
}



export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, pin } = req.body;
		const deviceToken = req.headers["devicetoken"] as string | undefined;
		console.log("deviceToken", deviceToken)

		const user = await findUserByEmailService(email);
		if (user && (await user.matchPin(pin))) {
			const fullName: string = `${user.firstName} ${user.lastName}`;

			// Update deviceToken in the database
			if (deviceToken) {
				const currentUser: any = await findUserByIdService(user._id as string);
				if (currentUser.deviceToken !== deviceToken) {
					let updateData: any = {
						deviceToken: deviceToken
					}
					await updateUserServiceLogin(user._id as string, updateData);
				}
			}

			// Remove the pin and save the user
			user.pin = "";

			const { accessToken, refreshToken } = generateToken(
				user._id as string,
				user.status,
				user.role,
				fullName,
			);

			const responseData: RegisterResponse = {
				code: messages.SUCCESSFULLY.code,
				message: messages.SUCCESSFULLY.message,
				user: {
					_id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					fullName: user.fullName,
					status: user.status,
					role: user.role,
					licensePlate: user.licensePlate,
					userID: user.userID,
					deviceToken: user.deviceToken
				},
				accessToken,
				refreshToken,

			};

			res.status(200).json(responseData);
			return;
		}
		res.status(404).json({
			code: messages.NOT_FOUND.code,
			message: messages.NOT_FOUND.code,
			default: "Invalid email or pin",
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

//login with phone number
export const loginUserPhone = async (req: Request, res: Response) => {
	try {
		const { countryCode, phone, pin } = req.body;
		const deviceToken = req.headers["devicetoken"] as string | undefined;
		// console.log("deviceToken", deviceToken)

		const user = await findUserByPhoneService(countryCode, phone);
		if (user && (await user.matchPin(pin))) {
			const fullName: string = `${user.firstName} ${user.lastName}`;

			// Update deviceToken in the database
			if (deviceToken) {
				const currentUser: any = await findUserByIdService(user._id as string);
				if (currentUser.deviceToken !== deviceToken) {
					let updateData: any = {
						deviceToken: deviceToken
					}
					console.log("update user deviceToken")
					await updateUserServiceLogin(user._id as string, updateData);
				}
			}

			// Remove the pin and save the user
			user.pin = "";

			const { accessToken, refreshToken } = generateToken(
				user._id as string,
				user.status,
				user.role,
				fullName,
			);

			const responseData: RegisterResponse = {
				code: messages.SUCCESSFULLY.code,
				message: messages.SUCCESSFULLY.message,
				user: {
					_id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					phone: user.phone,
					fullName: user.fullName,
					status: user.status,
					role: user.role,
					licensePlate: user.licensePlate,
					userID: user.userID,
					deviceToken: user.deviceToken
				},
				accessToken,
				refreshToken,

			};

			res.status(200).json(responseData);
			return;
		}
		res.status(404).json({
			code: messages.NOT_FOUND.code,
			message: messages.NOT_FOUND.code,
			default: "Invalid phone or pin",
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};


export const loginAdmin = async (req: Request, res: Response) => {
	try {
		const { userName, password } = req.body;

		const staff = await findStaffByUserNameService(userName);
		if (!staff) {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: messages.BAD_REQUEST.message,
				detail: "Invalid username or password",
			});
			return;
		}

		// TODO: Compare password
		const compare_password = await bcrypt.compare(password, staff.password);
		if (!compare_password) {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: messages.BAD_REQUEST.message,
				detail: "Invalid username or password",
			});
			return;
		}

		staff.password = "";

		const { accessToken, refreshToken } = generateToken(
			staff._id as string,
			staff.status,
			staff.role,
			staff.fullName,
		);

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Login successfully",
			accessToken,
			refreshToken,
			staff,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};


export const registerUser = async (req: Request, res: Response) => {
	try {
		const { email, firstName, lastName, licensePlate, pin, deviceToken, profileImage } = req.body;
		console.log("deviceToken", deviceToken)
		const userID: string = generateUserId();
		const fullName: string = `${firstName} ${lastName}`;
		const user = await registerService(
			email,
			pin,
			firstName,
			lastName,
			licensePlate,
			userID,
			fullName,
			deviceToken,
			profileImage
		);
		res.status(200).json(user);
		return;
	} catch (error) {
		console.log("error: ", error);
		if ((error as IErrorResponse).code === "EV-409") {
			res.status(409).json({
				code: messages.USER_ALREADY_EXISTS.code,
				message: messages.USER_ALREADY_EXISTS.message
			})
			return;
		}

		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
	}
};
//register with phone number
export const registerUserPhone = async (req: Request, res: Response) => {
	try {
		const { countryCode, phone, firstName, lastName, licensePlate, pin, deviceToken, profileImage } = req.body;
		console.log("deviceToken", deviceToken)
		const userID: string = generateUserId();
		const fullName: string = `${firstName} ${lastName}`;
		const user = await registerPhoneService(
			countryCode,
			phone,
			pin,
			firstName,
			lastName,
			licensePlate,
			userID,
			fullName,
			deviceToken,
			profileImage
		);
		res.status(200).json(user);
		return;
	} catch (error) {
		console.log("error: ", error);
		if ((error as IErrorResponse).code === "EV-409") {
			res.status(409).json({
				code: messages.USER_ALREADY_EXISTS.code,
				message: messages.USER_ALREADY_EXISTS.message
			})
			return;
		}

		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { email, pin } = req.body;
		const user = await findUserByEmailService(email);
		if (!user) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "User not found with this email",
			});
			return;
		}

		//TODO: Hash the new password
		const hashedPassword = await bcrypt.hash(pin, 10);

		//TODO: Update the user's pin
		const userData = await updateUserServiceLogin(user._id as string, {
			pin: hashedPassword
		})

		const responseData = {
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
			user: {
				_id: userData._id,
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				fullName: userData.fullName,
				status: userData.status,
				role: userData.role,
				licensePlate: userData.licensePlate,
				userID: userData.userID,
			},
		}

		res.status(200).json(responseData);
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

// reset password with phone number
export const phoneResetPassword = async (req: Request, res: Response) => {
	try {
		const { countryCode, phone, pin } = req.body;
		const user = await findUserByPhoneService(countryCode, phone);
		if (!user) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "User not found with this email",
			});
			return;
		}

		//TODO: Hash the new password
		const hashedPassword = await bcrypt.hash(pin, 10);

		//TODO: Update the user's pin
		const userData = await updateUserServiceLogin(user._id as string, {
			pin: hashedPassword
		})

		const responseData = {
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
			user: {
				_id: userData._id,
				firstName: userData.firstName,
				lastName: userData.lastName,
				phone: userData.phone,
				fullName: userData.fullName,
				status: userData.status,
				role: userData.role,
				licensePlate: userData.licensePlate,
				userID: userData.userID,
			},
		}

		res.status(200).json(responseData);
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};


export const verifyRefreshToken = async (
	req: Request,
	res: Response,
): Promise<Response | void> => {
	try {
		const { refreshToken } = req.body;
		const userData = (req as any).user;

		let user: any = {};

		//TODO: if role does not CUSTOMER then get from staff collection
		if (userData.role !== "CUSTOMER") {
			user = await findStaffByIdService(userData.id);
		} else {
			user = await findUserByIdService(userData.id);
		}

		if (!user) {
			res.status(403).json({
				code: messages.FORBIDDEN.code,
				message: messages.FORBIDDEN.message
			});
			return
		}
		jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET_KEY as string,
			(err: VerifyErrors | null) => {
				if (err) {
					res.status(403).json({
						code: messages.FORBIDDEN.code,
						message: messages.FORBIDDEN.message,
					});
					return
				}

				// Generate new access and refresh tokens
				const newAccessToken = jwt.sign(
					{
						id: user.id,
						fullName: user.fullName,
						status: user.status,
						role: user.role,
					},
					process.env.JWT_SECRET_KEY as string,
					{ expiresIn: process.env.JWT_TOKEN_EXPIRES },
				);

				const newRefreshToken = jwt.sign(
					{
						fullName: user.fullName,
						id: user.id,
						status: user.status,
						role: user.role,
					},
					process.env.JWT_REFRESH_SECRET_KEY as string,
					{ expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES },
				);

				res.status(200).json({
					code: messages.SUCCESSFULLY.code,
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				});
				return;
			},
		);
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return
	}
};

export const checkPin = async (req: Request, res: Response) => {
	try {
		const userToken = (req as any).user;
		const { pin } = req.body;
		console.log("userToken: ", userToken);
		console.log("pin: ", pin);
		const user = await findUserPinByIdService(userToken.id);
		if (!user) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "User not found with this email",
			});
			return;
		}

		if (await user.matchPin(pin)) {
			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				message: messages.SUCCESSFULLY.message,
			});
			return;
		} else {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: messages.BAD_REQUEST.message,
				detail: "Invalid pin",
			});
			return;
		}
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const updatePin = async (req: Request, res: Response) => {
	try {
		const userToken = (req as any).user;
		const { currentPin, newPin } = req.body;

		const userData = await findUserPinByIdService(userToken.id);
		if (!userData) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "User not found with this email",
			});
			return;
		}

		if (await userData.matchPin(currentPin)) {
			const newHashedPin = await bcrypt.hash(newPin, 10);
			let updates = {
				pin: newHashedPin
			}
			await updateUserServiceLogin(userData.id, updates);
			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				message: messages.SUCCESSFULLY.message,
			});
			return;
		} else {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: messages.BAD_REQUEST.message,
				detail: "Invalid pins",
			});
			return;
		}
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const userToken = (req as any).user;
		const user = await findUserByIdService(userToken.id);
		if (!user) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
				detail: "User not found with this email",
			});
			return;
		}

		let updates = {
			status: UserStatus.BLOCKED
		}

		await updateUserServiceLogin(userToken.id, updates);

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};