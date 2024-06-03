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
            () => requestBodyValidator.validateUUID( teamInfos.leader),
        ];
        
        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }
}