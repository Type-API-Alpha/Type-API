import { Router } from "express";
import loginRouter from "./login-router";
import userRouter from "./user-router";
import teamRouter from "./team-router";

const appRouter: Router = Router();
appRouter.use('/api/v1', loginRouter);
appRouter.use('/api/v1', userRouter);
appRouter.use('/api/v1', teamRouter);

export default appRouter;