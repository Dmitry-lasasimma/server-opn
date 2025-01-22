import dotenv from 'dotenv';

import { staffModel } from "../models/staff";
import { IStaff } from "../models/staff";
import { messages } from '../config';

dotenv.config();

interface Filter {
    firstName?: string | RegExp;
    lastName?: string | RegExp;
    fullName?: string | RegExp;
    email?: string;
    phone?: string;
    role?: string;
    status?: string;
    userName?: string | RegExp;
}

// GET
export const findStaffByUserNameService = async (userName: string) => {
    try {
        const staff = await staffModel.findOne({
            userName,
            status: { $ne: 'BLOCKED' },
            role: { $ne: 'CUSTOMER' }
        })
            .select("-__v")
            .exec();

        if (!staff) {
            return null;
        }
        return staff;
    } catch (error) {
        console.error('Error in findStaffByEmailService:', error);
        throw new Error('Failed to retrieve staff data');
    }
};

export const findStaffByIdService = async (id: string) => {
    try {
        console.log("id: ", id)
        const staff = await staffModel.findById(id)
            .populate({
                path: "createdBy",
                select: "fullName userName",
            })
            .exec();
        return staff;
    } catch (error) {
        console.log("findAllStaffsService: ", error);
        throw new Error("Error in findAllStaffsService");
    }
}

export const findAllStaffsService = async (limit: number, skip: number, filter: Filter) => {
    try {
        const staffs = await staffModel.find(filter)
            .select('-__v -password')
            .populate({
                path: "createdBy",
                select: "fullName userName",
            })
            .limit(limit || 50)
            .skip(skip || 0)
            .sort({ createdAt: -1 })
            .exec();

        return staffs;
    } catch (error) {
        console.log("findAllStaffsService: ", error);
        throw new Error("Error in findAllStaffsService");
    }
};

export const countStaffService = async (filter: Filter) => {
    try {
        const totals = await staffModel.countDocuments(filter);
        return totals;
    } catch (error) {
        console.log("countStaffService: ", error)
        throw new Error("Error in countStaffService");
    }
}

// CREATE, UPDATE, DELETE
export const createdStaffService = async (
    userID: string,
    firstName: string,
    lastName: string,
    fullName: string,
    phone: string,
    email: string,
    password: string,
    profileImage: string,
    role: string,
    userName: string,
    createdBy: string
): Promise<IStaff | null> => {
    // Check if the user already exists
    const existingStaff = await staffModel.findOne({ userName });
    if (existingStaff) {
        throw {
            code: messages.USER_ALREADY_EXISTS.code,
            message: messages.USER_ALREADY_EXISTS.message
        };
    }

    // Create new staff
    const newStaff = new staffModel({
        userID,
        firstName,
        lastName,
        fullName,
        phone,
        email,
        password,
        profileImage,
        role,
        userName,
        createdBy
    });

    // Save the user to the database
    const savedStaff = await newStaff.save();

    // Return the created user without sensitive fields (e.g., pin)
    return savedStaff.toObject({ versionKey: false, transform: (_, ret) => { delete ret.password; return ret; } });
};

export const updateStaffService = async (id: string, updates: Partial<IStaff>) => {
    const staff = await staffModel.findByIdAndUpdate(id, updates, { new: true }).select('-__v -password').exec();
    if (!staff) {
        throw {
            code: messages.NOT_FOUND.code,
            message: "Staff not found"
        }
    }
    return staff;
}


export const deleteStaffService = async (id: string) => {
    const staff = await staffModel.findByIdAndDelete(id)
        .select('-__v -password')
        .exec();
    if (!staff) {
        throw new Error('Staff not found');
    }
    return staff;
}
