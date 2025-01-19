import type { Request, Response } from "express";

import {
    createPaymentMethodService,
    findPaymentMethodByIDService,
    fetchPaymentMethodsWithPagination,
    updatePaymentMethodByIDService,
    deleteManyPaymentMethodsService,
    updatePaymentMethodsService
} from "../../services/paymentMethod";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";
import { filterPayementMethodFields, checkPaymentMethodsStatus } from "./helper";

export const createPaymentMethod = async (req: Request, res: Response) => {
    try {
        const user = (req as RequestWithUser).user;
        const { name, status } = req.body;

        //Create user with Create User Service
        const record = await createPaymentMethodService(
            name,
            status,
            user,
        );

        res.status(201).json({
            code: messages.CREATE_SUCCESSFUL.code,
            message: "Create record Successful",
            record,
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

export const getPaymentMethodByID = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const record = await findPaymentMethodByIDService(id);

        if (!record) {
            res.status(404).json({
                code: messages.NOT_FOUND.code,
                message: messages.NOT_FOUND.message,
                detail: "record not found with this id",
            });
            return;
        }

        res.status(200).json({
            code: messages.SUCCESSFULLY.code,
            message: "Get data successfully",
            record,
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

export const getPaymentMethods = async (req: Request, res: Response) => {
    try {
        const { skip = "0", limit = "10", ...query } = req.query;
        const parsedSkip = parseInt(skip as string, 10);
        const parsedLimit = parseInt(limit as string, 10);

        // Generate filter object
        const filter = filterPayementMethodFields(query);

        // Fetch topups and count using the reusable function
        const { paymentMethods, totalCount } = await fetchPaymentMethodsWithPagination(filter, parsedSkip, parsedLimit);

        // Return results
        if (!paymentMethods || paymentMethods.length === 0) {
            res.status(200).json({
                code: messages.NOT_FOUND.code,
                message: "No Topup found",
            });
            return;
        }

        const result = checkPaymentMethodsStatus({ paymentMethods });

        res.status(200).json({
            code: messages.SUCCESSFULLY.code,
            messages: messages.SUCCESSFULLY.message,
            total: totalCount,
            status: result,
            paymentMethods,
        });
        return;
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        res.status(500).json({
            code: messages.INTERNAL_SERVER_ERROR.code,
            message: messages.INTERNAL_SERVER_ERROR.message,
            detail: (error as Error).message,
        });
        return;
    }
};

export const updatePaymentMethodByID = async (req: Request, res: Response) => {
    try {
        const { name, status } = req.body; // Extract update data from request body
        const id = req.params.id;
        const user = (req as RequestWithUser).user;
        // Update the Record via the service function
        const updatedRecord = await updatePaymentMethodByIDService(
            id,
            { name, status },
            user,
        );

        if (!updatedRecord) {
            res.status(200).json({
                code: messages.NOT_FOUND.code,
                message: "Record not found",
                detail: `No Record found with the ID ${id}`,
            });
            return;
        }

        res.status(200).json({
            code: messages.SUCCESSFULLY.code,
            message: "Record updated successfully",
            updatedRecord,
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

export const deleteManyPaymentMethods = async (req: Request, res: Response) => {
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
        const deletedRecord = await deleteManyPaymentMethodsService(arrayIds);

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

export const updatePaymentMethodsStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body; // Extract the status from the request body
        const user = (req as RequestWithUser).user;

        // Validate input
        if (typeof status !== "boolean") {
            res.status(400).json({
                code: messages.BAD_REQUEST.code,
                message: "Invalid input: 'status' should be true or false",
            });
            return;
        }

        // Update all records with the provided status
        const updatedResult = await updatePaymentMethodsService({ status }, user);

        if (!updatedResult || updatedResult.modifiedCount === 0) {
            res.status(404).json({
                code: messages.NOT_FOUND.code,
                message: "No records found to update",
            });
            return;
        }

        res.status(200).json({
            code: messages.SUCCESSFULLY.code,
            message: "All records updated successfully",
            updatedCount: updatedResult.modifiedCount,
        });
    } catch (error) {
        console.error("Error in updatePaymentMethodsStatus:", error);
        res.status(500).json({
            code: messages.INTERNAL_SERVER_ERROR.code,
            message: messages.INTERNAL_SERVER_ERROR.message,
            detail: (error as Error).message,
        });
    }
};


