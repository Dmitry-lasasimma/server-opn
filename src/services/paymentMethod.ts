import dotenv from "dotenv";
import { type IPaymentMethod, PaymentMethod } from "../models/paymentMethod";
import { ObjectId } from "mongodb";
import type { TokenData } from "../middlewares";

dotenv.config();

// POST
export const createPaymentMethodService = async (
    name: string,
    status: boolean,
    userData: TokenData,
): Promise<IPaymentMethod | null> => {
    try {
        // Check if the user already exists
        const existingName = await PaymentMethod.findOne({ name });
        if (existingName) {
            throw new Error(`A name ${name} already exists.`);
        }

        const newRecord = new PaymentMethod({
            name,
            status,
            createdBy: userData.id,
            createdByFullName: userData.fullName,
        });

        // Save the user to the database
        const savedRecord = await newRecord.save();

        return savedRecord;
    } catch (error) {
        console.log("Error creating Record: ", error);

        throw error;
    }
};
// GET
export const findPaymentMethodByIDService = async (
    id: string,
): Promise<IPaymentMethod | null> => {
    try {
        const record = await PaymentMethod.findOne({ _id: new ObjectId(id) }).exec();

        if (!record) {
            return null;
        }
        return record;
    } catch (error) {
        console.error("Error in findPaymentMethodByIDService:", error);
        throw error;
    }
};
export const fetchPaymentMethodsWithPagination = async (
    filter: object,
    skip: number,
    limit: number
): Promise<{ paymentMethods: any[]; totalCount: number }> => {
    try {
        const paymentMethods = await PaymentMethod.find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();

        const totalCount = await PaymentMethod.countDocuments(filter).exec();

        return { paymentMethods, totalCount };
    } catch (error) {
        console.error("Error in fetchPaymentMethodsWithPagination:", error);
        throw error;
    }
};

//PUT

export const updatePaymentMethodByIDService = async (
    id: string,
    updateData: {
        name: string;
        status: boolean;
    },
    userData: TokenData,
) => {
    try {
        const updatedRecord = await PaymentMethod.findByIdAndUpdate(
            { _id: new ObjectId(id) },
            {
                ...updateData,
                updatedBy: userData.id,
                updatedByFullName: userData.fullName,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }, // Return the updated document and run validation on updates
        ).exec();

        return updatedRecord;
    } catch (error) {
        console.error("Error in updatePaymentMethodByIDService:", error);
        throw error;
    }
};

// DELETE
export const deletePaymentMethodByIDService = async (id: string) => {
    try {
        const deletedRecord = await PaymentMethod.findByIdAndDelete({
            _id: new ObjectId(id),
        }).exec();
        return deletedRecord;
    } catch (error) {
        console.error("Error in deletePaymentMethodByIDService:", error);
        throw error;
    }
};

// DELETE MANY
export const deleteManyPaymentMethodsService = async (ids: string[]) => {
    try {
        const deletedRecords = await PaymentMethod.deleteMany({
            _id: { $in: ids.map((id) => new ObjectId(id)) },
        }).exec();
        return deletedRecords;
    } catch (error) {
        console.error("Error in deleteManyPaymentMethodsService:", error);
        throw error;
    }
};

// UPDATE MANY
export const updatePaymentMethodsService = async (
    updateData: {
        status: boolean;
    },
    userData: TokenData,
) => {
    try {
        let filter = {};
        let updateResult;

        // Determine if this is a single or bulk update
        // if (id) {
        //     filter = { _id: new ObjectId(id) }; // Update a single record by ID
        // }

        // Perform the update
        updateResult = await PaymentMethod.updateMany(
            filter,
            {
                $set: {
                    ...updateData,
                    updatedBy: userData.id,
                    updatedByFullName: userData.fullName,
                    updatedAt: new Date(),
                },
            },
            { new: true, runValidators: true } // Ensure validation and updated document return
        ).exec();

        return updateResult;
    } catch (error) {
        console.error("Error in updatePaymentMethodsService:", error);
        throw error;
    }
};
