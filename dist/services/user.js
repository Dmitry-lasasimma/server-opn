"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPointService = exports.findUserDataByIdService = exports.updateWalletPointCreditByUserID = exports.updateWalletCreditByUserID = exports.couponupdateUserPoints = exports.updateUserPoints = exports.updateUserByIDService = exports.findUserByIDService = exports.updateUserByIDServicev1 = exports.findUserByIDServicev1 = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const wallet_1 = require("../models/wallet");
const user_1 = require("../models/user");
const config_1 = require("../config");
dotenv_1.default.config();
const findUserByIDServicev1 = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = userId;
        const { data: userData } = yield axios_1.default.get(`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`, {
            headers: {
                Authorization: `${
                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                req.headers["authorization"]}`,
            },
        });
        if (!userData.user.userStripeID) {
            return null;
        }
        return userData.user;
    }
    catch (error) {
        console.log("Error find user: ", error);
        throw new Error("Error find user");
    }
});
exports.findUserByIDServicev1 = findUserByIDServicev1;
const updateUserByIDServicev1 = (req, userId, paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = userId;
        const { data: userData } = yield axios_1.default.put(`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`, { defaultCard: paymentMethodId }, {
            headers: {
                Authorization: `${
                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                req.headers["authorization"]}`,
            },
        });
        console.log("userData.user: ", userData.user);
        return userData.user;
    }
    catch (error) {
        console.log("Error find user: ", error);
        throw new Error("Error find user");
    }
});
exports.updateUserByIDServicev1 = updateUserByIDServicev1;
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
const findUserByIDService = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!userId) {
            throw new Error("User ID is required.");
        }
        // const userServiceUrl = process.env.USER_SERVICE_URL_LOCAL;
        const userServiceUrl = process.env.USER_SERVICE_URL;
        // Fetch user data
        const response = yield axios_1.default.get(`${userServiceUrl}/v1/api/users/${userId}`, {
            headers: {
                Authorization: req.headers["authorization"] || "",
            },
        });
        console.log("response=========================", response);
        const userData = response.data;
        // Check if user data exists
        if (!userData || !userData.user) {
            console.error("User data not found:", userData);
            return null;
        }
        console.log("User data fetched successfully:", userData.user);
        return userData.user;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            // Axios-specific error handling
            console.error("Axios error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
                throw new Error("Permission denied. Ensure the authorization token is valid.");
            }
        }
        else {
            console.error("Unexpected error:", error.message);
        }
        throw new Error("Failed to fetch user data. Please check the service logs for more details.");
    }
});
exports.findUserByIDService = findUserByIDService;
const updateUserByIDService = (req, userId, cardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = userId;
        const { data: userData } = yield axios_1.default.put(`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`, { defaultCard: cardId }, {
            headers: {
                Authorization: `${req.headers["authorization"]}`,
            },
        });
        console.log("userData.user: ", userData.user);
        return userData.user;
    }
    catch (error) {
        console.log("Error find user: ", error);
        throw new Error("Error find user");
    }
});
exports.updateUserByIDService = updateUserByIDService;
const updateUserPoints = (req, userId, point) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-");
        console.log("point ", point);
        const finalPoint = point;
        const id = userId;
        const { data: userData } = yield axios_1.default.put(`${process.env.USER_SERVICE_URL}/v1/api/users/${id}`, 
        // `${process.env.USER_SERVICE_URL_LOCAL}/v1/api/users/${id}`,
        { point: finalPoint }, {
            headers: {
                Authorization: `${req.headers["authorization"]}`,
            },
        });
        // console.log("userData.user: ", userData.user);
        return userData.user;
    }
    catch (error) {
        console.log("Error find user: ", error);
        throw new Error("Error find user");
    }
});
exports.updateUserPoints = updateUserPoints;
const couponupdateUserPoints = (req, userId, point, userPoint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("userPoint", userPoint)
        console.log("point ", point);
        const finalPoint = userPoint + point;
        const id = userId;
        const { data: userData } = yield axios_1.default.put(`http://localhost:8000/v1/api/users/${id}`, 
        // `${process.env.USER_SERVICE_URL}/v1/api/users/${id}`,
        { point: finalPoint }, {
            headers: {
                Authorization: `${req.headers["authorization"]}`,
            },
        });
        // console.log("userData.user: ", userData.user);
        return userData.user;
    }
    catch (error) {
        console.log("Error find user: ", error);
        throw new Error("Error find user");
    }
});
exports.couponupdateUserPoints = couponupdateUserPoints;
// updateWalletCreditByUserID
const updateWalletCreditByUserID = (credit, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield wallet_1.Wallet.findOne({ user: userData.id }).exec();
        if (!wallet) {
            return {
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message
            };
        }
        console.log("credit: ", credit);
        console.log("wallet: ", wallet);
        const creditAdd = wallet.credit + credit;
        console.log("creditAdd: ", creditAdd);
        // const totalCreditAdd = wallet[0].totalCredit + credit
        const sumCreditAdd = wallet.moneyCredit + credit;
        // console.log("creditAdd: ", wallet[0].credit + credit);
        // console.log("totalCreditAdd: ", wallet[0].credit + credit);
        // console.log("sumCreditAdd: ", wallet[0].credit + credit);
        const updatedRecord = yield wallet_1.Wallet.findByIdAndUpdate({ _id: wallet._id }, {
            credit: creditAdd,
            moneyCredit: sumCreditAdd,
            // sumCredit: sumCreditAdd,
            updatedBy: userData.id,
            updatedByFullName: userData.fullName,
            updatedAt: new Date(),
        }, // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateWalletByIDService:", error);
        throw error;
    }
});
exports.updateWalletCreditByUserID = updateWalletCreditByUserID;
// updateWalletPointCreditByUserID
const updateWalletPointCreditByUserID = (credit, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("userData==-=-=-=-=-=-=-=-=-=-", userData);
        const wallet = yield wallet_1.Wallet.findOne({ user: userData.id }).exec();
        if (!wallet) {
            throw {
                code: config_1.messages.NOT_FOUND.code,
                message: config_1.messages.NOT_FOUND.message
            };
        }
        const pointCreditAdd = wallet.pointCredit + credit;
        // const totalCreditAdd = wallet.totalCredit + credit
        const sumCreditAdd = wallet.credit + credit;
        console.log("Wallet: ", wallet.credit + credit);
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        const updatedRecord = yield wallet_1.Wallet.findByIdAndUpdate({ _id: wallet._id }, {
            pointCredit: pointCreditAdd,
            credit: sumCreditAdd,
            updatedBy: userData.id,
            updatedByFullName: userData.fullName,
            updatedAt: new Date(),
        }, // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateWalletByIDService:", error);
        throw error;
    }
});
exports.updateWalletPointCreditByUserID = updateWalletPointCreditByUserID;
// find user by id
const findUserDataByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.userModel.findById(id).select("-pin -__v").exec();
        if (!user) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.error("Error in findUserByIdService:", error);
        throw new Error("Failed to retrieve user data");
    }
});
exports.findUserDataByIdService = findUserDataByIdService;
const updateUserPointService = (userId, topUpPoint, userPoint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const finalPoint = userPoint + topUpPoint;
        const user = yield user_1.userModel
            .findByIdAndUpdate(userId, { point: finalPoint }, { new: true, select: '-__v -pin' })
            .exec();
        if (!user) {
            throw new Error("User not found");
        }
        return;
    }
    catch (error) {
        console.log("Error find user: ", error);
        throw error;
    }
});
exports.updateUserPointService = updateUserPointService;
