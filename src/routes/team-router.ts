import { Router } from "express";
// import TeamController from "../controllers/team-controller";
import TeamMiddleware from "../middlewares/team-middleware";
import TeamController from "../controllers/team-controller";

const teamRouter: Router = Router();

teamRouter.post('/teams' , TeamMiddleware.validadeRequestBodyToCreateTeam);
teamRouter.post('/teams/:team_id/member/:user_id', 
    TeamMiddleware.validateIDsTypeToAddNewMembers,
    TeamController.addMember
)

export default teamRouter;