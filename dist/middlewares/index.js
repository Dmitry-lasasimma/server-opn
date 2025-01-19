"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStaffByIdService = exports.checkAuthorizationAdminRole = exports.checkAuthorizationMiddleware = exports.CheckAuthorizationMiddleware = exports.tokenVerification = exports.getUserDataOnToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
const staff_1 = require("../models/staff");
dotenv_1.default.config();
// Error handler for JWT validation
const jwtErrorHandler = (err, res) => {
    res.status(401).json({
        message: "Unauthorized",
        detail: err.message,
    });
};
// Function to extract token data from the request's Authorization header
const getUserDataOnToken = (req) => {
    try {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        const authorization = req.headers["authorization"];
        if (!authorization || !authorization.startsWith("Bearer ")) {
            throw new Error("Invalid or missing Authorization header");
        }
        const token = authorization.split(" ")[1]; // Extract the token after "Bearer "
        const secretKey = process.env.JWT_SECRET_KEY;
        // console.log("JWT Secret Key:", secretKey);
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (typeof decoded !== "object" ||
            !("id" in decoded) ||
            !("role" in decoded)) {
            throw new Error("Invalid token structure");
        }
        const { id, fullName, status, role } = decoded;
        return { id, fullName, status, role };
    }
    catch (error) {
        console.error("Token verification error:", error.message);
        return null;
    }
};
exports.getUserDataOnToken = getUserDataOnToken;
// Token verification function
const tokenVerification = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check token from header
        const tokenFromHeader = (0, exports.getUserDataOnToken)(req);
        if (!tokenFromHeader)
            return { isValid: false, data: null };
        return { isValid: true, data: tokenFromHeader };
    }
    catch (error) {
        console.error("Error in token verification:", error);
        return { isValid: false, data: null };
    }
});
exports.tokenVerification = tokenVerification;
// JWT Middleware for Express with token verification and storing user data in req.user
const CheckAuthorizationMiddleware = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Verify the token and get token data
            const tokenResponse = yield (0, exports.tokenVerification)(req);
            if (!tokenResponse.isValid || !tokenResponse.data) {
                res.status(403).json({
                    message: "Invalid or missing token",
                });
                return; // Ensure the function exits after sending the response
            }
            // Attach the decoded token data to req.user
            req.user = tokenResponse.data;
            next(); // Proceed to the next middleware or route handler
        }
        catch (error) {
            jwtErrorHandler(error, res);
        }
    });
};
exports.CheckAuthorizationMiddleware = CheckAuthorizationMiddleware;
// check TokenExpiredError and UserBlocked
const checkAuthorizationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["authorization"];
        if (token) {
            const accessToken = token.replace("Bearer ", "");
            const payloadData = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY || '');
            req.user = payloadData;
            yield checkUserStatus(req.user.id, req.user.role);
            yield checkStaffStatus(req.user.id, req.user.role);
        }
        else {
            res.status(401).json({ code: config_1.messages.UNAUTHORIZED.code, message: config_1.messages.UNAUTHORIZED.message, detail: "Invalid signature" });
            return;
        }
        next();
    }
    catch (error) {
        console.log("error: ", error);
        console.log("error.name: ", error.name);
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ code: config_1.messages.TOKEN_EXPIRED.code, message: config_1.messages.TOKEN_EXPIRED.message });
            return;
        }
        if (error.message === "USER_NOT_VALID") {
            res.status(401).json({ code: config_1.messages.UNAUTHORIZED.code, message: config_1.messages.UNAUTHORIZED.message });
            return;
        }
        res.status(401).json({ code: config_1.messages.UNAUTHORIZED.code, message: config_1.messages.UNAUTHORIZED.message, detail: "Invalid signature" });
        return;
    }
});
exports.checkAuthorizationMiddleware = checkAuthorizationMiddleware;
// =================================================================
const checkAuthorizationAdminRole = (req, res, next) => {
    // console.log("Check Authorization Admin Role");
    // console.log(req.headers);
    const user = req.user;
    if (user.role !== "EV_ADMIN" &&
        user.role !== "EV_STAFF" &&
        user.role !== "EV_MANAGER") {
        res.status(403).json({
            message: config_1.messages.FORBIDDEN,
            detail: "Permission denied to access this route",
        });
        return;
    }
    next();
};
exports.checkAuthorizationAdminRole = checkAuthorizationAdminRole;
const findStaffByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("id: ", id);
        const staff = yield staff_1.staffModel.findById(id)
            .populate({
            path: "createdBy",
            select: "fullName userName",
        })
            .exec();
        return staff;
    }
    catch (error) {
        console.log("findAllStaffsService: ", error);
        throw new Error("Error in findAllStaffsService");
    }
});
exports.findStaffByIdService = findStaffByIdService;
// check user&staff status
const checkStaffStatus = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (role === "CUSTOMER") {
            return;
        }
        const user = yield staff_1.staffModel.findById(id).select("-pin -__v").exec();
        if (!user) {
            return null;
        }
        if (user.status === "BLOCKED") {
            throw new Error("USER_NOT_VALID");
        }
        return user;
    }
    catch (error) {
        console.error("Error in findUserByIdService:", error);
        throw error;
    }
});
const checkUserStatus = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (role !== "CUSTOMER") {
            return;
        }
        const user = yield user_1.userModel.findById(id).select("-pin -__v").exec();
        if (!user) {
            return null;
        }
        if (user.status === "BLOCKED") {
            throw new Error("USER_NOT_VALID");
        }
        return user;
    }
    catch (error) {
        console.error("Error in findUserByIdService:", error);
        throw error;
    }
});
