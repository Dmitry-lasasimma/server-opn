import axios from "axios";
import type { Request } from "express";
import dotenv from "dotenv";
import { Wallet } from "../models/wallet";
import type { TokenData } from "../middlewares";
import { ObjectId } from "mongodb";
import { userModel, IUser } from "../models/user";
import { messages } from "../config";

dotenv.config();

export const findUserByIDServicev1 = async (req: Request, userId: string) => {
	try {
		const id = userId;
		const { data: userData } = await axios.get(
			`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
			{
				headers: {
					Authorization: `${
						// biome-ignore lint/complexity/useLiteralKeys: <explanation>
						req.headers["authorization"]
						}`,
				},
			},
		);
		if (!userData.user.userStripeID) {
			return null;
		}
		return userData.user;
	} catch (error) {
		console.log("Error find user: ", error);

		throw new Error("Error find user");
	}
};

export const updateUserByIDServicev1 = async (
	req: Request,
	userId: string,
	paymentMethodId: string,
) => {
	try {
		const id = userId;
		const { data: userData } = await axios.put(
			`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
			{ defaultCard: paymentMethodId },
			{
				headers: {
					Authorization: `${
						// biome-ignore lint/complexity/useLiteralKeys: <explanation>
						req.headers["authorization"]
						}`,
				},
			},
		);
		console.log("userData.user: ", userData.user);
		return userData.user;
	} catch (error) {
		console.log("Error find user: ", error);
		throw new Error("Error find user");
	}
};

// export const findUserByIDService = async (req: Request, userId: string) => {
// 	try {
// 		const id = userId;
// 		const { data: userData } = await axios.get(
// 			`http://localhost:8000/v1/api/users/${id}`,
// 			// `${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
// 			{
// 				headers: {
// 					Authorization: `${
// 						// biome-ignore lint/complexity/useLiteralKeys: <explanation>
// 						req.headers["authorization"]
// 						}`,
// 				},
// 			},
// 		);
// 		console.log("userData.use", userData.use)
// 		if (!userData) {
// 			return null;
// 		}
// 		return userData.user;
// 	} catch (error) {
// 		console.log("Error find user: ", error);

// 		throw new Error("Error find user");
// 	}
// };
export const findUserByIDService = async (req: Request, userId: string) => {
	try {
		if (!userId) {
			throw new Error("User ID is required.");
		}

		// const userServiceUrl = process.env.USER_SERVICE_URL_LOCAL;
		const userServiceUrl = process.env.USER_SERVICE_URL;

		// Fetch user data
		const response = await axios.get(`${userServiceUrl}/v1/api/users/${userId}`, {
			headers: {
				Authorization: req.headers["authorization"] || "",
			},
		});
		console.log("response=========================", response)
		const userData = response.data;

		// Check if user data exists
		if (!userData || !userData.user) {
			console.error("User data not found:", userData);
			return null;
		}

		console.log("User data fetched successfully:", userData.user);
		return userData.user;
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			// Axios-specific error handling
			console.error("Axios error:", error.response?.data || error.message);
			if (error.response?.status === 403) {
				throw new Error("Permission denied. Ensure the authorization token is valid.");
			}
		} else {
			console.error("Unexpected error:", error.message);
		}

		throw new Error("Failed to fetch user data. Please check the service logs for more details.");
	}
};

