"use strict";
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     IWallet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the wallet.
 *           example: "675e805a62fcef8fea418bd3"
 *         user:
 *           type: string
 *           description: User ID associated with the wallet.
 *           example: "60d0fe4f5311236168a109ca"
 *         credit:
 *           type: number
 *           description: Amount of credit in the wallet.
 *           example: 1500
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the wallet was created.
 *           example: "2023-04-01T10:00:00Z"
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the wallet.
 *           example: "60d0fe4f5311236168a109cb"
 *         createdByFullName:
 *           type: string
 *           description: Full name of the user who created the wallet.
 *           example: "John Doe"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the wallet was last updated.
 *           example: "2023-04-15T12:30:00Z"
 *         updatedBy:
 *           type: string
 *           description: ID of the user who last updated the wallet.
 *           example: "60d0fe4f5311236168a109cc"
 *         updatedByFullName:
 *           type: string
 *           description: Full name of the user who last updated the wallet.
 *           example: "Jane Smith"
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "SUCCESSFULLY"
 *         message:
 *           type: string
 *           example: "Get data successfully"
 *         record:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IWallet'
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
 *           example: "record not found with this id"
 * paths:
 *   /v1/api/wallets/user:
 *     get:
 *       summary: Retrieve wallets by user
 *       description: Fetches wallet records for the authenticated user with pagination.
 *       tags:
 *         - Wallets
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: Wallets retrieved successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *               example:
 *                 code: "SUCCESSFULLY"
 *                 message: "Get data successfully"
 *                 record:
 *                   - id: "675e805a62fcef8fea418bd3"
 *                     user: "60d0fe4f5311236168a109ca"
 *                     credit: 1500
 *                     createdAt: "2023-04-01T10:00:00Z"
 *                     createdBy: "60d0fe4f5311236168a109cb"
 *                     createdByFullName: "John Doe"
 *                     updatedAt: "2023-04-15T12:30:00Z"
 *                     updatedBy: "60d0fe4f5311236168a109cc"
 *                     updatedByFullName: "Jane Smith"
 *         '404':
 *           description: Wallet not found.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 code: "NOT_FOUND"
 *                 message: "Not Found"
 *                 detail: "record not found with this id"
 *         '500':
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *               example:
 *                 message: "Internal Server Error"
 *                 detail: "Failed to retrieve data"
 */
