import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import { validationFunction, ITeam, ILoginTokenPayload, IAPIResponse, uuid } from "../interfaces/interfaces";
import ValidationMiddleware from ".";
import TeamRepository from "../repositories/team-repository";
import { ForbiddenAccessError } from "../utils/err";
import createResponse from "../utils/response";
import UserRepository from "../repositories/user-repository";
import TeamService from "../services/team-service";
import UserService from "../services/user-service";

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

    static async validateIDTypeToAddNewMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();

        const teamID = req.params.team_id;
        const userID = req.params.user_id;

        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateUUID(teamID, 'Team'),
            () => requestBodyValidator.validateUUID(userID, 'User'),
        ];

        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }

    static async validateAccessWithTeamLeaderRestriction(req: Request, res: Response, next: NextFunction): Promise<void> {
        const loggedUser = req.user as ILoginTokenPayload;
        const teamID = req.params.team_id;
        
        if(loggedUser.isAdmin) {
            next(); 
            return;
        } 
        
        await TeamMiddleware.validateTeamLeader(req, res, next, loggedUser.userID, teamID, true);
    }

    static async validateAccessWithTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const loggedUser = req.user as ILoginTokenPayload;
        const teamID = req.params.team_id;
        
        if(loggedUser.isAdmin) {
            next(); 
            return;
        } 

        const isLeader = await UserService.isLeader(loggedUser.userID);

        if(isLeader) {
            next();
            return;
        }

        await TeamMiddleware.validateTeamMember(req, res, next, teamID);
    }

    static async validateTeamMember(
        req: Request,
        res: Response,
        next: NextFunction,
        teamID: uuid) {

            try {
                const userSquad = await UserRepository.findBySquad(teamID);
                console.log(userSquad);
                
                if(!userSquad) {
                    throw new ForbiddenAccessError('Middleware layer', 'Access denied: This resource is restricted to administrators, team leaders or members of this team only.');
                }

                next();
            } catch (err) {
                const response: IAPIResponse<null> = createResponse(false, null, "Internal server error.");
            
                if(err instanceof ForbiddenAccessError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                } else {
                    res.status(500).json(response);
                }
            }
    }

    static async validateAccessRestriction(req: Request, res: Response, next: NextFunction): Promise<void> {
        const loggedUser = req.user as ILoginTokenPayload;

        if(loggedUser.isAdmin) {
           next(); 
           return;
        } 
        
        await TeamMiddleware.validateTeamLeader(req, res, next, loggedUser.userID);
    }

    static async validateTeamLeader(
        req: Request,
        res: Response,
        next: NextFunction,
        loggedUserID: uuid, teamID?: uuid, restrictToOwnTeam?: boolean) {
            try {
                const isLeader = await TeamRepository.getTeamByLeaderId(loggedUserID);
                if(!isLeader) {
                    throw new ForbiddenAccessError('Middleware layer', 'Access denied: This resource is restricted to administrators and the team leaders only.');
                }

                if (restrictToOwnTeam && teamID) {
                    const teamInfos = await TeamRepository.findTeamByID(teamID);

                    if (loggedUserID !== teamInfos?.leader) {
                        throw new ForbiddenAccessError('Middleware layer', 'Access denied: This resource is restricted to administrators and the own team leader only.');
                    }
                }

                next();
            } catch (err) {
                const response: IAPIResponse<null> = createResponse(false, null, "Internal server error.");
            
                if(err instanceof ForbiddenAccessError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                } else {
                    res.status(500).json(response);
                }
            }
    }
}