export const updateUserByIDService = async (
	req: Request,
	userId: string,
	cardId: string,
) => {
	try {
		const id = userId;
		const { data: userData } = await axios.put(
			`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
			{ defaultCard: cardId },
			{
				headers: {
					Authorization: `${req.headers["authorization"]
						}`,
				},
			},
		);
		console.log("userData.user: ", userData.user);
		return userData.user;
	} catch (error) {
		console.log("Error find user: ", error);
		throw new Error("Error find user");
	}
};

export const updateUserPoints = async (
	req: Request,
	userId: string,
	point: number,
) => {
	try {
		console.log("-=-=-=-=-=-=-=-=-=-=-=-=-")
		console.log("point ", point)
		const finalPoint = point
		const id = userId;
		const { data: userData } = await axios.put(
			`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
			// `${process.env.USER_SERVICE_URL_LOCAL}/v1/api/users/${id}`,
			{ point: finalPoint },
			{
				headers: {
					Authorization: `${req.headers["authorization"]
						}`,
				},
			},
		);
		// console.log("userData.user: ", userData.user);
		return userData.user;
	} catch (error) {
		console.log("Error find user: ", error);
		throw new Error("Error find user");
	}
};
export const couponupdateUserPoints = async (
	req: Request,
	userId: string,
	point: number,
	userPoint: number,
) => {
	try {
		// console.log("userPoint", userPoint)
		console.log("point ", point)
		const finalPoint = userPoint + point
		const id = userId;
		const { data: userData } = await axios.put(
			`http://localhost:8000/v1/api/users/${id}`,
			// `${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
			{ point: finalPoint },
			{
				headers: {
					Authorization: `${req.headers["authorization"]
						}`,
				},
			},
		);
		// console.log("userData.user: ", userData.user);
		return userData.user;
	} catch (error) {
		console.log("Error find user: ", error);
		throw new Error("Error find user");
	}
};

// updateWalletCreditByUserID
export const updateWalletCreditByUserID = async (
	credit: number,
	userData: IUser,
) => {
	try {
		const wallet = await Wallet.findOne({ user: userData.id }).exec();
		if (!wallet) {
			return {
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message
			}
		}
		console.log("credit: ", credit)
		console.log("wallet: ", wallet)
		const creditAdd = wallet.credit + credit
		console.log("creditAdd: ", creditAdd)
		// const totalCreditAdd = wallet[0].totalCredit + credit
		const sumCreditAdd = wallet.moneyCredit + credit
		// console.log("creditAdd: ", wallet[0].credit + credit);
		// console.log("totalCreditAdd: ", wallet[0].credit + credit);
		// console.log("sumCreditAdd: ", wallet[0].credit + credit);
		const updatedRecord = await Wallet.findByIdAndUpdate(
			{ _id: wallet._id },
			{
				credit: creditAdd,
				moneyCredit: sumCreditAdd,
				// sumCredit: sumCreditAdd,
				updatedBy: userData.id,
				updatedByFullName: userData.fullName,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		).exec();

		return updatedRecord;
	} catch (error) {
		console.error("Error in updateWalletByIDService:", error);
		throw error;
	}
};

// updateWalletPointCreditByUserID
export const updateWalletPointCreditByUserID = async (
	credit: number,
	userData: any,
) => {
	try {
		console.log("userData==-=-=-=-=-=-=-=-=-=-", userData)
		const wallet = await Wallet.findOne({ user: userData.id }).exec();
		if (!wallet) {
			throw {
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message
			}
		}
		const pointCreditAdd = wallet.pointCredit + credit
		// const totalCreditAdd = wallet.totalCredit + credit
		const sumCreditAdd = wallet.credit + credit
		console.log("Wallet: ", wallet.credit + credit);
		if (!wallet) {
			throw new Error("Wallet not found");
		}
		const updatedRecord = await Wallet.findByIdAndUpdate(
			{ _id: wallet._id },
			{
				pointCredit: pointCreditAdd,
				credit: sumCreditAdd,
				updatedBy: userData.id,
				updatedByFullName: userData.fullName,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		).exec();

		return updatedRecord;
	} catch (error) {
		console.error("Error in updateWalletByIDService:", error);
		throw error;
	}
};

// find user by id
export const findUserDataByIdService = async (id: string) => {
	try {
		const user = await userModel.findById(id).select("-pin -__v").exec();

		if (!user) {
			return null;
		}
		return user;
	} catch (error) {
		console.error("Error in findUserByIdService:", error);
		throw new Error("Failed to retrieve user data");
	}
};

export const updateUserPointService = async (
	userId: string,
	topUpPoint: number,
	userPoint: number,
) => {
	try {
		const finalPoint = userPoint + topUpPoint
		const user = await userModel
			.findByIdAndUpdate(
				userId,
				{ point: finalPoint },
				{ new: true, select: '-__v -pin' }
			)
			.exec();

		if (!user) {
			throw new Error("User not found");
		}

		return;
	} catch (error) {
		console.log("Error find user: ", error);
		throw error;
	}
};