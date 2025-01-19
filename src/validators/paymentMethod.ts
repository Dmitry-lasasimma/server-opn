import type { Request, Response, NextFunction } from "express";

export const validateCreatePaymentMethod = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const { name } = req.body;
    const errors: string[] = [];

    // Validate name
    if (typeof name !== "string" || name.trim().length === 0) {
        errors.push("name is required and must be a non-empty string.");
    }

    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }

    next();
};
export const validateParamID = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const errors: string[] = [];
    const id = req.params.id;
    if (!id || typeof id !== "string") {
        errors.push("Please provide a valid ID in the query.");
    }
    if (errors.length > 0) {
        res.status(400).json({
            message: "Validation failed",
            errors,
        });
        return;
    }

    next();
};
