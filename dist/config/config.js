"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    PORT: Number(process.env.PORT),
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: Number(process.env.DB_PORT)
};
exports.default = config;
