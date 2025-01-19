"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 9090;
const IP = process.env.IP;
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Move Payment Service API documentation',
        },
        servers: [
            {
                url: `http://${IP}:${PORT}`, // Production server
                description: 'Dev Development server',
            },
            {
                url: `http://localhost:${PORT}`, // Update with your server's URL
                description: 'Local Development server',
            },
        ]
    },
    apis: ['./src/docs/**/*.ts'], // Adjust the path to match your route files
};
exports.default = swaggerOptions;
