import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import Routes
import authRoutes from "./routes/auth";
import connectDB from "./config/database";
import topupRoutes from "./routes/topup";
import paymentHistoryRoutes from "./routes/paymentHistory";
import walletRoutes from "./routes/wallet";
import cardRoutes from "./routes/card";
import taxInvoiceRoutes from "./routes/taxInvoice";
import reservationRoutes from "./routes/reservation";
import couponRoutes from "./routes/coupon";
import reservationChargeFeeRoutes from "./routes/reservationChargeFee";
import reservationConfigureRoutes from "./routes/reservationConfigure";
import paymentMethodRoutes from "./routes/paymentMethod";
import swaggerOptions from "./docs/swagger";

dotenv.config();

// Initialize express the Express application
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connected to the MongoDB database
connectDB();

const swaggerDocs = swaggerJsdoc(swaggerOptions);

//Routes
app.use("/v1/api/auths", authRoutes);
app.use("/v1/api/topups", topupRoutes);
app.use("/v1/api/payment-histories", paymentHistoryRoutes);
app.use("/v1/api/wallets", walletRoutes);
app.use("/v1/api/cards", cardRoutes);
app.use("/v1/api/tax-invoices", taxInvoiceRoutes);
app.use("/v1/api/reservations", reservationRoutes);
app.use("/v1/api/coupons", couponRoutes);
app.use("/v1/api/reservation-charge-fees", reservationChargeFeeRoutes);
app.use("/v1/api/reservation-configures", reservationConfigureRoutes);
app.use("/v1/api/payment-method", paymentMethodRoutes);
app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set the port for the server
const PORT = process.env.PORT || 9090;

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

