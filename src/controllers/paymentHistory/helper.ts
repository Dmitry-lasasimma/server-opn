import axios from "axios";
import { messages } from "../../config";
import { create } from "domain";
import { TaxInvoiceStatusEnum } from "../../models/taxInvoice";
import { PaymentStatusEnum, PaymentTypeEnum } from "../../models/paymentHistory";
export const stripeDescription = (description: string) => {
	const newDescription = `Move-${description}`;
	const stDescription = newDescription.substring(0, 22);
	return stDescription;
};

export const createTransactionID = () => {
	let result = "";
	const length = 5; // Reduced length to accommodate datetime
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	const datetime = new Date().toISOString().replace(/[-:.TZ]/g, "");
	return `${result}${datetime}`;
};

export const stripPriceCalculate = (price: number) => {
	// ຍ້ອນວ່າ stripe ຖື 00 ທັງທ້າຍເປັນ .00
	const total = price * 100;
	return Number.parseInt(total.toFixed());
};

export const createOmiseCharge = async (
	customerId: string,
	amount: number,
	currency: string,
	description: string,
	returnUri: string
) => {
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

		const response = await axios.post("https://api.omise.co/charges", params.toString(), {
			auth: {
				username: process.env.OMISE_SECRET_KEY || "YOUR_OMISE_SECRET_KEY",
				password: ""
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});

		return response.data;
	} catch (error: any) {
		console.error("Error creating Omise charge: ", error.response ? error.response.data : error.message);
		throw new Error("Omise charge creation failed");
	}
};

const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY || "your_secret_key";

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
		expires_at: new Date(Date.now() + 10 * 60000).toISOString(), // Expiry date of the charge + 10 minutes
	};

	try {
		const response = await axios.post(url, data, {
			auth: {
				username: OMISE_SECRET_KEY,
				password: "", // Password is empty
			},
		});
		console.log("PromptPay charge created:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error creating PromptPay charge:", error);
		throw error;
	}
};
interface PaymentFilter {
	packageName?: string | RegExp;
	user?: string;
	transactionID?: string;
	isAvailable?: boolean;
	price?: { $gte?: number; $lte?: number };
	credit?: { $gte?: number; $lte?: number };
	createdAt?: { $gte?: Date; $lte?: Date };
	taxInvoiceStatus?: TaxInvoiceStatusEnum;
	status?: PaymentStatusEnum;
	taxinvoiceId?: { $ne: null } | null;
	paymentType?: PaymentTypeEnum;
}
export const filterPaymentFields = (query: any): PaymentFilter => {
	let filter: PaymentFilter = {};

	// Filter by packageName
	if (query.packageName) {
		filter = {
			...filter,
			packageName: new RegExp(query.packageName, "i"), // Case-insensitive search
		};
	}

	// Filter by user id
	if (query.user) {
		filter = {
			...filter,
			user: query.user,
		};
	}

	// Filter by transactionID id
	if (query.transactionID) {
		filter = {
			...filter,
			transactionID: query.transactionID,
		};
	}

	// Filter by price range
	if (query.minPrice || query.maxPrice) {
		filter = {
			...filter,
			price: {
				...(query.minPrice && { $gte: Number(query.minPrice) }),
				...(query.maxPrice && { $lte: Number(query.maxPrice) }),
			},
		};
	}

	// Filter by credit range
	if (query.minCredit || query.maxCredit) {
		filter = {
			...filter,
			credit: {
				...(query.minCredit && { $gte: Number(query.minCredit) }),
				...(query.maxCredit && { $lte: Number(query.maxCredit) }),
			},
		};
	}

	// Filter by createdAt range
	if (query.startDate || query.endDate) {
		filter = {
			...filter,
			createdAt: {
				...(query.startDate && { $gte: new Date(query.startDate) }),
				...(query.endDate && { $lte: new Date(query.endDate) }),
			},
		};
	}

	if (query.isAvailable) {
		filter = {
			...filter,
			isAvailable: query.isAvailable,
		};
	}

	if (query.taxInvoiceStatus) {
		filter = {
			...filter,
			taxinvoiceId: { $ne: null },
		};
	}

	if (query.taxInvoiceStatus === "NULL") {
		filter = {
			...filter,
			taxinvoiceId: null,
		};
	}

	if (query.paymentType) {
		filter = {
			...filter,
			paymentType: query.paymentType,
		};
	}

	if (query.status) {
		filter = {
			...filter,
			status: query.status,
		};
	}

	return filter;
};

export const validatePermisionRole = async (res: any, userToken: any, queryUser: any) => {
	if (userToken.role === "CUSTOMER" && queryUser && userToken.id !== queryUser) {
		res.status(401).json({
			code: messages.UNAUTHORIZED.code,
			message: messages.UNAUTHORIZED.message,
			detail: "The user is Unauthorized",
		});
	}
}

async function sendPaymentRequest() {
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
		const response = await axios.post(url, payload);
		console.log('Response:', response.data);
	} catch (error) {
		console.error('Error sending request:', error);
	}
}