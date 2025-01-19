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
exports.deleteManyCouponsService = exports.checkCouponService = exports.generatedCouponService = exports.deleteCouponByIDService = exports.updateCouponByIDService = exports.fetchCouponsWithPagination = exports.findCouponByIDService = exports.createdCouponService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const coupon_1 = require("../models/coupon");
const mongodb_1 = require("mongodb");
const user_1 = require("../services/user");
dotenv_1.default.config();
// POST
const createdCouponService = (name, amount, point, startDate, endDate, couponCodes, status, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if already exists
        const existingRecord = yield coupon_1.Coupon.findOne({ name });
        if (existingRecord) {
            throw new Error("Error existingRecord");
        }
        function generateCouponCodes(couponCodes) {
            return {
                CouponCodes: couponCodes.map((code) => ({
                    code: code,
                    isUsed: false,
                })),
            };
        }
        const CouponCodes = generateCouponCodes(couponCodes);
        console.log("CouponCodes", CouponCodes);
        // Create new user
        const newRecord = new coupon_1.Coupon({
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
        const savedRecord = yield newRecord.save();
        // Return the created user without sensitive fields (e.g., pin)
        return savedRecord.toObject({
            versionKey: false,
            transform: (_, ret) => {
                // biome-ignore lint/performance/noDelete: <explanation>
                delete ret.pin;
                return ret;
            },
        });
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw new Error("Error creating Record");
    }
});
exports.createdCouponService = createdCouponService;
// GET
const findCouponByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield coupon_1.Coupon.findOne({ _id: new mongodb_1.ObjectId(id) }).exec();
        if (!record) {
            return null;
        }
        return record;
    }
    catch (error) {
        console.error("Error in findCouponByIDService:", error);
        throw new Error("Failed to retrieve data");
    }
});
exports.findCouponByIDService = findCouponByIDService;
// GET
const fetchCouponsWithPagination = (filter, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield coupon_1.Coupon.find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        const totalCount = yield coupon_1.Coupon.countDocuments(filter).exec();
        return { coupons, totalCount };
    }
    catch (error) {
        console.error("Error in fetchCouponsWithPagination:", error);
        throw error;
    }
});
exports.fetchCouponsWithPagination = fetchCouponsWithPagination;
//PUT
const updateCouponByIDService = (id, updateData, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecord = yield coupon_1.Coupon.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, Object.assign(Object.assign({}, updateData), { updatedBy: userData.id, updatedByFullName: userData.fullName, updatedAt: new Date() }), // Update fields and set updatedBy and updatedAt
        { new: true, runValidators: true }).exec();
        return updatedRecord;
    }
    catch (error) {
        console.error("Error in updateCouponByIDService:", error);
        throw new Error("Failed to update record");
    }
});
exports.updateCouponByIDService = updateCouponByIDService;
// DELETE
const deleteCouponByIDService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecord = yield coupon_1.Coupon.findByIdAndDelete({
            _id: new mongodb_1.ObjectId(id),
        }).exec();
        return deletedRecord;
    }
    catch (error) {
        console.error("Error in deleteCouponByIDService:", error);
        throw new Error("Failed to delete record");
    }
});
exports.deleteCouponByIDService = deleteCouponByIDService;
// GENERATE
const generatedCouponService = (amountInput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const length = 9; // Specify the desired length of the coupon code
        const amount = amountInput; // Specify the number of unique coupon codes needed
        const uniqueCoupons = yield generateUniqueCouponCodes(length, amount);
        console.log(`Generated Unique Coupon Codes: ${uniqueCoupons}`);
        const CouponCodes = {
            couponCodes: uniqueCoupons,
        };
        // Return the coupon codes
        return CouponCodes;
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw new Error("Error creating Record");
    }
});
exports.generatedCouponService = generatedCouponService;
function generateCouponCode(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let couponCode = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters[randomIndex];
    }
    return couponCode;
}
function checkCouponExists(couponCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //   const existingCoupon = await Coupon.findOne({
            //     couponCodes: couponCode,
            //   });
            //   return existingCoupon !== null;
            const existingCoupon = yield coupon_1.Coupon.findOne({
                "couponCodes.code": { $in: couponCode }, // Use $in to check if couponCode exists in the array
            });
            return existingCoupon !== null;
        }
        catch (error) {
            console.error("Error checking coupon existence:", error);
            return false;
        }
    });
}
function generateUniqueCouponCodes(length, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const uniqueCoupons = new Set();
        while (uniqueCoupons.size < amount) {
            const couponCode = generateCouponCode(length);
            // Check in memory for duplicates first
            if (uniqueCoupons.has(couponCode))
                continue;
            // Then check the database
            const exists = yield checkCouponExists(couponCode);
            if (!exists) {
                uniqueCoupons.add(couponCode);
            }
        }
        return Array.from(uniqueCoupons);
    });
}
// CHECK COUPON
const checkCouponService = (req, code, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filterCoupon = { "couponCodes.code": code };
        const coupon = yield coupon_1.Coupon.find(filterCoupon).exec(); // Use the Mongoose model here
        console.log("Coupon: ", coupon);
        if (!coupon || coupon.length === 0)
            throw new Error("COUPON_NOT_FOUND");
        // Convert to unknown first, then cast to Coupon to avoid type issues
        const currentCoupon = coupon[0];
        const currentDate = new Date();
        const endDate = new Date(currentCoupon.endDate);
        if (endDate < currentDate && currentCoupon.status === true) {
            currentCoupon.status = false;
            yield coupon_1.Coupon.updateOne({ _id: currentCoupon._id }, { status: false }).exec();
            throw new Error("COUPON_ALREADY_EXPIRED");
        }
        if (!currentCoupon.status)
            throw new Error("COUPON_ALREADY_EXPIRED");
        const couponCodes = currentCoupon.couponCodes;
        function checkCouponCode(coupons, codeToCheck) {
            const coupon = coupons.find((coupon) => coupon.code === codeToCheck);
            if (coupon) {
                return coupon.isUsed ? "ALREADY_USED" : "AVAILABLE";
            }
            return undefined;
        }
        const result = checkCouponCode(couponCodes, code);
        if (result === "ALREADY_USED")
            throw new Error("COUPON_ALREADY_USED");
        function isCouponDateValid(startDateCoupon, endDateCoupon) {
            const currentDate = new Date();
            const startDate = new Date(startDateCoupon);
            const endDate = new Date(endDateCoupon);
            return currentDate >= startDate && currentDate <= endDate;
        }
        const isValid = isCouponDateValid(currentCoupon.startDate, currentCoupon.endDate);
        if (!isValid) {
            throw new Error("COUPON_ALREADY_EXPIRED");
        }
        else {
            console.log("Coupon is valid", user.id);
            const userData = yield (0, user_1.findUserByIDService)(req, user.id);
            console.log("userData point", userData.point);
            // Assuming you have a function to update user points
            yield (0, user_1.couponupdateUserPoints)(req, user.id, coupon[0].point, userData.point);
            console.log(`Added ${coupon[0].point} points to user ${user.id}`);
            // Update the isUsed field for the matched coupon code
            yield coupon_1.Coupon.updateOne({ _id: currentCoupon._id, "couponCodes.code": code }, { $set: { "couponCodes.$.isUsed": true } }).exec();
            console.log(`Coupon code ${code} marked as used`);
        }
        // Return the result if everything is valid
        return { point: coupon[0].point };
    }
    catch (error) {
        console.log("Error creating Record: ", error);
        throw error;
    }
});
exports.checkCouponService = checkCouponService;
// DELETE MANY
const deleteManyCouponsService = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRecords = yield coupon_1.Coupon.deleteMany({
            _id: { $in: ids.map((id) => new mongodb_1.ObjectId(id)) },
        }).exec();
        return deletedRecords;
    }
    catch (error) {
        console.error("Error in deleteManyCouponsService:", error);
        throw error;
    }
});
exports.deleteManyCouponsService = deleteManyCouponsService;
