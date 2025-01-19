import crypto from "crypto";
import axios from "axios";
// import { Request, Response } from "express";

export const verifyOmiseSignature = (payload: string, signature: string): boolean => {
    const secret = process.env.OMISE_SECRET_KEY || "your_secret_key";
    const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return hmac === signature;
};

export const createPromptPayCharge = async (
    amount: number,
    currency: string,
    description: string,
    returnUri: string
): Promise<any> => {
    const url = "https://api.omise.co/charges";

    const data = {
        amount, // Amount in the smallest currency unit
        currency, // Currency (e.g., "THB")
        description, // Description of the transaction
        source: {
            type: "promptpay", // Specify PromptPay as the payment method
        },
        return_uri: returnUri, // Redirect URI after payment
    };

    try {
        const response = await axios.post(url, data, {
            auth: {
                username: process.env.OMISE_SECRET_KEY || "YOUR_OMISE_SECRET_KEY",
                password: "", // Password is empty
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating PromptPay charge:", error);
        throw error;
    }
};