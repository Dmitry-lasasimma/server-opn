import dotenv from "dotenv";
import { type ICoupon, Coupon, type CouponCode } from "../models/coupon";
import type mongoose from "mongoose";
import { type Document, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";
import { couponupdateUserPoints, findUserByIDService } from "../services/user";

dotenv.config();

// POST
export const createdCouponService = async (
	name: string,
	amount: number,
	point: number,
	startDate: Date,
	endDate: Date,
	couponCodes: string[],
	status: boolean,
	userData: TokenData,
): Promise<ICoupon | null> => {
	try {
		// Check if already exists
		const existingRecord = await Coupon.findOne({ name });
		if (existingRecord) {
			throw new Error("Error existingRecord");
		}
		function generateCouponCodes(couponCodes: string[]): {
			CouponCodes: { code: string; isUsed: boolean }[];
		} {
			return {
				CouponCodes: couponCodes.map((code: string) => ({
					code: code,
					isUsed: false,
				})),
			};
		}
		const CouponCodes = generateCouponCodes(couponCodes);
		console.log("CouponCodes", CouponCodes);

		// Create new user
		const newRecord = new Coupon({
			name,
			amount,
			point,
			startDate,
			endDate,
			couponCodes: CouponCodes.CouponCodes,
			status,
			createdBy: userData.id,
			createdByFullName: userData.fullName,
		});

		// Save the user to the database
		const savedRecord = await newRecord.save();

		// Return the created user without sensitive fields (e.g., pin)
		return savedRecord.toObject({
			versionKey: false,
			transform: (_, ret) => {
				// biome-ignore lint/performance/noDelete: <explanation>
				delete ret.pin;
				return ret;
			},
		});
	} catch (error) {
		console.log("Error creating Record: ", error);

		throw new Error("Error creating Record");
	}
};
// GET
export const findCouponByIDService = async (
	id: string,
): Promise<ICoupon | null> => {
	try {
		const record = await Coupon.findOne({ _id: new ObjectId(id) }).exec();

		if (!record) {
			return null;
		}
		return record;
	} catch (error) {
		console.error("Error in findCouponByIDService:", error);
		throw new Error("Failed to retrieve data");
	}
};
// GET
export const fetchCouponsWithPagination = async (
	filter: object,
	skip: number,
	limit: number
): Promise<{ coupons: any[]; totalCount: number }> => {
	try {
		const coupons = await Coupon.find(filter)
			.skip(skip)
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();

		const totalCount = await Coupon.countDocuments(filter).exec();

		return { coupons, totalCount };
	} catch (error) {
		console.error("Error in fetchCouponsWithPagination:", error);
		throw error;
	}
};
//PUT
export const updateCouponByIDService = async (
	id: string,
	updateData: {
		name: string;
		amount: number;
		point: number;
		startDate: Date;
		endDate: Date;
		status: boolean;
	},
	userData: TokenData,
) => {
	try {
		const updatedRecord = await Coupon.findByIdAndUpdate(
			{ _id: new ObjectId(id) },
			{
				...updateData,
				updatedBy: userData.id,
				updatedByFullName: userData.fullName,
				updatedAt: new Date(),
			}, // Update fields and set updatedBy and updatedAt
			{ new: true, runValidators: true }, // Return the updated document and run validation on updates
		).exec();

		return updatedRecord;
	} catch (error) {
		console.error("Error in updateCouponByIDService:", error);
		throw new Error("Failed to update record");
	}
};
// DELETE
export const deleteCouponByIDService = async (id: string) => {
	try {
		const deletedRecord = await Coupon.findByIdAndDelete({
			_id: new ObjectId(id),
		}).exec();
		return deletedRecord;
	} catch (error) {
		console.error("Error in deleteCouponByIDService:", error);
		throw new Error("Failed to delete record");
	}
};

// GENERATE
export const generatedCouponService = async (
	amountInput: number,
): Promise<{ couponCodes: string[] } | null> => {
	try {
		const length = 9; // Specify the desired length of the coupon code
		const amount = amountInput; // Specify the number of unique coupon codes needed
		const uniqueCoupons = await generateUniqueCouponCodes(length, amount);

		console.log(`Generated Unique Coupon Codes: ${uniqueCoupons}`);

		const CouponCodes = {
			couponCodes: uniqueCoupons,
		};

		// Return the coupon codes
		return CouponCodes;
	} catch (error) {
		console.log("Error creating Record: ", error);
		throw new Error("Error creating Record");
	}
};

function generateCouponCode(length: number): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let couponCode = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		couponCode += characters[randomIndex];
	}
	return couponCode;
}

