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
exports.updateDefaultCardv1 = exports.deleteCardByIDv1 = exports.getCardsv1 = exports.getCardByIDv1 = exports.createCardv1 = exports.updateDefaultCard = exports.deleteCardByID = exports.getCards = exports.getCardByID = exports.createCardv2 = exports.createCard = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../config");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const user_1 = require("../../services/user");
const omise_1 = __importDefault(require("omise"));
const qs_1 = __importDefault(require("qs"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Custom request type to include user
// Function to create a card
//========================================================================
const clientOmise = (0, omise_1.default)({
    secretKey: process.env.OMISE_SECRET_KEY, // Your secret key from the environment
});
const createCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { cardName, cardCity, cardPostalCode, cardNumber, cardSecurityCode, cardExpirationMonth, cardExpirationYear } = req.body;
        const url = process.env.OMISE_TOKEN_URL;
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
            const response = yield axios_1.default.post(url, qs_1.default.stringify(cardData), {
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
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const errorData = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
                if (error.response) {
                    console.error('Axios Error:', error.response.status, errorData);
                    const detailedError = (errorData === null || errorData === void 0 ? void 0 : errorData.message) || 'Unknown error occurred.';
                    // Handle specific Omise error cases
                    switch (errorData === null || errorData === void 0 ? void 0 : errorData.code) {
                        case 'invalid_card':
                            res.status(400).json({
                                // code: 'INVALID_CARD',
                                code: config_1.messages.INVALID_CARD.code,
                                message: config_1.messages.INVALID_CARD.message,
                                // message: `Card validation failed: ${detailedError}`,
                            });
                            console.log("Card validation failed: ", detailedError);
                            return;
                        case 'not_found':
                            res.status(404).json({
                                code: config_1.messages.TOKEN_NOT_FOUND.code,
                                message: config_1.messages.TOKEN_NOT_FOUND.message,
                                // message: `Token not found: ${detailedError}`,
                            });
                            console.log("Token not found: ", detailedError);
                            return;
                        default:
                            res.status(400).json({
                                code: config_1.messages.OMISE_ERROR.code,
                                message: config_1.messages.OMISE_ERROR.message,
                                // message: `Omise API error: ${detailedError}`,
                            });
                            console.log("Omise API error: ", detailedError);
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
        const user = req.user;
        let opnCustomerID = "";
        const userId = user.id;
        const customerMove = yield (0, user_1.findUserByIDService)(req, userId);
        if (customerMove && customerMove.userOpnID) {
            opnCustomerID = customerMove.userOpnID;
        }
        else {
            const customerData = {
                email: customerMove.email,
                description: 'Customer for ' + customerMove.email,
                card: cardToken,
            };
            try {
                const card = yield clientOmise.customers.create(customerData);
                yield axios_1.default.put(`${process.env.USER_SERVICE_URL}/v1/api/users/${user.id}`, { userOpnID: card.id, defaultCard: card.default_card }, {
                    headers: {
                        Authorization: `${req.headers["authorization"]}`,
                    },
                });
                res.status(201).json({
                    code: 'CREATE_SUCCESSFUL',
                    message: 'Card created successfully',
                    card: card,
                });
                return;
            }
            catch (error) {
                console.error('Error creating customer:', error);
                res.status(500).json({
                    code: 'CUSTOMER_CREATION_FAILED',
                    message: 'Failed to create customer in Omise.',
                });
                return;
            }
        }
        try {
            const card = yield clientOmise.customers.update(opnCustomerID, {
                card: cardToken,
            });
            console.log('Omise Customer Updated:', card);
            res.status(201).json({
                code: 'CREATE_SUCCESSFUL',
                message: 'Card created successfully',
                card: card,
            });
            return;
        }
        catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).json({
                code: 'CUSTOMER_UPDATE_FAILED',
                message: 'Failed to update customer in Omise.',
            });
            return;
        }
    }
    catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
            detail: error.message,
        });
        return;
    }
});
exports.createCard = createCard;
const createCardv2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { cardName, cardCity, cardPostalCode, cardNumber, cardSecurityCode, cardExpirationMonth, cardExpirationYear } = req.body;
        // const url = 'https://vault.omise.co/tokens';
        const url = process.env.OMISE_TOKEN_URL;
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
            const response = yield axios_1.default.post(url, qs_1.default.stringify(cardData), {
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
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                // Handle Axios-specific errors
                console.error('Axios Error:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.status, (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
            }
            else {
                // Handle generic errors
                console.error('Unexpected Error:', error);
            }
        }
        //=========================================================
        const user = req.user; // Assuming user is populated in the request
        // const { cardToken }: { cardToken: string } = req.body;
        let opnCustomerID = "";
        const userId = user.id;
        // Fetch customer details from external API (if any)
        const customerMove = yield (0, user_1.findUserByIDService)(req, userId);
        // console.log("customerMove: ", customerMove);
        if (customerMove && customerMove.userOpnID) {
            opnCustomerID = customerMove.userOpnID;
        }
        else {
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
            const card = yield clientOmise.customers.create(customerData); // Use cardToken as string
            //===========================================================
            // console.log("default_card: ", card.default_card);// Create a new Stripe customer if not existing
            yield axios_1.default.put(`${process.env.USER_SERVICE_URL}/v1/api/users/${user.id}`, { userOpnID: card.id, defaultCard: card.default_card }, {
                headers: {
                    Authorization: `${req.headers["authorization"]}`,
                },
            });
            //TODO: set default card to user
            // await updateUserByIDService(req, userId, card.default_card);
            res.status(201).json({
                code: config_1.messages.CREATE_SUCCESSFUL.code,
                message: "Card created successfully",
                card: card,
            });
            return;
        }
        console.log("opnCustomerID: ", opnCustomerID);
        // Step 2: Attach the card to the existing customer using the received card token
        const card = yield clientOmise.customers.update(opnCustomerID, {
            card: cardToken, // Pass the card token directly (as a string)
        });
        console.log("Omise Customer Created: ", card);
        //===========================================================
        res.status(201).json({
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: "Card created successfully",
            card: card,
        });
        return;
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
    }
});
exports.createCardv2 = createCardv2;
const getCardByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // Assuming user is populated in the request
        const cardToken = req.params.id;
        // Fetch customer details from external API (if any)
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        const cardDetail = yield clientOmise.customers.retrieveCard(userData.userOpnID, cardToken);
        const card = {
            cardId: cardDetail.id,
            cardLastDigit: cardDetail.last_digits,
            brand: cardDetail.brand,
            cardName: cardDetail.name,
            expireMonth: cardDetail.expiration_month,
            expireYear: cardDetail.expiration_year,
        };
        res.status(200).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: "Get card Successful",
            card,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getCardByID = getCardByID;
const getCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user.id;
        // Fetch customer details from external API
        const userData = yield (0, user_1.findUserByIDService)(req, userId);
        if (!userData.userOpnID) {
            res.status(200).json({ code: config_1.messages.SUCCESSFULLY.code, message: config_1.messages.SUCCESSFULLY.message, total: 0, data: [] });
            return;
        }
        const cardDetail = yield clientOmise.customers.retrieve(userData.userOpnID);
        /**
         * If no cards, return
         */
        if (!cardDetail) {
            res.status(200).json({ code: config_1.messages.SUCCESSFULLY.code, message: config_1.messages.SUCCESSFULLY.message, total: 0, data: [] });
            return;
        }
        const cards = cardDetail.cards.data;
        const allCard = cardDetail.cards.total;
        const newCardFormat = [];
        //   TODO: change card format
        cards.map((card, index) => {
            // Check if the card.id matches the default_card field, and set the defaultCard flag
            const isDefaultCard = card.id === cardDetail.default_card ? true : false;
            newCardFormat[index] = {
                id: card.id,
                cardName: card.name,
                cardLastDigit: card.last_digits,
                brand: card.brand,
                expireMonth: card.expiration_month,
                expireYear: card.expiration_year,
                defaultCard: isDefaultCard, // Set defaultCard based on the comparison
            };
            return newCardFormat[index];
        });
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Get cards Sucessful",
            total: allCard,
            data: newCardFormat,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getCards = getCards;
const deleteCardByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cardToken = req.params.id;
        const user = req.user;
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        const cardDetail = yield clientOmise.customers.retrieve(userData.userOpnID);
        if (cardDetail.cards.total <= 1) {
            yield (0, user_1.updateUserByIDService)(req, user.id, "");
        }
        else {
            if (cardToken === userData.defaultCard) {
                if (cardToken !== cardDetail.cards.data[0]["id"]) {
                    yield (0, user_1.updateUserByIDService)(req, user.id, cardDetail.cards.data[0]["id"]);
                }
                else {
                    yield (0, user_1.updateUserByIDService)(req, user.id, cardDetail.cards.data[1]["id"]);
                }
            }
        }
        yield clientOmise.customers.destroyCard(userData.userOpnID, cardToken);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: "Delete card successful",
            card: {
                id: cardToken,
            },
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.deleteCardByID = deleteCardByID;
const updateDefaultCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cardToken = req.params.id;
        const user = req.user;
        const userData = yield (0, user_1.findUserByIDService)(req, user.id); // The customer ID (e.g., 'cust_test_620z7a2tipi1rf81gqv')
        // Step 2: Fetch the customer data from your service (if required)
        // Example: Get customer data based on the userId (not shown in this function)
        // const userData = await getUserData(userId); 
        const cardDetail = yield clientOmise.customers.retrieveCard(userData.userOpnID, cardToken);
        console.log(cardDetail);
        // Prepare the data to update the customer
        const customerData = {
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
        const updatedCard = yield clientOmise.customers.update(userData.userOpnID, customerData);
        console.log("Omise Card Updated: ", updatedCard);
        // Step 4: Respond with the updated customer data
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Update default card successful",
            customer: updatedCard, // Return the updated customer object
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.updateDefaultCard = updateDefaultCard;
//========================================================================
const createCardv1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const user = req.user;
        const { paymentMethodId, cardName, email } = req.body;
        let stripeCustomerID = "";
        const userId = user.id;
        // Fetch customer details from external API
        const customer = yield (0, user_1.findUserByIDService)(req, userId);
        if (customer && customer.userStripeID) {
            stripeCustomerID = customer.userStripeID;
        }
        else {
            // Create a new Stripe customer if not existing
            stripeCustomerID = yield createStripeCustomer({ cardName, email });
            yield axios_1.default.put(`${process.env.USER_SERVICE_URL}/v1/api/users/${user.id}`, { userStripeID: stripeCustomerID }, {
                headers: {
                    Authorization: `${
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    req.headers["authorization"]}`,
                },
            });
        }
        console.log("stripeCustomerID: ", stripeCustomerID);
        // Attach PaymentMethod to customer
        yield stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerID,
        });
        // Retrieve Payment method details
        const paymentMethodDetail = yield stripe.paymentMethods.retrieve(paymentMethodId);
        const card = {
            id: paymentMethodDetail.id,
            cardId: (_a = paymentMethodDetail.card) === null || _a === void 0 ? void 0 : _a.last4,
            brand: (_b = paymentMethodDetail.card) === null || _b === void 0 ? void 0 : _b.brand,
            cardName: (_c = paymentMethodDetail.billing_details) === null || _c === void 0 ? void 0 : _c.name,
            expireMonth: (_d = paymentMethodDetail.card) === null || _d === void 0 ? void 0 : _d.exp_month,
            expireYear: (_e = paymentMethodDetail.card) === null || _e === void 0 ? void 0 : _e.exp_year,
        };
        //TODO: set default card to user
        if (!customer.defaultCard) {
            yield (0, user_1.updateUserByIDService)(req, userId, paymentMethodDetail.id);
        }
        res.status(201).json({
            code: config_1.messages.CREATE_SUCCESSFUL.code,
            message: "Create card Successful",
            card,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.createCardv1 = createCardv1;
const getCardByIDv1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const paymentMethodId = req.params.id;
        const paymentMethodDetail = yield stripe.paymentMethods.retrieve(paymentMethodId);
        const card = {
            id: paymentMethodDetail.id,
            cardId: (_a = paymentMethodDetail.card) === null || _a === void 0 ? void 0 : _a.last4,
            brand: (_b = paymentMethodDetail.card) === null || _b === void 0 ? void 0 : _b.brand,
            cardName: (_c = paymentMethodDetail.billing_details) === null || _c === void 0 ? void 0 : _c.name,
            expireMonth: (_d = paymentMethodDetail.card) === null || _d === void 0 ? void 0 : _d.exp_month,
            expireYear: (_e = paymentMethodDetail.card) === null || _e === void 0 ? void 0 : _e.exp_year,
        };
        res.status(200).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: "Get card Successful",
            card,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getCardByIDv1 = getCardByIDv1;
const getCardsv1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = user.id;
        // Fetch customer details from external API
        const userData = yield (0, user_1.findUserByIDService)(req, userId);
        const paymentMethods = yield stripe.customers.listPaymentMethods(userData.userStripeID, { type: "card" });
        /**
         * If no cards, return
         */
        if (!paymentMethods) {
            res.status(200).json({ code: config_1.messages.SUCCESSFULLY.code, message: config_1.messages.SUCCESSFULLY.message, total: 0, data: [] });
            return;
        }
        const cards = paymentMethods.data;
        const allCard = cards.length;
        const newCardFormat = [];
        //   TODO: change card format
        cards.map((card, index) => {
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
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Get cards Sucessful",
            total: allCard,
            data: newCardFormat,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.getCardsv1 = getCardsv1;
const deleteCardByIDv1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethodId = req.params.id;
        const user = req.user;
        const userData = yield (0, user_1.findUserByIDService)(req, user.id);
        const paymentMethods = yield stripe.customers.listPaymentMethods(userData.userStripeID, { type: "card" });
        if (paymentMethods.data.length <= 1) {
            yield (0, user_1.updateUserByIDService)(req, user.id, "");
        }
        else {
            if (paymentMethodId === userData.defaultCard) {
                if (paymentMethodId !== paymentMethods.data[0]["id"]) {
                    yield (0, user_1.updateUserByIDService)(req, user.id, paymentMethods.data[0]["id"]);
                }
                else {
                    yield (0, user_1.updateUserByIDService)(req, user.id, paymentMethods.data[1]["id"]);
                }
            }
        }
        yield stripe.paymentMethods.detach(paymentMethodId);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            messages: "Delete card successful",
            card: {
                id: paymentMethodId,
            },
        });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.deleteCardByIDv1 = deleteCardByIDv1;
const updateDefaultCardv1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const paymentMethodId = req.body.paymentMethodId;
        const userData = yield (0, user_1.updateUserByIDService)(req, userId, paymentMethodId);
        res.status(200).json({
            code: config_1.messages.SUCCESSFULLY.code,
            message: "Update default card successful",
            user: userData,
        });
        return;
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            code: config_1.messages.INTERNAL_SERVER_ERROR.code,
            message: config_1.messages.INTERNAL_SERVER_ERROR.message,
            detail: error.message,
        });
        return;
    }
});
exports.updateDefaultCardv1 = updateDefaultCardv1;
const createStripeCustomer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ cardName, email }) {
    try {
        const customer = yield stripe.customers.create({
            name: cardName,
            email: email,
            tax_exempt: "exempt",
        });
        console.log("Customer created successfully:", customer);
        return customer.id;
    }
    catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
});
// update error case
