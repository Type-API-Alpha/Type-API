import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import { validationFunction, ITeam } from "../interfaces/interfaces";
import ValidationMiddleware from ".";

export default class TeamMiddleware {

    static async validadeRequestBodyToCreateTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();
        const teamInfos:ITeam = req.body;

        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateName('team name', teamInfos.name),
            () => requestBodyValidator.validateUUID(teamInfos.leader, 'Leader'),
        ];
        
        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }

    static async validateIDsTypeToAddNewMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();

        const teamID = req.params.team_id;
        const userID = req.params.user_id;

        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateUUID(teamID, 'Team'),
            () => requestBodyValidator.validateUUID(userID, 'User'),
        ];

        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }
}