async function checkCouponExists(couponCode: string): Promise<boolean | null> {
	try {
		//   const existingCoupon = await Coupon.findOne({
		//     couponCodes: couponCode,
		//   });
		//   return existingCoupon !== null;
		const existingCoupon = await Coupon.findOne({
			"couponCodes.code": { $in: couponCode }, // Use $in to check if couponCode exists in the array
		});
		return existingCoupon !== null;
	} catch (error) {
		console.error("Error checking coupon existence:", error);
		return false;
	}
}

async function generateUniqueCouponCodes(
	length: number,
	amount: number,
): Promise<string[]> {
	const uniqueCoupons = new Set<string>();

	while (uniqueCoupons.size < amount) {
		const couponCode = generateCouponCode(length);

		// Check in memory for duplicates first
		if (uniqueCoupons.has(couponCode)) continue;

		// Then check the database
		const exists = await checkCouponExists(couponCode);
		if (!exists) {
			uniqueCoupons.add(couponCode);
		}
	}

	return Array.from(uniqueCoupons);
}
// GENERATE

// Define types for Coupon and CouponCode
// interface CouponCode {
//     code: string;
//     isUsed: boolean;
//   }

// biome-ignore lint/suspicious/noRedeclare: <explanation>
interface Coupon extends Document {
	_id: mongoose.Types.ObjectId;
	couponCodes: CouponCode[];
	status: boolean;
	endDate: Date;
	startDate: Date;
}

// CHECK COUPON
export const checkCouponService = async (
	req: any,
	code: string,
	user: TokenData,
): Promise<{ point: number } | null> => {
	try {
		const filterCoupon = { "couponCodes.code": code };
		const coupon = await Coupon.find(filterCoupon).exec(); // Use the Mongoose model here

		console.log("Coupon: ", coupon);

		if (!coupon || coupon.length === 0) throw new Error("COUPON_NOT_FOUND");

		// Convert to unknown first, then cast to Coupon to avoid type issues
		const currentCoupon = coupon[0] as unknown as Coupon;

		const currentDate = new Date();
		const endDate = new Date(currentCoupon.endDate);

		if (endDate < currentDate && currentCoupon.status === true) {
			currentCoupon.status = false;
			await Coupon.updateOne(
				{ _id: currentCoupon._id },
				{ status: false },
			).exec();
			throw new Error("COUPON_ALREADY_EXPIRED");
		}

		if (!currentCoupon.status) throw new Error("COUPON_ALREADY_EXPIRED");

		const couponCodes = currentCoupon.couponCodes;

		function checkCouponCode(
			coupons: CouponCode[],
			codeToCheck: string,
		): string | undefined {
			const coupon = coupons.find((coupon) => coupon.code === codeToCheck);
			if (coupon) {
				return coupon.isUsed ? "ALREADY_USED" : "AVAILABLE";
			}
			return undefined;
		}

		const result = checkCouponCode(couponCodes, code);
		if (result === "ALREADY_USED") throw new Error("COUPON_ALREADY_USED");

		function isCouponDateValid(
			startDateCoupon: Date,
			endDateCoupon: Date,
		): boolean {
			const currentDate = new Date();
			const startDate = new Date(startDateCoupon);
			const endDate = new Date(endDateCoupon);
			return currentDate >= startDate && currentDate <= endDate;
		}

		const isValid = isCouponDateValid(
			currentCoupon.startDate,
			currentCoupon.endDate,
		);
		if (!isValid) {
			throw new Error("COUPON_ALREADY_EXPIRED");
		} else {
			console.log("Coupon is valid", user.id);
			const userData: any = await findUserByIDService(req, user.id);
			console.log("userData point", userData.point);
			// Assuming you have a function to update user points
			await couponupdateUserPoints(req, user.id, coupon[0].point, userData.point);
			console.log(`Added ${coupon[0].point} points to user ${user.id}`);
			// Update the isUsed field for the matched coupon code
			await Coupon.updateOne(
				{ _id: currentCoupon._id, "couponCodes.code": code },
				{ $set: { "couponCodes.$.isUsed": true } }
			).exec();
			console.log(`Coupon code ${code} marked as used`);
		}


		// Return the result if everything is valid
		return { point: coupon[0].point };
	} catch (error) {
		console.log("Error creating Record: ", error);
		throw error;
	}
};

// DELETE MANY
export const deleteManyCouponsService = async (ids: string[]) => {
	try {
		const deletedRecords = await Coupon.deleteMany({
			_id: { $in: ids.map((id) => new ObjectId(id)) },
		}).exec();
		return deletedRecords;
	} catch (error) {
		console.error("Error in deleteManyCouponsService:", error);
		throw error;
	}
};