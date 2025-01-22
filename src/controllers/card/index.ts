import type { Request, Response } from "express";
import Stripe from "stripe";

import { messages } from "../../config";
import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import {
	findUserByIDService,
	updateUserByIDService,
	findUserDataByIdService,
	updateUserService
} from "../../services/user";
import omise from 'omise';
import qs from 'qs';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Custom request type to include user

// Function to create a card

//========================================================================

const clientOmise = omise({
	secretKey: process.env.OMISE_SECRET_KEY,  // Your secret key from the environment
});

// Define an interface for the response (optional but recommended)
interface TokenResponse {
	id: string;
	object: string;
	livemode: boolean;
	used: boolean;
	// Add other fields as per Omise's API response
}
export const createCard = async (req: Request, res: Response): Promise<void> => {
	try {
		const { cardName, cardCity, cardPostalCode, cardNumber, cardSecurityCode, cardExpirationMonth, cardExpirationYear }: { cardName: string, cardCity: string, cardPostalCode: string, cardNumber: string, cardSecurityCode: string, cardExpirationMonth: string, cardExpirationYear: string } = req.body;

		const url = process.env.OMISE_TOKEN_URL as string;
		const publicKey = process.env.OMISE_PUBLIC_KEY;

		if (!publicKey) {
			throw new Error('OMISE_PUBLIC_KEY is not defined in environment variables.');
		}

		const cardData = {
			'card[name]': cardName,
			'card[city]': cardCity,
			'card[postal_code]': cardPostalCode,
			'card[number]': cardNumber,
			'card[security_code]': cardSecurityCode,
			'card[expiration_month]': cardExpirationMonth,
			'card[expiration_year]': cardExpirationYear
		};

		let cardToken = "";

		try {
			const response: AxiosResponse = await axios.post(url, qs.stringify(cardData), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				auth: {
					username: publicKey,
					password: ''
				}
			});

			console.log('Token Created Successfully:', response.data);
			cardToken = response.data.id;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorData = error.response?.data;

				if (error.response) {
					console.error('Axios Error:', error.response.status, errorData);

					const detailedError = errorData?.message || 'Unknown error occurred.';

					// Handle specific Omise error cases
					switch (errorData?.code) {
						case 'invalid_card':
							res.status(400).json({
								// code: 'INVALID_CARD',
								code: messages.INVALID_CARD.code,
								message: messages.INVALID_CARD.message,
								// message: `Card validation failed: ${detailedError}`,
							});
							console.log("Card validation failed: ", detailedError)
							return;
						case 'not_found':
							res.status(404).json({
								code: messages.TOKEN_NOT_FOUND.code,
								message: messages.TOKEN_NOT_FOUND.message,
								// message: `Token not found: ${detailedError}`,
							});
							console.log("Token not found: ", detailedError)
							return;
						default:
							res.status(400).json({
								code: messages.OMISE_ERROR.code,
								message: messages.OMISE_ERROR.message,
								// message: `Omise API error: ${detailedError}`,
							});
							console.log("Omise API error: ", detailedError)
							return;
					}
				}
			}
			console.error('Unexpected Error:', error);
			res.status(500).json({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'An unexpected error occurred while creating the card token.',
			});
			return;
		}

		const user = (req as any).user;
		console.log("==============================user: ", user);
		let opnCustomerID: string = "";
		const userId: string = user.id;

		const customerMove: any = await findUserDataByIdService(userId);

		if (customerMove && customerMove.userOpnID) {
			opnCustomerID = customerMove.userOpnID;
		} else {
			const customerData = {
				email: customerMove.email,
				description: 'Customer for ' + customerMove.email,
				card: cardToken,
			};

			try {
				const card = await clientOmise.customers.create(customerData);

				await updateUserService(user.id, { userOpnID: card.id, defaultCard: card.default_card }, user);
				// await axios.put(
				// 	`${process.env.USER_SERVICE_URL}/v1/api/users/${user.id}`,
				// 	{ userOpnID: card.id, defaultCard: card.default_card },
				// 	{
				// 		headers: {
				// 			Authorization: `${req.headers["authorization"]}`,
				// 		},
				// 	}
				// );

				res.status(201).json({
					code: 'CREATE_SUCCESSFUL',
					message: 'Card created successfully',
					card: card,
				});
				return;
			} catch (error) {
				console.error('Error creating customer:', error);
				res.status(500).json({
					code: 'CUSTOMER_CREATION_FAILED',
					message: 'Failed to create customer in Omise.',
				});
				return;
			}
		}

		try {
			const card = await clientOmise.customers.update(opnCustomerID, {
				card: cardToken,
			});

			console.log('Omise Customer Updated:', card);

			res.status(201).json({
				code: 'CREATE_SUCCESSFUL',
				message: 'Card created successfully',
				card: card,
			});
			return;
		} catch (error) {
			console.error('Error updating customer:', error);
			res.status(500).json({
				code: 'CUSTOMER_UPDATE_FAILED',
				message: 'Failed to update customer in Omise.',
			});
			return;
		}
	} catch (error) {
		console.error('Unexpected Error:', error);
		res.status(500).json({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'An unexpected error occurred.',
			detail: (error as Error).message,
		});
		return;
	}
};
export const createCardv2 = async (req: Request, res: Response): Promise<void> => {
	try {

		const { cardName, cardCity, cardPostalCode, cardNumber, cardSecurityCode, cardExpirationMonth, cardExpirationYear }: { cardName: string, cardCity: string, cardPostalCode: string, cardNumber: string, cardSecurityCode: string, cardExpirationMonth: string, cardExpirationYear: string } = req.body;

		// const url = 'https://vault.omise.co/tokens';
		const url = (process.env.OMISE_TOKEN_URL as string);

		// Retrieve the public key from environment variables
		const publicKey = process.env.OMISE_PUBLIC_KEY;
		let cardToken = "";
		if (!publicKey) {
			throw new Error('OMNISE_PUBLIC_KEY is not defined in environment variables.');
		}
		// Card details (ideally, these should be collected securely from user input)
		const cardData = {
			'card[name]': cardName,
			'card[city]': cardCity,
			'card[postal_code]': cardPostalCode,
			'card[number]': cardNumber,
			'card[security_code]': cardSecurityCode,
			'card[expiration_month]': cardExpirationMonth,
			'card[expiration_year]': cardExpirationYear
		};
		try {
			const response: AxiosResponse<TokenResponse> = await axios.post(url, qs.stringify(cardData), {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				auth: {
					username: publicKey,
					password: '' // Password is empty as per the curl command
				}
			});

			console.log('Token Created Successfully:', response.data);
			cardToken = response.data.id;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Handle Axios-specific errors
				console.error('Axios Error:', error.response?.status, error.response?.data);
			} else {
				// Handle generic errors
				console.error('Unexpected Error:', error);
			}
		}


		//=========================================================

		const user = (req as any).user;  // Assuming user is populated in the request
		// const { cardToken }: { cardToken: string } = req.body;
		let opnCustomerID: string = "";
		const userId: string = user.id;

		// Fetch customer details from external API (if any)
		const customerMove = await findUserByIDService(req, userId);

		// console.log("customerMove: ", customerMove);

		if (customerMove && customerMove.userOpnID) {
			opnCustomerID = customerMove.userOpnID;
		} else {
			//===========================================================
			// Step 1: Create a new customer in Omise (Opn Payments)
			const customerData = {
				email: customerMove.email,
				description: 'Customer for ' + customerMove.email,
				card: cardToken,
			};
			//===========================================================
			// Step 2: Attach the card to the customer using the received token
			// Pass the cardToken directly (as a string) to the `createCard` method
			const card = await clientOmise.customers.create(customerData);  // Use cardToken as string
			//===========================================================
			// console.log("default_card: ", card.default_card);// Create a new Stripe customer if not existing
			await axios.put(
				`${process.env.USER_SERVICE_URL}/v1/api/users/${user.id}`,
				{ userOpnID: card.id, defaultCard: card.default_card },
				{
					headers: {
						Authorization: `${req.headers["authorization"]}`,
					},
				},
			);
			//TODO: set default card to user
			// await updateUserByIDService(req, userId, card.default_card);
			res.status(201).json({
				code: messages.CREATE_SUCCESSFUL.code,
				message: "Card created successfully",
				card: card,
			});
			return;
		}
		console.log("opnCustomerID: ", opnCustomerID);


		// Step 2: Attach the card to the existing customer using the received card token
		const card = await clientOmise.customers.update(opnCustomerID, {
			card: cardToken,  // Pass the card token directly (as a string)
		});

		console.log("Omise Customer Created: ", card);
		//===========================================================
		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: "Card created successfully",
			card: card,
		});
		return;
	} catch (error) {
		console.log("Error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
	}
};
export const getCardByID = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;  // Assuming user is populated in the request
		const cardToken = req.params.id;

		console.log("======cardToken: ", cardToken);

		// Fetch customer details from external API (if any)
		const userData: any = await findUserDataByIdService(user.id);

		const cardDetail = await clientOmise.customers.retrieveCard(userData.userOpnID, cardToken);

		const card = {
			cardId: cardDetail.id,
			cardLastDigit: cardDetail.last_digits,
			brand: cardDetail.brand,
			cardName: cardDetail.name,
			expireMonth: cardDetail.expiration_month,
			expireYear: cardDetail.expiration_year,
		};

		res.status(200).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: "Get card Successful",
			card,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getCards = async (req: Request, res: Response) => {
	try {
		const user: any = (req as any).user;
		const userId: string = user.id;

		// Fetch customer details from external API
		const userData: any = await findUserDataByIdService(userId);

		if (!userData.userOpnID) {
			res.status(200).json({ code: messages.SUCCESSFULLY.code, message: messages.SUCCESSFULLY.message, total: 0, data: [] });
			return;
		}

		const cardDetail = await clientOmise.customers.retrieve(userData.userOpnID);

		/**
		 * If no cards, return
		 */
		if (!cardDetail) {
			res.status(200).json({ code: messages.SUCCESSFULLY.code, message: messages.SUCCESSFULLY.message, total: 0, data: [] });
			return;
		}

		const cards = cardDetail.cards.data;
		const allCard = cardDetail.cards.total;
		const newCardFormat: any = [];

		//   TODO: change card format
		cards.map((card: any, index) => {
			// Check if the card.id matches the default_card field, and set the defaultCard flag
			const isDefaultCard = card.id === cardDetail.default_card ? true : false;

			newCardFormat[index] = {
				id: card.id,
				cardName: card.name,
				cardLastDigit: card.last_digits,
				brand: card.brand,
				expireMonth: card.expiration_month,
				expireYear: card.expiration_year,
				defaultCard: isDefaultCard,  // Set defaultCard based on the comparison
			};

			return newCardFormat[index];
		});

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Get cards Sucessful",
			total: allCard,
			data: newCardFormat,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const deleteCardByID = async (req: Request, res: Response) => {
	try {
		const cardToken = req.params.id;
		const user: any = (req as any).user;
		const userData: any = await findUserDataByIdService(user.id);
		const cardDetail = await clientOmise.customers.retrieve(userData.userOpnID);

		if (cardDetail.cards.total <= 1) {
			// await updateUserByIDService(req, user.id, "");
			await updateUserService(user.id, { defaultCard: "" }, user);
		} else {
			if (cardToken === userData.defaultCard) {
				if (cardToken !== cardDetail.cards.data[0]["id"]) {
					// await updateUserByIDService(
					// 	req,
					// 	user.id,
					// 	cardDetail.cards.data[0]["id"],
					// );
					await updateUserService(user.id, { defaultCard: cardDetail.cards.data[0]["id"] }, user);
				} else {
					// await updateUserByIDService(
					// 	req,
					// 	user.id,
					// 	cardDetail.cards.data[1]["id"],
					// );
					await updateUserService(user.id, { defaultCard: cardDetail.cards.data[1]["id"] }, user);
				}
			}
		}

		await clientOmise.customers.destroyCard(userData.userOpnID, cardToken);

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: "Delete card successful",
			card: {
				id: cardToken,
			},
		});
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateDefaultCard = async (req: Request, res: Response) => {
	try {
		const cardToken = req.params.id;
		const user: any = (req as any).user;
		const userData: any = await findUserDataByIdService(user.id); // The customer ID (e.g., 'cust_test_620z7a2tipi1rf81gqv')

		// Step 2: Fetch the customer data from your service (if required)
		// Example: Get customer data based on the userId (not shown in this function)
		// const userData = await getUserData(userId); 
		const cardDetail = await clientOmise.customers.retrieveCard(userData.userOpnID, cardToken);

		console.log(cardDetail)
		// Prepare the data to update the customer
		const customerData: any = {
			email: userData.email,
			description: "Update default card",
			default_card: cardToken,
		};

		// Remove any undefined fields (optional, to avoid sending unnecessary data)
		Object.keys(customerData).forEach(key => {
			if (customerData[key] === undefined) {
				delete customerData[key];
			}
		});
		// Step 3: Send a PATCH request to Omise to update the default card
		const updatedCard = await clientOmise.customers.update(userData.userOpnID, customerData);

		console.log("Omise Card Updated: ", updatedCard);

		// Step 4: Respond with the updated customer data
		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Update default card successful",
			customer: updatedCard,  // Return the updated customer object
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

//========================================================================
export const createCardv1 = async (req: Request, res: Response) => {
	try {
		const user = (req as any).user;
		const { paymentMethodId, cardName, email } = req.body;

		let stripeCustomerID: string = "";
		const userId: string = user.id;

		// Fetch customer details from external API
		const customer = await findUserByIDService(req, userId);

		if (customer && customer.userStripeID) {
			stripeCustomerID = customer.userStripeID;
		} else {
			// Create a new Stripe customer if not existing
			stripeCustomerID = await createStripeCustomer({ cardName, email });
			await axios.put(
				`${process.env.USER_SERVICE_URL}/v1/api/users/${user.id}`,
				{ userStripeID: stripeCustomerID },
				{
					headers: {
						Authorization: `${
							// biome-ignore lint/complexity/useLiteralKeys: <explanation>
							req.headers["authorization"]
							}`,
					},
				},
			);
		}
		console.log("stripeCustomerID: ", stripeCustomerID);

		// Attach PaymentMethod to customer
		await stripe.paymentMethods.attach(paymentMethodId, {
			customer: stripeCustomerID,
		});

		// Retrieve Payment method details
		const paymentMethodDetail =
			await stripe.paymentMethods.retrieve(paymentMethodId);

		const card = {
			id: paymentMethodDetail.id,
			cardId: paymentMethodDetail.card?.last4,
			brand: paymentMethodDetail.card?.brand,
			cardName: paymentMethodDetail.billing_details?.name,
			expireMonth: paymentMethodDetail.card?.exp_month,
			expireYear: paymentMethodDetail.card?.exp_year,
		};

		//TODO: set default card to user
		if (!customer.defaultCard) {
			await updateUserByIDService(req, userId, paymentMethodDetail.id);
		}

		res.status(201).json({
			code: messages.CREATE_SUCCESSFUL.code,
			message: "Create card Successful",
			card,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getCardByIDv1 = async (req: Request, res: Response) => {
	try {
		const paymentMethodId = req.params.id;

		const paymentMethodDetail =
			await stripe.paymentMethods.retrieve(paymentMethodId);

		const card = {
			id: paymentMethodDetail.id,
			cardId: paymentMethodDetail.card?.last4,
			brand: paymentMethodDetail.card?.brand,
			cardName: paymentMethodDetail.billing_details?.name,
			expireMonth: paymentMethodDetail.card?.exp_month,
			expireYear: paymentMethodDetail.card?.exp_year,
		};

		res.status(200).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: "Get card Successful",
			card,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const getCardsv1 = async (req: Request, res: Response) => {
	try {
		const user: any = (req as any).user;
		const userId: string = user.id;

		// Fetch customer details from external API
		const userData: any = await findUserByIDService(req, userId);

		const paymentMethods = await stripe.customers.listPaymentMethods(
			userData.userStripeID,
			{ type: "card" },
		);

		/**
		 * If no cards, return
		 */
		if (!paymentMethods) {
			res.status(200).json({ code: messages.SUCCESSFULLY.code, message: messages.SUCCESSFULLY.message, total: 0, data: [] });
			return;
		}

		const cards = paymentMethods.data;
		const allCard = cards.length;
		const newCardFormat: any = [];

		//   TODO: change card format
		cards.map((card: any, index) => {
			newCardFormat[index] = {
				id: card.id,
				cardName: card.billing_details.name,
				cardId: card.card.last4,
				brand: card.card.brand,
				expireMonth: card.card.exp_month,
				expireYear: card.card.exp_year,
			};
			return newCardFormat[index];
		});

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Get cards Sucessful",
			total: allCard,
			data: newCardFormat,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};
export const deleteCardByIDv1 = async (req: Request, res: Response) => {
	try {
		const paymentMethodId = req.params.id;
		const user: any = (req as any).user;

		const userData: any = await findUserByIDService(req, user.id);

		const paymentMethods = await stripe.customers.listPaymentMethods(
			userData.userStripeID,
			{ type: "card" },
		);

		if (paymentMethods.data.length <= 1) {
			await updateUserByIDService(req, user.id, "");
		} else {
			if (paymentMethodId === userData.defaultCard) {
				if (paymentMethodId !== paymentMethods.data[0]["id"]) {
					await updateUserByIDService(
						req,
						user.id,
						paymentMethods.data[0]["id"],
					);
				} else {
					await updateUserByIDService(
						req,
						user.id,
						paymentMethods.data[1]["id"],
					);
				}
			}
		}

		await stripe.paymentMethods.detach(paymentMethodId);

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			messages: "Delete card successful",
			card: {
				id: paymentMethodId,
			},
		});
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

export const updateDefaultCardv1 = async (req: Request, res: Response) => {
	try {
		const userId = req.params.id;
		const paymentMethodId = req.body.paymentMethodId;

		const userData = await updateUserByIDService(req, userId, paymentMethodId);

		res.status(200).json({
			code: messages.SUCCESSFULLY.code,
			message: "Update default card successful",
			user: userData,
		});
		return;
	} catch (error) {
		console.log("error: ", error);
		res.status(500).json({
			code: messages.INTERNAL_SERVER_ERROR.code,
			message: messages.INTERNAL_SERVER_ERROR.message,
			detail: (error as Error).message,
		});
		return;
	}
};

const createStripeCustomer = async ({ cardName, email }: { cardName: string; email: string; }) => {
	try {
		const customer = await stripe.customers.create({
			name: cardName,
			email: email,
			tax_exempt: "exempt",
		});
		console.log("Customer created successfully:", customer);
		return customer.id;
	} catch (error) {
		console.error("Error creating customer:", error);
		throw error;
	}
};
// update error case
