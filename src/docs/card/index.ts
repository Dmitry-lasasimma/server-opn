/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /v1/api/cards/create-customer:
 *     post:
 *       summary: Create a new card for a customer and attach it
 *       description: This route creates a new card for the customer by generating a token from the provided card details and then attaching that card to the customer.
 *       tags:
 *         - Cards
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - cardName
 *                 - cardCity
 *                 - cardPostalCode
 *                 - cardNumber
 *                 - cardSecurityCode
 *                 - cardExpirationMonth
 *                 - cardExpirationYear
 *               properties:
 *                 cardName:
 *                   type: string
 *                   description: The name of the cardholder as it appears on the card.
 *                   example: "Take"
 *                 cardCity:
 *                   type: string
 *                   description: The city of the cardholder's billing address.
 *                   example: "Vientiane"
 *                 cardPostalCode:
 *                   type: string
 *                   description: The postal code of the cardholder's billing address.
 *                   example: "01000"
 *                 cardNumber:
 *                   type: string
 *                   description: The credit card number.
 *                   example: "4111111111111111"
 *                 cardSecurityCode:
 *                   type: string
 *                   description: The card verification value (CVV/CVC).
 *                   example: "123"
 *                 cardExpirationMonth:
 *                   type: string
 *                   description: The card's expiration month in numeric form.
 *                   example: "3"
 *                 cardExpirationYear:
 *                   type: string
 *                   description: The card's expiration year in YYYY format.
 *                   example: "2028"
 *       responses:
 *         '201':
 *           description: Successfully created customer and card.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: CREATE_SUCCESSFUL
 *                   message:
 *                     type: string
 *                     example: "Card created successfully"
 *                   card:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: card_test_620z6js7qzz7q8k72jxh
 *                       brand:
 *                         type: string
 *                         example: "Visa"
 *                       last4:
 *                         type: string
 *                         example: "4242"
 *                       exp_month:
 *                         type: string
 *                         example: "12"
 *                       exp_year:
 *                         type: string
 *                         example: "2025"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /v1/api/cards/{id}:
 *     get:
 *       summary: Get details of a card by ID
 *       description: Retrieve the card details using its ID.
 *       tags:
 *         - Cards
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID of the card to retrieve.
 *           schema:
 *             type: string
 *             example: card_test_620z6js7qzz7q8k72jxh
 *       responses:
 *         '200':
 *           description: Successfully retrieved card details.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: SUCCESSFUL
 *                   message:
 *                     type: string
 *                     example: "Card details retrieved successfully"
 *                   card:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: card_test_620z6js7qzz7q8k72jxh
 *                       brand:
 *                         type: string
 *                         example: "Visa"
 *                       last4:
 *                         type: string
 *                         example: "4242"
 *                       exp_month:
 *                         type: string
 *                         example: "12"
 *                       exp_year:
 *                         type: string
 *                         example: "2025"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /v1/api/cards:
 *     get:
 *       summary: Get all cards
 *       description: Retrieve a list of all cards for the authenticated user.
 *       tags:
 *         - Cards
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: Successfully retrieved cards list.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: SUCCESSFUL
 *                   message:
 *                     type: string
 *                     example: "Cards retrieved successfully"
 *                   cards:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: card_test_620z6js7qzz7q8k72jxh
 *                         brand:
 *                           type: string
 *                           example: "Visa"
 *                         last4:
 *                           type: string
 *                           example: "4242"
 *                         exp_month:
 *                           type: string
 *                           example: "12"
 *                         exp_year:
 *                           type: string
 *                           example: "2025"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /v1/api/cards/{id}:
 *     delete:
 *       summary: Delete a card by ID
 *       description: Delete the card specified by its ID.
 *       tags:
 *         - Cards
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID of the card to delete.
 *           schema:
 *             type: string
 *             example: card_test_620z6js7qzz7q8k72jxh
 *       responses:
 *         '200':
 *           description: Successfully deleted the card.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: DELETE_SUCCESSFUL
 *                   message:
 *                     type: string
 *                     example: "Card deleted successfully"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /v1/api/cards/default-card/{id}:
 *     put:
 *       summary: Set a card as the default card for the customer
 *       description: This route updates the default card for the customer by setting the specified card as the default.
 *       tags:
 *         - Cards
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID of the card to set as default.
 *           schema:
 *             type: string
 *             example: card_test_620z6js7qzz7q8k72jxh
 *       responses:
 *         '200':
 *           description: Successfully updated the default card.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: UPDATE_SUCCESSFUL
 *                   message:
 *                     type: string
 *                     example: "Default card updated successfully"
 */
