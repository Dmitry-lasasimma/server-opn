import type { Request, Response } from "express";
// import { validationResult } from "express-validator";

import {
	createdCouponService,
	findCouponByIDService,
	fetchCouponsWithPagination,
	updateCouponByIDService,
	deleteCouponByIDService,
	generatedCouponService,
	checkCouponService,
	deleteManyCouponsService,
} from "../../services/coupon";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";
import { filterCouponFields, updateCouponStatus } from "./helper";

export const createCoupon = async (req: Request, res: Response) => {
	try {
		const user = (req as RequestWithUser).user;
		const { name, amount, point, startDate, endDate, couponCodes, status } =
			req.body;

		console.log("couponCodes", couponCodes);
		const record = await createdCouponService(
			name,
			amount,
			point,
			startDate,
			endDate,
			couponCodes,
			status,
			user,
		);

		res.status(200).json({
			message: "Create record Successful",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getCouponByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const record = await findCouponByIDService(id);

		if (!record) {
			res.status(404).json({
				message: messages.NOT_FOUND,
				detail: "record not found with this id",
			});
			return;
		}

		res.status(200).json({
			message: "Get data successfully",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getCoupons = async (req: Request, res: Response) => {
	try {
		const { skip = "0", limit = "10", ...query } = req.query;
		const parsedSkip = parseInt(skip as string, 10);
		const parsedLimit = parseInt(limit as string, 10);

		// Generate filter object
		const filter = filterCouponFields(query);

		// Fetch topups and count using the reusable function
		const { coupons, totalCount } = await fetchCouponsWithPagination(filter, parsedSkip, parsedLimit);

		const couponsUpdated = await updateCouponStatus(coupons);

		// Return results
		if (!coupons || coupons.length === 0) {
			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				message: messages.NOT_FOUND.message,
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			total: totalCount,
			coupons: couponsUpdated,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateCouponByID = async (req: Request, res: Response) => {
	try {
		const { name, amount, point, startDate, endDate, status } = req.body; // Extract update data from request body

		const id = req.params.id;
		const user = (req as RequestWithUser).user;

		// Update the Record via the service function
		const updatedRecord = await updateCouponByIDService(
			id,
			{ name, amount, point, startDate, endDate, status },
			user,
		);

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
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

export const deleteCouponByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		// Delete the Record via the service function
		const deletedRecord = await deleteCouponByIDService(id);

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
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};

// generate coupon
export const generateCoupon = async (req: Request, res: Response) => {
	try {
		const { amount } = req.body;

		const record = await generatedCouponService(amount);

		res.status(200).json({
			message: "Create record Successful",
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

// check coupon
export const redeemCoupon = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;
		const { code } = req.body;
		const point = await checkCouponService(req, code, user);


		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: messages.SUCCESSFULLY.message,
			respone: point,
		});
		return;
	} catch (error) {
		console.log("error: ", (error as Error).message);
		if ((error as Error).message === "COUPON_NOT_FOUND") {
			res.status(404).json({
				code: messages.COUPON_NOT_FOUND.code,
				message: messages.COUPON_NOT_FOUND.message,
				detail: messages.COUPON_NOT_FOUND.detail,
			});
			return;
		}
		if ((error as Error).message === "COUPON_ALREADY_EXPIRED") {
			res.status(404).json({
				code: messages.COUPON_ALREADY_EXPIRED.code,
				message: messages.COUPON_ALREADY_EXPIRED.message,
				detail: messages.COUPON_ALREADY_EXPIRED.detail,
			});
			return;
		}
		if ((error as Error).message === "COUPON_ALREADY_USED") {
			res.status(404).json({
				code: messages.COUPON_ALREADY_USED.code,
				message: messages.COUPON_ALREADY_USED.message,
				detail: messages.COUPON_ALREADY_USED.detail
			});
			return;
		}
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

// delete many coupons
export const deleteManyCoupons = async (req: Request, res: Response) => {
	try {
		const { arrayIds } = req.body;
		// Ensure arrayIds is valid and is an array
		if (!Array.isArray(arrayIds) || arrayIds.length === 0) {
			res.status(400).json({
				code: messages.BAD_REQUEST.code,
				message: "Invalid or empty array of IDs",
			});
			return;
		}

		// Delete the Records via the service function
		const deletedRecord = await deleteManyCouponsService(arrayIds);

		// If no records were deleted, return a 404 response
		if (deletedRecord.deletedCount === 0) {
			res.status(404).json({
				code: messages.NOT_FOUND.code,
				message: "No records found with the provided IDs",
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Records deleted successfully",
			deletedCount: deletedRecord.deletedCount,
		});
	} catch (error) {
		console.error("Error in deleteManyTopups:", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

// for cron job
export const cronJobGetCoupons = async (req: Request, res: Response) => {
	try {
		console.log("Cron job running");
		const { skip = "0", limit = "50", ...query } = req.query;
		const parsedSkip = parseInt(skip as string, 10);
		const parsedLimit = parseInt(limit as string, 10);

		// Generate filter object
		const filter = filterCouponFields(query);

		// Fetch topups and count using the reusable function
		const { coupons, totalCount } = await fetchCouponsWithPagination(filter, parsedSkip, parsedLimit);

		await updateCouponStatus(coupons);

		// Return results
		if (!coupons || coupons.length === 0) {
			res.status(200).json({
				code: messages.NOT_FOUND.code,
				message: messages.NOT_FOUND.message,
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			total: totalCount,
			coupons: {},
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			message: "Internal Server Error",
			detail: (error as Error).message,
		});
		return;
	}
};