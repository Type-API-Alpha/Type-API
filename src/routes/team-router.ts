import { Router } from "express";
// import TeamController from "../controllers/team-controller";
import TeamMiddleware from "../middlewares/team-middleware";
import TeamController from "../controllers/team-controller";
import LoginMiddleware from "../middlewares/login-middleware";

const teamRouter: Router = Router();
teamRouter.use(LoginMiddleware.authorization)
teamRouter.post('/teams' , TeamMiddleware.validadeRequestBodyToCreateTeam);
teamRouter.post('/teams/:team_id/member/:user_id', 
    TeamMiddleware.validateIDsTypeToAddNewMembers,
    TeamController.addMember
)
teamRouter.delete('/teams/:team_id/member/:user_id', TeamController.deleteMember )
teamRouter.delete('/teams/:team_id', TeamController.deleteTeam)

export default teamRouter;