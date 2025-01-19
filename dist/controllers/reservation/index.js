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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservationByID = exports.updateReservationByID = exports.getReservations = exports.getReservationByID = exports.createReservation = void 0;
const reservation_1 = require("../../services/reservation");
const config_1 = require("../../config");
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, chargingStation, chargerMachine, startTime, endTime, credit, status, } = req.body;
        const userToken = req.user;
        const record = yield (0, reservation_1.createdReservationService)(user, chargingStation, chargerMachine, startTime, endTime, credit, status, userToken);
        res.status(200).json({
            message: "Create record Successful",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.createReservation = createReservation;
// export const createReservation = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const {
// 			user,
// 			chargingStation,
// 			chargerMachine,
// 			startTime,
// 			endTime,
// 			credit,
// 			status,
// 		} = req.body;
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({
// 				message: messages.BAD_REQUEST,
// 				details: errors.array().map((err) => ({
// 					detail: err.msg,
// 				})),
// 			});
// 		}
// 		const userToken = req.user; // Safely access 'user'
// 		if (!userToken) {
// 			return res.status(403).json({
// 				message: "User not found or unauthorized",
// 			});
// 		}
// 		const record = await createdReservationService(
// 			user,
// 			chargingStation,
// 			chargerMachine,
// 			startTime,
// 			endTime,
// 			credit,
// 			status,
// 			userToken,
// 		);
// 		return res.status(200).json({
// 			message: "Create record Successful",
// 			record,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		res.status(500).json({
// 			message: messages.INTERNAL_SERVER_ERROR,
// 			detail: (error as Error).message,
// 		});
// 	}
// };
const getReservationByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield (0, reservation_1.findReservationByIDService)(id);
        if (!record) {
            res.status(404).json({
                message: config_1.messages.NOT_FOUND,
                detail: "record not found with this id",
            });
            return;
        }
        res.status(200).json({
            message: "Get data successfully",
            record,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: config_1.messages.INTERNAL_SERVER_ERROR,
            detail: error.message,
        });
        return;
    }
});
exports.getReservationByID = getReservationByID;
// export const getReservationByID = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const { id } = req.query; // Extract the 'id' from the query string
// 		if (!id || typeof id !== "string") {
// 			return res.status(400).json({
// 				message: "Invalid or missing ID in query parameters",
// 				detail: "Please provide a valid ID in the query string.",
// 			});
// 		}
// 		const record = await findReservationByIDService(id);
// 		if (!record) {
// 			return res.status(404).json({
// 				message: messages.NOT_FOUND,
// 				detail: "record not found with this id",
// 			});
// 		}
// 		return res.status(200).json({
// 			message: "Get data successfully",
// 			record,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: messages.INTERNAL_SERVER_ERROR,
// 			detail: (error as Error).message,
// 		});
// 	}
// };
const getReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, skip, limit } = req.query;
        // Ensure skip and limit are valid numbers
        const parsedSkip = Number.parseInt(skip, 10) || 0;
        const parsedLimit = Number.parseInt(limit, 10) || 10;
        // If a question is provided, search by question; otherwise, get all FAQs
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let Data;
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let RecordsCount;
        if (user && typeof user === "string") {
            Data = yield (0, reservation_1.findReservationsByUserService)(user, parsedSkip, parsedLimit);
            RecordsCount = yield (0, reservation_1.findAllReservationsServiceCount)();
        }
        else {
            Data = yield (0, reservation_1.findAllReservationsService)(parsedSkip, parsedLimit);
            RecordsCount = yield (0, reservation_1.findAllReservationsServiceCount)();
        }
        if (!Data || Data.length === 0) {
            res.status(404).json({
                message: "No Record found",
                detail: "No Records match the provided criteria",
            });
            return;
        }
        res.status(200).json({
            total: RecordsCount,
            message: "Get Records successfully",
            Data,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.getReservations = getReservations;
// export const getReservations = async (req: RequestWithUser, res: Response) => {
// 	try {
// 		const { user, skip, limit } = req.query;
// 		// Ensure skip and limit are valid numbers
// 		const parsedSkip = Number.parseInt(skip as string, 10) || 0;
// 		const parsedLimit = Number.parseInt(limit as string, 10) || 10;
// 		// If a question is provided, search by question; otherwise, get all FAQs
// 		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
// 		let Data;
// 		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
// 		let RecordsCount;
// 		if (user && typeof user === "string") {
// 			Data = await findReservationsByUserService(user, parsedSkip, parsedLimit);
// 			RecordsCount = await findAllReservationsServiceCount();
// 		} else {
// 			Data = await findAllReservationsService(parsedSkip, parsedLimit);
// 			RecordsCount = await findAllReservationsServiceCount();
// 		}
// 		if (!Data || Data.length === 0) {
// 			return res.status(404).json({
// 				message: "No Record found",
// 				detail: "No Records match the provided criteria",
// 			});
// 		}
// 		return res.status(200).json({
// 			total: RecordsCount,
// 			message: "Get Records successfully",
// 			Data,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 	}
// };
const updateReservationByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, chargingStation, chargerMachine, startTime, endTime, credit, status, } = req.body; // Extract update data from request body
        const id = req.params.id;
        const userToken = req.user;
        // Update the Record via the service function
        const updatedRecord = yield (0, reservation_1.updateReservationByIDService)(id, {
            user,
            chargingStation,
            chargerMachine,
            startTime,
            endTime,
            credit,
            status,
        }, userToken);
        if (!updatedRecord) {
            res.status(404).json({
                message: "Record not found",
                detail: `No Record found with the ID ${id}`,
            });
            return;
        }
        res.status(200).json({
            message: "Record updated successfully",
            updatedRecord,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.updateReservationByID = updateReservationByID;
// export const updateReservationByID = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const {
// 			user,
// 			chargingStation,
// 			chargerMachine,
// 			startTime,
// 			endTime,
// 			credit,
// 			status,
// 		} = req.body; // Extract update data from request body
// 		const { id } = req.query; // Extracting the 'id' from the query string
// 		if (!id || typeof id !== "string") {
// 			return res.status(400).json({
// 				message: "Invalid or missing ID in query parameters",
// 				detail: "Please provide a valid FAQ ID in the query string.",
// 			});
// 		}
// 		const userToken = req.user; // Safely access 'user'
// 		// check user
// 		if (!userToken) {
// 			return res.status(403).json({
// 				message: "User not found or unauthorized",
// 			});
// 		}
// 		// Update the Record via the service function
// 		const updatedRecord = await updateReservationByIDService(
// 			id,
// 			{
// 				user,
// 				chargingStation,
// 				chargerMachine,
// 				startTime,
// 				endTime,
// 				credit,
// 				status,
// 			},
// 			userToken,
// 		);
// 		if (!updatedRecord) {
// 			return res.status(404).json({
// 				message: "Record not found",
// 				detail: `No Record found with the ID ${id}`,
// 			});
// 		}
// 		return res.status(200).json({
// 			message: "Record updated successfully",
// 			updatedRecord,
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 	}
// };
const deleteReservationByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Delete the Record via the service function
        const deletedRecord = yield (0, reservation_1.deleteReservationByIDService)(id);
        if (!deletedRecord) {
            res.status(404).json({
                message: "record not found",
                detail: `No record found with the ID ${id}`,
            });
            return;
        }
        res.status(200).json({
            message: "record deleted successfully",
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            detail: error.message,
        });
        return;
    }
});
exports.deleteReservationByID = deleteReservationByID;
// export const deleteReservationByID = async (
// 	req: RequestWithUser,
// 	res: Response,
// ) => {
// 	try {
// 		const { id } = req.query; // Extracting the 'id' from the query string
// 		if (!id || typeof id !== "string") {
// 			return res.status(400).json({
// 				message: "Invalid or missing ID in query parameters",
// 				detail: "Please provide a valid FAQ ID in the query string.",
// 			});
// 		}
// 		const user = req.user; // Safely access 'user'
// 		// Verify Token
// 		if (!user) {
// 			return res.status(403).json({
// 				message: "User not found or unauthorized",
// 			});
// 		}
// 		// Delete the Record via the service function
// 		const deletedRecord = await deleteReservationByIDService(id);
// 		if (!deletedRecord) {
// 			return res.status(404).json({
// 				message: "record not found",
// 				detail: `No record found with the ID ${id}`,
// 			});
// 		}
// 		return res.status(200).json({
// 			message: "record deleted successfully",
// 		});
// 	} catch (error) {
// 		console.log("error: ", error);
// 		return res.status(500).json({
// 			message: "Internal Server Error",
// 			detail: (error as Error).message,
// 		});
// 	}
// };
