import { Router } from "express";
// import LoginController from "../controllers/login-controller";
import LoginMiddleware from "../middlewares/login-middleware";

const loginRouter: Router = Router();

loginRouter.post('/login', LoginMiddleware.validateBodyToLogin);

export default loginRouter;