/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the payment method.
 *           example: "675e805a62fcef8fea418bd3"
 *         name:
 *           type: string
 *           description: Name of the payment method.
 *           example: "CARD"
 *         status:
 *           type: boolean
 *           description: Status of the payment method (active/inactive).
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the payment method was created.
 *           example: "2023-04-01T10:00:00Z"
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the payment method.
 *           example: "60d0fe4f5311236168a109cb"
 *         createdByFullName:
 *           type: string
 *           description: Full name of the user who created the payment method.
 *           example: "John Doe"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the payment method was last updated.
 *           example: "2023-04-15T12:30:00Z"
 *         updatedBy:
 *           type: string
 *           description: ID of the user who last updated the payment method.
 *           example: "60d0fe4f5311236168a109cc"
 *         updatedByFullName:
 *           type: string
 *           description: Full name of the user who last updated the payment method.
 *           example: "Jane Smith"
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "SUCCESSFULLY"
 *         message:
 *           type: string
 *           example: "Operation successful"
 *         total:
 *           type: number
 *           description: Total count of records.
 *           example: 20
 *         paymentMethods:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "NOT_FOUND"
 *         message:
 *           type: string
 *           example: "Not Found"
 *         detail:
 *           type: string
 *           example: "No record found with this ID"
 * paths:
 *   /v1/api/payment-method:
 *     get:
 *       summary: Retrieve payment methods
 *       description: Fetches payment methods with optional pagination and filtering.
 *       tags:
 *         - Payment Methods
 *       parameters:
 *         - in: query
 *           name: skip
 *           schema:
 *             type: integer
 *             example: 0
 *           description: Number of records to skip.
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             example: 10
 *           description: Maximum number of records to return.
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *             example: "CARD"
 *           description: Filter payment methods by name.
 *         - in: query
 *           name: status
 *           schema:
 *             type: boolean
 *             example: true
 *           description: Filter payment methods by status.
 *       responses:
 *         '200':
 *           description: Payment methods retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         '404':
 *           description: No payment methods found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '500':
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *   /v1/api/payment-method/{id}:
 *     put:
 *       summary: Update a payment method by ID
 *       description: Updates a specific payment method's details.
 *       tags:
 *         - Payment Methods
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the payment method to update.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Debit Card"
 *                 status:
 *                   type: boolean
 *                   example: true
 *       responses:
 *         '200':
 *           description: Payment method updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "SUCCESSFULLY"
 *                   message:
 *                     type: string
 *                     example: "Record updated successfully"
 *                   updatedRecord:
 *                     $ref: '#/components/schemas/PaymentMethod'
 *         '404':
 *           description: Payment method not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '500':
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
