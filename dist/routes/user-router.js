"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import UserController from "../controllers/user-controller";
const user_middleware_1 = __importDefault(require("../middlewares/user-middleware"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const login_middleware_1 = __importDefault(require("../middlewares/login-middleware"));
const userRouter = (0, express_1.Router)();
// userRouter.get('/user', UserController.getUsers);
userRouter.post('/user', user_middleware_1.default.validadeRequestBodyToCreateUser, user_controller_1.default.createNewUser);
userRouter.use(login_middleware_1.default.authorization);
userRouter.get("/users", user_controller_1.default.getAllUsers);
exports.default = userRouter;
