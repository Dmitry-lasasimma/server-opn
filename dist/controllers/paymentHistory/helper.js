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
exports.validatePermisionRole = exports.filterPaymentFields = exports.createPromptPayCharge = exports.createOmiseCharge = exports.stripPriceCalculate = exports.createTransactionID = exports.stripeDescription = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const stripeDescription = (description) => {
    const newDescription = `Move-${description}`;
    const stDescription = newDescription.substring(0, 22);
    return stDescription;
};
exports.stripeDescription = stripeDescription;
const createTransactionID = () => {
    let result = "";
    const length = 5; // Reduced length to accommodate datetime
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const datetime = new Date().toISOString().replace(/[-:.TZ]/g, "");
    return `${result}${datetime}`;
};
exports.createTransactionID = createTransactionID;
const stripPriceCalculate = (price) => {
    // ຍ້ອນວ່າ stripe ຖື 00 ທັງທ້າຍເປັນ .00
    const total = price * 100;
    return Number.parseInt(total.toFixed());
};
exports.stripPriceCalculate = stripPriceCalculate;
const createOmiseCharge = (customerId, amount, currency, description, returnUri) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert amount to the smallest unit if needed. Omise expects amount in the smallest unit.
        // For THB, 100000 means 1,000.00 THB (since Omise uses 2 decimal places).
        // If data.price is already in the smallest unit, no conversion needed.
        // Just ensure `amount` aligns with how you represented `data.price`.
        const params = new URLSearchParams();
        params.append("description", description);
        params.append("amount", amount.toString());
        params.append("currency", currency);
        params.append("return_uri", returnUri);
        params.append("customer", customerId);
        const response = yield axios_1.default.post("https://api.omise.co/charges", params.toString(), {
            auth: {
                username: process.env.OMISE_SECRET_KEY || "YOUR_OMISE_SECRET_KEY",
                password: ""
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating Omise charge: ", error.response ? error.response.data : error.message);
        throw new Error("Omise charge creation failed");
    }
});
exports.createOmiseCharge = createOmiseCharge;
const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY || "your_secret_key";
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
        expires_at: new Date(Date.now() + 10 * 60000).toISOString(), // Expiry date of the charge + 10 minutes
    };
    try {
        const response = yield axios_1.default.post(url, data, {
            auth: {
                username: OMISE_SECRET_KEY,
                password: "", // Password is empty
            },
        });
        console.log("PromptPay charge created:", response.data);
        return response.data;
    }
    catch (error) {
        console.error("Error creating PromptPay charge:", error);
        throw error;
    }
});
exports.createPromptPayCharge = createPromptPayCharge;
const filterPaymentFields = (query) => {
    let filter = {};
    // Filter by packageName
    if (query.packageName) {
        filter = Object.assign(Object.assign({}, filter), { packageName: new RegExp(query.packageName, "i") });
    }
    // Filter by user id
    if (query.user) {
        filter = Object.assign(Object.assign({}, filter), { user: query.user });
    }
    // Filter by transactionID id
    if (query.transactionID) {
        filter = Object.assign(Object.assign({}, filter), { transactionID: query.transactionID });
    }
    // Filter by price range
    if (query.minPrice || query.maxPrice) {
        filter = Object.assign(Object.assign({}, filter), { price: Object.assign(Object.assign({}, (query.minPrice && { $gte: Number(query.minPrice) })), (query.maxPrice && { $lte: Number(query.maxPrice) })) });
    }
    // Filter by credit range
    if (query.minCredit || query.maxCredit) {
        filter = Object.assign(Object.assign({}, filter), { credit: Object.assign(Object.assign({}, (query.minCredit && { $gte: Number(query.minCredit) })), (query.maxCredit && { $lte: Number(query.maxCredit) })) });
    }
    // Filter by createdAt range
    if (query.startDate || query.endDate) {
        filter = Object.assign(Object.assign({}, filter), { createdAt: Object.assign(Object.assign({}, (query.startDate && { $gte: new Date(query.startDate) })), (query.endDate && { $lte: new Date(query.endDate) })) });
    }
    if (query.isAvailable) {
        filter = Object.assign(Object.assign({}, filter), { isAvailable: query.isAvailable });
    }
    if (query.taxInvoiceStatus) {
        filter = Object.assign(Object.assign({}, filter), { taxinvoiceId: { $ne: null } });
    }
    if (query.taxInvoiceStatus === "NULL") {
        filter = Object.assign(Object.assign({}, filter), { taxinvoiceId: null });
    }
    if (query.paymentType) {
        filter = Object.assign(Object.assign({}, filter), { paymentType: query.paymentType });
    }
    if (query.status) {
        filter = Object.assign(Object.assign({}, filter), { status: query.status });
    }
    return filter;
};
exports.filterPaymentFields = filterPaymentFields;
const validatePermisionRole = (res, userToken, queryUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (userToken.role === "CUSTOMER" && queryUser && userToken.id !== queryUser) {
        res.status(401).json({
            code: config_1.messages.UNAUTHORIZED.code,
            message: config_1.messages.UNAUTHORIZED.message,
            detail: "The user is Unauthorized",
        });
    }
});
exports.validatePermisionRole = validatePermisionRole;
function sendPaymentRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'http://18.142.179.192:3000/v1/api/payment-socket';
        const payload = {
            userId: '12345',
            payload: {
                amount_credit: 100,
                bill_number: 'CP123',
                create_date: '2022-01-01',
                package_name: 'Package A',
                amoun_point: 100,
                payment_channel: 'PromptPay',
                amount_paid: 1000,
                currency: 'THB',
            }
        };
        try {
            const response = yield axios_1.default.post(url, payload);
            console.log('Response:', response.data);
        }
        catch (error) {
            console.error('Error sending request:', error);
        }
    });
}
