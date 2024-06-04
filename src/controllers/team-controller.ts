import { Request, Response } from "express";
import { ITeam, IAPIResponse, uuid } from "../interfaces/interfaces";
import TeamService from "../services/team-service";
import createResponse from "../utils/response";
import { IUser } from "../interfaces/interfaces";
import { ConflictError, ForbiddenAccessError, NotFoundError } from "../utils/err";

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
}