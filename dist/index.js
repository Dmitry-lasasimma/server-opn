"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Import Routes
const database_1 = __importDefault(require("./config/database"));
const topup_1 = __importDefault(require("./routes/topup"));
const paymentHistory_1 = __importDefault(require("./routes/paymentHistory"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const card_1 = __importDefault(require("./routes/card"));
const taxInvoice_1 = __importDefault(require("./routes/taxInvoice"));
const reservation_1 = __importDefault(require("./routes/reservation"));
const coupon_1 = __importDefault(require("./routes/coupon"));
const reservationChargeFee_1 = __importDefault(require("./routes/reservationChargeFee"));
const reservationConfigure_1 = __importDefault(require("./routes/reservationConfigure"));
const paymentMethod_1 = __importDefault(require("./routes/paymentMethod"));
const swagger_1 = __importDefault(require("./docs/swagger"));
dotenv_1.default.config();
// Initialize express the Express application
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connected to the MongoDB database
(0, database_1.default)();
const swaggerDocs = (0, swagger_jsdoc_1.default)(swagger_1.default);
//Routes
app.use("/v1/api/topups", topup_1.default);
app.use("/v1/api/payment-histories", paymentHistory_1.default);
app.use("/v1/api/wallets", wallet_1.default);
app.use("/v1/api/cards", card_1.default);
app.use("/v1/api/tax-invoices", taxInvoice_1.default);
app.use("/v1/api/reservations", reservation_1.default);
app.use("/v1/api/coupons", coupon_1.default);
app.use("/v1/api/reservation-charge-fees", reservationChargeFee_1.default);
app.use("/v1/api/reservation-configures", reservationConfigure_1.default);
app.use("/v1/api/payment-method", paymentMethod_1.default);
app.use('/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Set the port for the server
const PORT = process.env.PORT || 9090;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
