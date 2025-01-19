/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories/omise-payment:
 *     post:
 *       summary: Create a Card Payment
 *       description: Create a new card payment.
 *       tags:
 *         - Payments
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the top-up package.
 *                 currency:
 *                   type: string
 *                   description: The currency of the payment.
 *       responses:
 *         201:
 *           description: Create Payment Successful.
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
 *                     example: Create Payment Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 */


/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories/omise-promptpay-payment:
 *     post:
 *       summary: Create a PromptPay Payment
 *       description: Create a new payment using PromptPay.
 *       tags:
 *         - PromptPay Payments
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the top-up package.
 *                 currency:
 *                   type: string
 *                   description: The currency of the payment.
 *       responses:
 *         201:
 *           description: Create PromptPay Payment Successful.
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
 *                     example: Create PromptPay Payment Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 */

/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories/point-payment:
 *     post:
 *       summary: Create a Point Payment
 *       description: Create a new payment using Point.
 *       tags:
 *         - Point Payments
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the top-up package.
 *       responses:
 *         201:
 *           description: Create Point Payment Successful.
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
 *                     example: Create Point Payment Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 */

/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories/charge:
 *     post:
 *       summary: Create a charge payment history
 *       description: Create a new charge payment history when paid for charge.
 *       tags:
 *         - Charge Payment history
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credit:
 *                   type: number
 *                   example: 135
 *                 chargeStartTime:
 *                   type: string
 *                   format: date-time    
 *                   example: "2025-01-14T11:29:57Z"
 *                 chargeEndTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-14T11:33:04Z"
 *                 energyImport:
 *                   type: number
 *                   example: 10
 *                 chargingStationName:
 *                   type: string
 *                   description: Name of station.
 *                 chargerMachineName:
 *                   type: string
 *                   description: Name of charger machine.
 *                 chargerTypeName:
 *                   type: string
 *                   description: Name of charger type.
 *       responses:
 *         201:
 *           description: Create Chare Payment History Successful.
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
 *                     example: Create Charge Payment History Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 */

/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories/reserve:
 *     post:
 *       summary: Create a reserve payment history
 *       description: Create a new reserve payment history when reserve for charge.
 *       tags:
 *         - Reserve Payment History
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credit:
 *                   type: number
 *                   example: 20
 *       responses:
 *         201:
 *           description: Create Reserve Payment History Successful.
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
 *                     example: Create Reserve Payment History Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 */

/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories/fee:
 *     post:
 *       summary: Create a fee payment history
 *       description: Create a new fee payment history when got fine.
 *       tags:
 *         - Fee Payment History
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creditFee:
 *                   type: number
 *                   example: 5
 *                 durationFee:
 *                   type: number
 *                   example: 15
 *       responses:
 *         201:
 *           description: Create Fee Payment History Successful.
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
 *                     example: Create Fee Payment History Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 */

/**
 * @swagger
 * paths:
 *   /v1/api/payment-histories:
 *     get:
 *       summary: Get all Payment Histories
 *       description: Retrieve a list of all payment histories with optional filters.
 *       tags:
 *         - PaymentHistories
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: query
 *           name: skip
 *           schema:
 *             type: integer
 *           description: Number of records to skip for pagination.
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Maximum number of records to retrieve.
 *         - in: query
 *           name: topupPackage
 *           schema:
 *             type: string
 *           description: Filter Payment Histories by package name.
 *         - in: query
 *           name: paymentChannel
 *           schema:
 *             type: string
 *             enum: [BANK, CREDIT_CARD, PROMPTPAY]
 *           description: Filter Payment Histories by payment channel.
 *       responses:
 *         200:
 *           description: Payments retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: SUCCESSFULLY
 *                   message:
 *                     type: string
 *                     example: Payments retrieved successfully
 *                   total:
 *                     type: integer
 *                   payments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                         paymentID:
 *                           type: string
 *                         topupPackage:
 *                           type: string
 *                         credit:
 *                           type: number
 *                         price:
 *                           type: number
 *                         currency:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [SUCCESS, FAILED]
 *                         paymentChannel:
 *                           type: string
 *                           enum: [BANK, CREDIT_CARD, PROMPTPAY]
 *                         type:
 *                           type: string
 *                           enum: [BANK, PROMOTION]
 *                         cardType:
 *                           type: string
 *                         cardLast4:
 *                           type: string
 *                         omiseTransactionID:
 *                           type: string
 *                         omiseTransactionDetail:
 *                           type: string
 *                         transactionID:
 *                           type: string
 *                         bankName:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         createdBy:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                         updatedBy:
 *                           type: string
 *         404:
 *           description: No payments found.
 *         500:
 *           description: Internal server error.
 */
