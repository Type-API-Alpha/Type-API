import { Router } from "express";
// import UserController from "../controllers/user-controller";
import UserMiddleware from "../middlewares/user-middleware";
import UserController from "../controllers/user-controller";
import LoginMiddleware from "../middlewares/login-middleware";
import loginRouter from "./login-router";

const userRouter: Router = Router();

// userRouter.get('/user', UserController.getUsers);
userRouter.post('/users', UserMiddleware.validateRequestBodyUser, UserController.createNewUser);
userRouter.use(LoginMiddleware.authorization);
userRouter.delete('/users/:user_id', UserController.deleteUser);
userRouter.patch('/users/:user_id', UserMiddleware.validateRequestBodyUser, UserController.updateUser);

export default userRouter;