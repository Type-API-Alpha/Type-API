import { Request, Response } from "express";
import { ITeam, IAPIResponse, ILoginTokenPayload, uuid } from "../interfaces/interfaces";
import TeamService from "../services/team-service";
import createResponse from "../utils/response";
import { IUser } from "../interfaces/interfaces";
import { ConflictError, ForbiddenAccessError, NotFoundError } from "../utils/err";
import UserService from "../services/user-service";

export default class TeamController {

    static async getAllTeams(req: Request, res: Response): Promise<void> {
        try {
          const teams = await TeamService.getAllTeams();
          const response: IAPIResponse<ITeam[] | []> = createResponse(true, teams, null);
          res.status(200).json(response);

        } catch (err: any) {
          const response: IAPIResponse<null> = createResponse(false, null, 'Internal server error.');
          res.status(500).json(response);
        }
    }

    static async getTeamById(req: Request, res: Response): Promise<void> {
        try {
            const teamId = req.params.team_id;
            const team = await TeamService.getTeamById(teamId);
            const response: IAPIResponse<ITeam> = createResponse(true, team, null);
            res.status(201).json(response);
        } catch (err: any) {
            const response: IAPIResponse<null> = createResponse(false, null, 'Internal server error');
            console.error(err);

            if(err instanceof ConflictError || err instanceof NotFoundError){
            response.error = err.message;
            res.status(err.code).json(response);
            }else{
            res.status(500).json(response);
            }
        }
    }

    static async getMembersByTeamId(req: Request, res: Response): Promise<void> {
        try {
            const teamId = req.params.team_id;
            const members = await TeamService.getMembersByTeamId(teamId);
            const response: IAPIResponse<IUser[]> = createResponse(true, members, null);
            res.status(201).json(response);

        } catch (err: any) {

            const response: IAPIResponse<null> = createResponse(false, null, 'Internal server error');
            if(err instanceof ConflictError || err instanceof NotFoundError){
            response.error = err.message;
            res.status(err.code).json(response);

            } else {
            res.status(500).json(response);
            }
        }
    }

    static async createTeam(req: Request, res: Response): Promise<void>{
      try {
        const team = await TeamService.createTeam(req.body);

        const response: IAPIResponse<Partial<ITeam>> = createResponse(true, team, null);
        res.status(201).json(response);
      } catch (err: any) {
        const response: IAPIResponse<null> = createResponse(false, null, 'Internal server error');
        console.error(err);

        if(err instanceof ConflictError || err instanceof NotFoundError){
          response.error = err.message;
          res.status(err.code).json(response);
        }else{
          res.status(500).json(response);
        }
      }
    }

    static async addMember(req: Request, res: Response):Promise<void> {
        try {
            const { team_id: teamID, user_id: userID } = req.params;

            const newMember = await TeamService.addNewMember(teamID, userID);

            const response = createResponse<Partial<IUser>>(true, newMember, null);
            res.status(201).json(response);
            
        } catch (err) {
            const response = createResponse<null>(false, null, 'Internal server error');

            if (err instanceof NotFoundError || err instanceof ConflictError) {
                response.error = err.message;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }
        }
    }
    static async deleteMember(req: Request, res:Response):Promise<void> {
        try{
            const {team_id: teamID, user_id: userID} = req.params;
            const checkleader = await TeamService.checkLeader(teamID)
            const admin = req.user?.isAdmin
            if(!admin && checkleader.leader !== req.user?.userID){
                throw new ForbiddenAccessError('Controller Layer', 'Forbidden Access! Restrict to Administrators and Team Leaders!');
            }
            const erasedMember =  await TeamService.deleteMember(teamID, userID);
            const response = createResponse<Partial<IUser>>(true, erasedMember, null);
            res.status(201).json(response);
        }
        catch(err) {
            const response = createResponse<null>(false, null, 'Internal server error');
            if(err instanceof NotFoundError || err instanceof ConflictError || err instanceof ForbiddenAccessError){
                response.error = err.message;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }
        }
    }
    static async deleteTeam(req: Request, res: Response): Promise<void>{
        try{
            const admin = req.user?.isAdmin
            if(!admin){
                throw new ForbiddenAccessError('Controller Layer', 'Forbidden Access!');
            }
            const {team_id: teamID} = req.params;
            const erasedTeam = await TeamService.deleteTeam(teamID);
            const response = createResponse<Partial<IUser>>(true, erasedTeam, null);
            res.status(200).json(response)
        }
        catch(err) {
            const response = createResponse<null>(false, null, 'Internal server error');
            if(err instanceof NotFoundError || err instanceof ConflictError || err instanceof ForbiddenAccessError){
                response.error = err.message;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }
        }
    }
    static async updateTeam(req: Request, res: Response): Promise<void>{
        try {
            const loggedUser = req.user as ILoginTokenPayload;
            const teamIDToUpdate:uuid = req.params.team_id;
            const newTeamInfos = req.body;

            const updatedTeam = await TeamService.updateTeam(loggedUser, newTeamInfos, teamIDToUpdate);
            const response = createResponse<Partial<IUser>>(true, updatedTeam, null);
            res.status(200).json(response);
        } catch (err: any) {
            const response = createResponse<null>(false, null, 'Internal server error.');
            
            if (err instanceof ConflictError || err instanceof ForbiddenAccessError || err instanceof NotFoundError) {
                response.error = err.message;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }
        }
    }
}