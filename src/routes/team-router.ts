import { Router } from "express";
// import TeamController from "../controllers/team-controller";
import TeamMiddleware from "../middlewares/team-middleware";

const teamRouter: Router = Router();

teamRouter.post('/team', TeamMiddleware.validadeRequestBodyToCreateTeam)

export default teamRouter;