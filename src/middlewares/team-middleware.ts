import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import { validationFunction, ITeam, ILoginTokenPayload, IAPIResponse } from "../interfaces/interfaces";
import ValidationMiddleware from ".";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/token";
import TeamRepository from "../repositories/team-repository";
import { ForbiddenAccessError } from "../utils/err";
import createResponse from "../utils/response";

export default class TeamMiddleware {
    static async validadeRequestBodyToCreateTeam(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();
        const teamInfos:ITeam = req.body;

        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateName('team name', teamInfos.name),
            () => requestBodyValidator.validateUUID( teamInfos.leader, 'Leader' ),
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

    static async validateUserType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedUser = req.user as ILoginTokenPayload;
            if(loggedUser.isAdmin) {
               next(); 
               return;
            } 

            const team = await TeamRepository.getTeamByLeaderId(loggedUser.userID);
            if(!team) {
                throw new ForbiddenAccessError("Middleware layer", "This user don't have permission.");
            }

            // if (req.params.team_id && test) {
            //     const paramTeam = await TeamRepository.getTeamById(req.params.team_id);
            //     if (paramTeam.leader !== loggedUser.userID) { // getuserbyid para pegar o squad
            //         throw new ForbiddenAccessError("Middleware layer", "This user don't have permission.");
            //     }
            // }

            next();

        } catch (err: any) {
            const response: IAPIResponse<null> = createResponse(false, null, "Internal server error.");
            
            if(err instanceof ForbiddenAccessError) {
                response.error = err.message;
                res.status(err.code).json(response);
                return;
            } else {
                res.status(500).json(response);
            }
        }
    }
}