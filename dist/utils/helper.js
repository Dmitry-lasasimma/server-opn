"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
const generateUserId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};
exports.generateUserId = generateUserId;
