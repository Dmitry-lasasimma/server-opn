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


// ================================================================================


interface Address {
	village: string;
	district: string;
	province: string;
}

interface Filter {
	firstName?: string | RegExp;
	lastName?: string | RegExp;
	fullName?: string | RegExp;
	email?: string;
	phone?: string;
	role?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	status?: any;
	userID?: string;
}

// GET
export const findUserByEmailService = async (email: string) => {
	try {
		// cannot -pin because we need it to compared in login route
		const user = await userModel
			.findOne({ email, status: { $ne: "BLOCKED" } })
			.select("-__v")
			.exec();

		if (!user) {
			return null;
		}
		return user;
	} catch (error) {
		console.error("Error in findUserByEmailService:", error);
		throw "Failed to retrieve user data";
	}
};
export const findUserByPhoneService = async (countryCode: string, phone: string) => {
	try {
		// cannot -pin because we need it to compared in login route
		const user = await userModel
			.findOne({ countryCode, phone, status: { $ne: "BLOCKED" } })
			.select("-__v")
			.exec();

		if (!user) {
			return null;
		}
		return user;
	} catch (error) {
		console.error("Error in findUserByPhoneService:", error);
		throw "Failed to retrieve user data";
	}
};

export const findUserByIdService = async (id: string) => {
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

// export const findAllUsersService = async (
// 	limit: number,
// 	skip: number,
// 	filter: Filter,
// ) => {
// 	try {
// 		const users = await userModel
// 			.find(filter)
// 			.select("-__v -pin")
// 			.limit(limit || 50)
// 			.sort({ createdAt: -1 })
// 			.skip(skip || 0)
// 			.exec();

// 		return users;
// 	} catch (error) {
// 		console.log("findAllUsersService: ", error);
// 		throw new Error("Error in findAllUsersService");
// 	}
// };

export const findAllUsersService = async (
	limit: number,
	skip: number,
	filter: Filter,
) => {
	try {
		const users = await userModel.aggregate([
			// Step 1: Match users based on the provided filter
			{
				$match: filter
			},
			// Step 2: Lookup wallets data by matching _id with user in wallets
			{
				$lookup: {
					from: "wallets", // The name of the collection to join (make sure it's lowercase)
					localField: "_id", // Field from users collection
					foreignField: "user", // Field from wallets collection
					as: "wallet" // Alias for the resulting array
				}
			},
			// Step 3: Optionally unwind the wallet array if each user should have a single wallet entry
			{
				$unwind: {
					path: "$wallet",
					preserveNullAndEmptyArrays: true // Optional: Preserve users with no wallet data
				}
			},
			// Step 4: Select the fields you need and exclude any unnecessary fields
			{
				$project: {
					__v: 0, // Exclude the __v field
					pin: 0, // Exclude the pin field
					"wallet.__v": 0, // Optionally exclude fields from the wallet object
				}
			},
			// Step 5: Pagination and sorting
			{
				$sort: { createdAt: -1 }
			},
			{
				$skip: skip || 0
			},
			{
				$limit: limit || 50
			},
		]);

		return users;
	} catch (error) {
		console.log("findAllUsersService: ", error);
		throw new Error("Error in findAllUsersService");
	}
};

export const countUserService = async (filter: Filter) => {
	try {
		const totals = await userModel.countDocuments(filter);
		return totals;
	} catch (error) {
		console.log("countUserService: ", error);
		throw new Error("Error in countUserService");
	}
};

// CREATE, UPDATE, DELETE
export const createdUserService = async (
	firstName: string,
	lastName: string,
	fullName: string,
	phone: string,
	email: string,
	pin: string,
	profileImage: string,
	countryCode: string,
	addresses: Address[],
	userID: string,
	staffData: TokenData,
): Promise<IUser | null> => {
	try {
		// Check if the user already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			console.log("come here der");
			throw "404";
		}

		// Create new user
		const newUser = new userModel({
			firstName,
			lastName,
			fullName,
			phone,
			email,
			pin, // Pin will be hashed by pre-save hook in the schema
			profileImage,
			countryCode,
			userID, // Set the generated userID
			addresses, // Add the addresses array here
			createdBy: staffData.id,
			createdByFullName: staffData.fullName,
		});

		// Save the user to the database
		const savedUser = await newUser.save();

		// Return the created user without sensitive fields (e.g., pin)
		return savedUser.toObject({
			versionKey: false,
			transform: (_, ret) => {
				// biome-ignore lint/performance/noDelete: <explanation>
				delete ret.pin;
				return ret;
			},
		});
	} catch (error) {
		console.log("Error creating user: ", error);

		throw new Error("Error creating user");
	}
};

export const updateUserService = async (
	id: string,
	updates: Partial<IUser>,
	staffData: TokenData,
) => {
	const user = await userModel
		.findByIdAndUpdate(
			{ _id: new ObjectId(id) },
			{
				...updates,
				updatedBy: staffData.id,
				updatedByFullName: staffData.fullName,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		)
		.exec();

	if (!user) {
		throw {
			code: messages.NOT_FOUND.code,
			message: "User not found",
		};
	}
	return user;
};
export const updateUserServiceLogin = async (
	id: string,
	updates: Partial<IUser>,
) => {
	const user = await userModel
		.findByIdAndUpdate(
			{ _id: new ObjectId(id) },
			{
				...updates,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		)
		.exec();

	if (!user) {
		throw {
			code: messages.NOT_FOUND.code,
			message: "User not found",
		};
	}
	return user;
};
// export const updateUserService = async (
// 	id: string,
// 	updates: Partial<IUser>,
// ) => {
// 	const user = await userModel
// 		.findByIdAndUpdate(id, updates, { new: true })
// 		.select("-__v -pin")
// 		.exec();

// 	if (!user) {
// 		throw {
// 			code: messages.NOT_FOUND.code,
// 			message: "User not found",
// 		};
// 	}
// 	return user;
// };

export const deleteUserService = async (id: string) => {
	const user = await userModel.findByIdAndDelete(id).select("-__v -pin").exec();
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

// GET PIN
export const findUserPinByIdService = async (id: string) => {
	try {
		const user = await userModel.findById(id).select("-__v").exec();

		if (!user) {
			return null;
		}
		return user;
	} catch (error) {
		console.error("Error in findUserByIdService:", error);
		throw new Error("Failed to retrieve user data");
	}
};

//for dashboard
export const DashboardUsersService = async (
	pipelineMongo: any
) => {
	try {
		const users = await userModel
			.aggregate(pipelineMongo)

		return users;
	} catch (error) {
		console.log("findAllUsersService: ", error);
		throw new Error("Error in findAllUsersService");
	}
};

//get all users device token 
export const getUsersWithDeviceToken = async () => {

	try {
		const pipeline = [
			{
				$match: {
					role: "CUSTOMER",
					status: { $ne: "BLOCKED" },
					deviceToken: { $nin: [null, "null"] },
				},
			},
			{
				$project: {
					deviceToken: 1,
					_id: 1,
				},
			},
		];

		const users = await userModel.aggregate(pipeline);
		return users;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
}; 