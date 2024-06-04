import { Router } from "express";
import TeamMiddleware from "../middlewares/team-middleware";
import TeamController from "../controllers/team-controller";

const teamRouter: Router = Router();

teamRouter.get('/teams', TeamMiddleware.validateAccessRestriction, TeamController.getAllTeams);
teamRouter.post('/teams', TeamMiddleware.validadeRequestBodyToCreateTeam);
teamRouter.post('/teams/:team_id/member/:user_id', 
    TeamMiddleware.validateIDTypeToAddNewMembers,
    TeamMiddleware.validateAccessWithTeamLeaderRestriction,
    TeamController.addMember
)

export default teamRouter;