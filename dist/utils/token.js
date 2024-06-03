"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenSecretKey = process.env.JWT_PWD;
const createToken = (payload, options) => {
    const token = jsonwebtoken_1.default.sign(payload, tokenSecretKey, options);
    return token;
};
exports.createToken = createToken;
const verifyToken = (token) => {
    let validationResult = false;
    jsonwebtoken_1.default.verify(token, tokenSecretKey, function (err, decoded) {
        if (err) {
            return;
        }
        else {
            validationResult = decoded;
        }
    });
    return validationResult;
};
exports.verifyToken = verifyToken;
module.exports = {
    createToken: exports.createToken,
    verifyToken: exports.verifyToken
};
