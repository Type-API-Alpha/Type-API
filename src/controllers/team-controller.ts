import { Request, Response } from "express";
import { ITeam, IAPIResponse } from "../interfaces/interfaces";
import TeamService from "../services/team-service";
import createResponse from "../utils/response";

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
}