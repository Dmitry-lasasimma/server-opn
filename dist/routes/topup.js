"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topup_1 = require("../controllers/topup");
const middlewares_1 = require("../middlewares");
const topup_2 = require("../validators/topup");
const router = express_1.default.Router();
router.post("/", middlewares_1.checkAuthorizationMiddleware, topup_2.validateCreateTopup, topup_1.createTopup);
router.get("/:id", middlewares_1.checkAuthorizationMiddleware, topup_2.validateParamID, topup_1.getTopupByID);
router.get("/", middlewares_1.checkAuthorizationMiddleware, topup_1.getTopups);
router.put("/:id", middlewares_1.checkAuthorizationMiddleware, topup_2.validateParamID, topup_1.updateTopupByID);
router.delete("/", middlewares_1.checkAuthorizationMiddleware, middlewares_1.checkAuthorizationAdminRole, topup_2.validateDeleteManyTopup, topup_1.deleteManyTopups);
exports.default = router;
