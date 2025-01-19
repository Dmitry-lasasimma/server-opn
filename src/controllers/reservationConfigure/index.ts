import type { Request, Response } from "express";

import {
	createdReservationConfigureService,
	findReservationConfigureByIDService,
	updateReservationConfigureByIDService,
} from "../../services/reservationConfigure";
import { messages } from "../../config";
import type { RequestWithUser } from "../../middlewares";

export const createReservationConfigure = async (
	req: Request,
	res: Response,
) => {
	try {
		const { credit } = req.body;
		const userToken = (req as RequestWithUser).user;
		const record = await createdReservationConfigureService(credit, userToken);

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

export const getReservationConfigureByID = async (
	req: Request,
	res: Response,
) => {
	try {
		const id = req.params.id;
		const record = await findReservationConfigureByIDService(id);

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

export const updateReservationConfigureByID = async (
	req: Request,
	res: Response,
) => {
	try {
		const { credit } = req.body; // Extract update data from request body
		const id = req.params.id;
		const userToken = (req as RequestWithUser).user;

		// Update the Record via the service function
		const updatedRecord = await updateReservationConfigureByIDService(
			id,
			{
				credit,
			},
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
