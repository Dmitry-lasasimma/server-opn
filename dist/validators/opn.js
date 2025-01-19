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
exports.createPromptPayCharge = exports.verifyOmiseSignature = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
// import { Request, Response } from "express";
const verifyOmiseSignature = (payload, signature) => {
    const secret = process.env.OMISE_SECRET_KEY || "your_secret_key";
    const hmac = crypto_1.default.createHmac("sha256", secret).update(payload).digest("hex");
    return hmac === signature;
};
exports.verifyOmiseSignature = verifyOmiseSignature;
const createPromptPayCharge = (amount, currency, description, returnUri) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.post(url, data, {
            auth: {
                username: process.env.OMISE_SECRET_KEY || "YOUR_OMISE_SECRET_KEY",
                password: "", // Password is empty
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating PromptPay charge:", error);
        throw error;
    }
});
exports.createPromptPayCharge = createPromptPayCharge;
