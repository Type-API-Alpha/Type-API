"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import UserController from "../controllers/user-controller";
// import UserMiddleware from "../middlewares/user-middleware";
const userRouter = (0, express_1.Router)();
// userRouter.get('/user', UserController.getUsers);
// userRouter.post('/user', UserMiddleware.validadeRequestBodyToCreate, UserController.registerNewUser);
exports.default = userRouter;
