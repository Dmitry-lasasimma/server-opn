/**
 * @swagger
 * /v1/api/coupons:
 *   post:
 *     summary: Create a new coupon
 *     description: Add a new coupon with details like name, amount, points, validity period, and status.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Discount Coupon"
 *               amount:
 *                 type: number
 *                 example: 100
 *               point:
 *                 type: number
 *                 example: 10
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               couponCodes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ABC123", "DEF456"]
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Coupon created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create record successful"
 *                 record:
 *                   type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons/{id}:
 *   get:
 *     summary: Get a coupon by ID
 *     description: Retrieve a specific coupon by its ID.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coupon to retrieve.
 *     responses:
 *       200:
 *         description: Coupon fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get data successfully"
 *                 record:
 *                   type: object
 *       404:
 *         description: Coupon not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons:
 *   get:
 *     summary: Get all coupons
 *     description: Retrieve all coupons with optional pagination.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Number of records to skip.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Maximum number of records to retrieve.
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filter status of records to retrieve.
 *     responses:
 *       200:
 *         description: Coupons fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 message:
 *                   type: string
 *                   example: "Get records successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons/{id}:
 *   put:
 *     summary: Update a coupon by ID
 *     description: Update the details of a coupon by its ID.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coupon to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Coupon"
 *               amount:
 *                 type: number
 *                 example: 200
 *               point:
 *                 type: number
 *                 example: 20
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Coupon updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Record updated successfully"
 *                 updatedRecord:
 *                   type: object
 *       404:
 *         description: Coupon not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons/{id}:
 *   delete:
 *     summary: Delete a coupon by ID
 *     description: Delete a specific coupon by its ID.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the coupon to delete.
 *     responses:
 *       200:
 *         description: Coupon deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Record deleted successfully"
 *       404:
 *         description: Coupon not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons/generate-coupon:
 *   post:
 *     summary: Generate coupons
 *     description: Generate a specific number of coupons.
 *     tags:
 *       - Coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Coupons generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create record successful"
 *                 record:
 *                   type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons/redeem:
 *   post:
 *     summary: Redeem points from coupon
 *     description: Validate a coupon by its code.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "ABC123"
 *     responses:
 *       200:
 *         description: Coupon validation successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /v1/api/coupons:
 *   delete:
 *     summary: Delete multiple coupons
 *     description: Deletes multiple coupons based on an array of IDs.
 *     tags:
 *       - Coupons
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               arrayIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60f7d2538c13ae4d5e3a36f2", "60f7d2538c13ae4d5e3a36f3"]
 *                 description: Array of coupon IDs to delete.
 *     responses:
 *       200:
 *         description: Coupons deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "SUCCESSFULLY"
 *                 message:
 *                   type: string
 *                   example: "Records deleted successfully"
 *                 deletedCount:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Invalid or empty array of IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "BAD_REQUEST"
 *                 message:
 *                   type: string
 *                   example: "Invalid or empty array of IDs"
 *       404:
 *         description: No records found with the provided IDs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "No records found with the provided IDs"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 detail:
 *                   type: string
 *                   example: "Error details message here"
 */
