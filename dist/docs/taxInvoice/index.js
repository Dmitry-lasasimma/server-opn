"use strict";
/**
 * @swagger
 * /v1/api/tax-invoices:
 *   post:
 *     summary: Create a new tax invoice
 *     description: Creates a tax invoice for a payment using the user's tax information.
 *     tags:
 *       - Tax Invoices
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: "60f7d2538c13ae4d5e3a36f2"
 *     responses:
 *       200:
 *         description: Tax invoice created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create record Successful"
 *                 record:
 *                   type: object
 *       404:
 *         description: User tax information not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /v1/api/tax-invoices/{id}:
 *   get:
 *     summary: Get a tax invoice by ID
 *     description: Retrieve a specific tax invoice by its ID.
 *     tags:
 *       - Tax Invoices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tax invoice to retrieve.
 *     responses:
 *       200:
 *         description: Tax invoice fetched successfully.
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
 *         description: Tax invoice not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /v1/api/tax-invoices:
 *   get:
 *     summary: Get all tax invoices
 *     description: Retrieve all tax invoices with optional pagination and filtering.
 *     tags:
 *       - Tax Invoices
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
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter by user ID.
 *     responses:
 *       200:
 *         description: Tax invoices fetched successfully.
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
 *                   example: "Get Records successfully"
 *                 Data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No records found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /v1/api/tax-invoices/{id}:
 *   put:
 *     summary: Update a tax invoice by ID
 *     description: Update the details of a tax invoice by its ID.
 *     tags:
 *       - Tax Invoices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tax invoice to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "60f7d2538c13ae4d5e3a36f2"
 *               payment:
 *                 type: string
 *                 example: "60f7d2538c13ae4d5e3a36f2"
 *               invoiceNumber:
 *                 type: string
 *                 example: "INV-2024-001"
 *               status:
 *                 type: string
 *                 example: "APPROVED"
 *               rejectionReason:
 *                 type: string
 *                 example: "Missing payment details"
 *     responses:
 *       200:
 *         description: Tax invoice updated successfully.
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
 *         description: Tax invoice not found.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /v1/api/tax-invoices/{id}:
 *   delete:
 *     summary: Delete a tax invoice by ID
 *     description: Delete a specific tax invoice by its ID.
 *     tags:
 *       - Tax Invoices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tax invoice to delete.
 *     responses:
 *       200:
 *         description: Tax invoice deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Record deleted successfully"
 *       404:
 *         description: Tax invoice not found.
 *       500:
 *         description: Internal server error.
 */
