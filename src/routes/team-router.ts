import { Router } from "express";
import TeamMiddleware from "../middlewares/team-middleware";
import TeamController from "../controllers/team-controller";
import LoginMiddleware from "../middlewares/login-middleware";
import UserMiddleware from "../middlewares/user-middleware";

const teamRouter: Router = Router();

teamRouter.get('/teams', TeamMiddleware.validateAccessRestriction, TeamController.getAllTeams);
teamRouter.post('/teams', UserMiddleware.validateAdminUser, TeamMiddleware.validadeRequestBodyToCreateTeam, TeamController.createTeam);
teamRouter.post('/teams/:team_id/member/:user_id', 
    TeamMiddleware.validateIDTypeToAddNewMembers,
    TeamMiddleware.validateAccessWithTeamLeaderRestriction,
    TeamController.addMember
);
teamRouter.delete('/teams/:team_id/member/:user_id', TeamController.deleteMember);
teamRouter.delete('/teams/:team_id', TeamController.deleteTeam);

export default teamRouter;