import { Router } from "express";
import LoginMiddleware from "../middlewares/login-middleware";
import LoginController from "../controllers/login-controller";

const loginRouter: Router = Router();

loginRouter.post('/login', LoginMiddleware.validateBodyToLogin, LoginController.handleLoginRequest);
loginRouter.use(LoginMiddleware.authorization);
loginRouter.delete('/logout', LoginController.logout);
export default loginRouter;