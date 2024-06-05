"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_middleware_1 = __importDefault(require("../middlewares/login-middleware"));
const login_controller_1 = __importDefault(require("../controllers/login-controller"));
const loginRouter = (0, express_1.Router)();
loginRouter.post('/login', login_middleware_1.default.validateBodyToLogin, login_controller_1.default.handleLoginRequest);
loginRouter.use(login_middleware_1.default.authorization);
loginRouter.delete('/logout', login_controller_1.default.logout);
exports.default = loginRouter;
