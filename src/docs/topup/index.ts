/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * paths:
 *   /v1/api/topups:
 *     post:
 *       summary: Create a Topup
 *       description: Create a new topup package.
 *       tags:
 *         - Topups
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 packageName:
 *                   type: string
 *                   description: Name of the topup package.
 *                 credit:
 *                   type: number
 *                   description: The amount of credit in the topup package.
 *                 price:
 *                   type: number
 *                   description: Price of the topup package.
 *                 pointPrice:
 *                   type: number
 *                   description: pointPrice of the topup package.
 *                 type:
 *                   type: string
 *                   enum: [NORMAL, PROMOTION]
 *                   description: Type of the topup package.
 *                 point:
 *                   type: number
 *                   description: Point of the PROMOTION topup package.
 *       responses:
 *         201:
 *           description: Topup created successfully.
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
 *                     example: Create record Successful
 *                   record:
 *                     type: object
 *         500:
 *           description: Internal server error.
 *     get:
 *       summary: Get all Topups
 *       description: Retrieve a list of all topups with optional filters.
 *       tags:
 *         - Topups
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
 *           name: packageName
 *           schema:
 *             type: string
 *           description: Filter topups by package name.
 *         - in: query
 *           name: type
 *           schema:
 *             type: string
 *             enum: [NORMAL, PROMOTION]
 *           description: Filter topups by type.
 *         - in: query
 *           name: minPrice
 *           schema:
 *             type: number
 *           description: Minimum price for filtering.
 *         - in: query
 *           name: maxPrice
 *           schema:
 *             type: number
 *           description: Maximum price for filtering.
 *         - in: query
 *           name: startDate
 *           schema:
 *             type: string
 *             format: date
 *           description: "Filter topups created after this date (format: YYYY-MM-DD)."
 *         - in: query
 *           name: endDate
 *           schema:
 *             type: string
 *             format: date
 *           description: "Filter topups created before this date (format: YYYY-MM-DD)."
 *         - in: query
 *           name: isAvailable
 *           schema:
 *             type: boolean
 *           description: "Filter topups that are available."
 *       responses:
 *         200:
 *           description: Topups retrieved successfully.
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
 *                     example: Topups retrieved successfully
 *                   total:
 *                     type: integer
 *                   topups:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         packageName:
 *                           type: string
 *                         credit:
 *                           type: number
 *                         price:
 *                           type: number
 *                         type:
 *                           type: string
 *                           enum: [NORMAL, PROMOTION]
 *         404:
 *           description: No topups found.
 *         500:
 *           description: Internal server error.
 *     put:
 *       summary: Update a Topup
 *       description: Update the details of a topup package by its ID.
 *       tags:
 *         - Topups
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the topup to update.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 packageName:
 *                   type: string
 *                   description: Name of the topup package.
 *                 credit:
 *                   type: number
 *                   description: The amount of credit in the topup package.
 *                 price:
 *                   type: number
 *                   description: Price of the topup package.
 *                 pointPrice:
 *                   type: number
 *                   description: Price of the topup package.
 *                 type:
 *                   type: string
 *                   enum: [NORMAL, PROMOTION]
 *                   description: Type of the topup package.
 *       responses:
 *         200:
 *           description: Topup updated successfully.
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
 *                     example: Topup updated successfully.
 *                   updatedRecord:
 *                     type: object
 *         404:
 *           description: Topup not found.
 *         500:
 *           description: Internal server error.
 *     delete:
 *       summary: Delete multiple Topups
 *       description: Delete many topups by their IDs.
 *       tags:
 *         - Topups
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 arrayIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of topup IDs to be deleted.
 *       responses:
 *         200:
 *           description: Topups deleted successfully.
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
 *                     example: Topups deleted successfully.
 *                   deletedCount:
 *                     type: integer
 *         400:
 *           description: Invalid array of IDs.
 *         404:
 *           description: No topups found with the provided IDs.
 *         500:
 *           description: Internal server error.
 */
