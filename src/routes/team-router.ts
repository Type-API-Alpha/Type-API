import { Router } from "express";
import TeamMiddleware from "../middlewares/team-middleware";
import TeamController from "../controllers/team-controller";

const teamRouter: Router = Router();

teamRouter.get('/teams', TeamMiddleware.validateUserType, TeamController.getAllTeams);
teamRouter.post('/team', TeamMiddleware.validadeRequestBodyToCreateTeam);
teamRouter.post('/teams/:team_id/member/:user_id', 
    TeamMiddleware.validateIDsTypeToAddNewMembers,
    TeamController.addMember
)

export default teamRouter;