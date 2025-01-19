import type { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
	createdTaxInvoiceService,
	findTaxInvoiceByIDService,
	findTaxInvoicesByUserService,
	findAllTaxInvoicesService,
	findAllTaxInvoicesServiceCount,
	fetchTaxInvoicesWithPagination,
	updateTaxInvoiceByIDService,
	deleteTaxInvoiceByIDService,
} from "../../services/taxInvoice";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";
import { findUserByIDService } from "../../services/user";
import {
	updatePaymentHistoryInvoiceByIDService,
} from "../../services/paymentHistory";
import { filterTaxInvoiceFields } from "./helper";

export const createTaxInvoice = async (req: Request, res: Response) => {
	try {
		const userToken = (req as RequestWithUser).user;
		const userData: any = await findUserByIDService(req, userToken.id);
		if (!userData?.taxInfo) {
			res.status(404).json({
				code: messages.TAX_INFO_NOT_FOUND.code,
				message: messages.TAX_INFO_NOT_FOUND.message,
				detail: "User tax info not found",
			});
			return;
		}
		const { paymentId } = req.body;
		const record: any = await createdTaxInvoiceService(
			paymentId,
			userData.taxInfo,
			userToken,
		);

		//update taxInvoice id into payment hostory
		const paymentHistory = await updatePaymentHistoryInvoiceByIDService(record.paymentId, record._id);
		if (!paymentHistory) {
			res.status(500).json({
				code: messages.INTERNAL_SERVER_ERROR.code,
				message: messages.INTERNAL_SERVER_ERROR.message,
				detail: "Failed to update payment history with tax invoice ID",
			});
			return;
		}

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: messages.CREATE_SUCCESSFUL.message,
			record,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getTaxInvoiceByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const record = await findTaxInvoiceByIDService(id);

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

export const getTaxInvoices = async (req: Request, res: Response) => {
	try {
		const { skip = "0", limit = "10", ...query } = req.query;
		const parsedSkip = parseInt(skip as string, 10);
		const parsedLimit = parseInt(limit as string, 10);

		// Generate filter object
		const filter = filterTaxInvoiceFields(query);
		// console.log("filter: ", filter);
		// Fetch topups and count using the reusable function
		const { taxInvoices, totalCount } = await fetchTaxInvoicesWithPagination(filter, parsedSkip, parsedLimit);
		// Return results
		if (!taxInvoices || taxInvoices.length === 0) {
			res.status(200).json({
				code: messages.SUCCESSFULLY.code,
				message: messages.SUCCESSFULLY.message,
				total: totalCount,
				taxInvoices,
			});
			return;
		}

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: messages.SUCCESSFULLY.message,
			total: totalCount,
			taxInvoices,
		});
		return;
	} catch (error) {
		console.error("Error fetching topups:", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateTaxInvoiceByID = async (req: Request, res: Response) => {
	try {
		const { status, rejectionReason } = req.body; // Extract update data from request body

		const id = req.params.id;
		const userToken = (req as RequestWithUser).user;

		// Update the Record via the service function
		const updatedRecord = await updateTaxInvoiceByIDService(
			id,
			{ status, rejectionReason },
			userToken,
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

export const deleteTaxInvoiceByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		// Delete the Record via the service function
		const deletedRecord = await deleteTaxInvoiceByIDService(id);

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
