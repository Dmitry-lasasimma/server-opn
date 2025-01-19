"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxInvoice_1 = require("../controllers/taxInvoice");
const middlewares_1 = require("../middlewares");
const taxInvoice_2 = require("../validators/taxInvoice");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, taxInvoice_2.validateCreateTaxInvoice, taxInvoice_1.createTaxInvoice);
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, taxInvoice_2.validateParamID, taxInvoice_1.getTaxInvoiceByID);
router.get("/", middlewares_1.checkAuthorizationMiddleware, taxInvoice_1.getTaxInvoices);
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, taxInvoice_2.validateParamID, taxInvoice_1.updateTaxInvoiceByID);
router.delete("/:id", middlewares_1.checkAuthorizationMiddleware, taxInvoice_2.validateParamID, taxInvoice_1.deleteTaxInvoiceByID);
exports.default = router;
