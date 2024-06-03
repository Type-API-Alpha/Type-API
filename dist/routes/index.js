"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const login_router_1 = __importDefault(require("./login-router"));
const user_router_1 = __importDefault(require("./user-router"));
const team_router_1 = __importDefault(require("./team-router"));
const appRouter = (0, express_1.Router)();
appRouter.use((0, cookie_parser_1.default)());
appRouter.use('/api/v1', login_router_1.default);
appRouter.use('/api/v1', user_router_1.default);
appRouter.use('/api/v1', team_router_1.default);
exports.default = appRouter;
