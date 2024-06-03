import { Router } from "express";
// import UserController from "../controllers/user-controller";
import UserMiddleware from "../middlewares/user-middleware";
import UserController from "../controllers/user-controller";
import LoginMiddleware from "../middlewares/login-middleware";
import loginRouter from "./login-router";

const userRouter: Router = Router();

// userRouter.get('/user', UserController.getUsers);
userRouter.post('/user', UserMiddleware.validadeRequestBodyToCreateUser, UserController.createNewUser);
userRouter.use(LoginMiddleware.authorization);
userRouter.get("/users", UserController.getAllUsers);


export default userRouter;