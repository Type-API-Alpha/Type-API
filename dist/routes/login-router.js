"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import LoginController from "../controllers/login-controller";
const login_middleware_1 = __importDefault(require("../middlewares/login-middleware"));
const loginRouter = (0, express_1.Router)();
loginRouter.post('/login', login_middleware_1.default.validateBodyToLogin);
exports.default = loginRouter;
