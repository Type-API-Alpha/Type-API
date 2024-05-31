import { Router } from "express";
// import UserController from "../controllers/user-controller";
import UserMiddleware from "../middlewares/user-middleware";
import UserController from "../controllers/user-controller";

const userRouter: Router = Router();

// userRouter.get('/user', UserController.getUsers);
userRouter.post('/user', UserMiddleware.validadeRequestBodyToCreateUser, UserController.createNewUser);


// userRouter.use(LoginMiddleware.Auth)

//




export default userRouter;