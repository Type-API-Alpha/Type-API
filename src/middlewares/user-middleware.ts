import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import { validationFunction, IUser, ILoginTokenPayload } from "../interfaces/interfaces";
import ValidationMiddleware from ".";
import { ForbiddenAccessError } from "../utils/err";
import createResponse from "../utils/response";

export default class UserMiddleware {

    static async validadeRequestBodyToCreateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();
        const userInfos:IUser = req.body;

        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateName('username', userInfos.username),
            () => requestBodyValidator.validateName('firstName', userInfos.firstName),
            () => requestBodyValidator.validateName('lastName', userInfos.lastName),
            () => requestBodyValidator.validateUserEmail(userInfos.email),
            () => requestBodyValidator.validateUserPassword(userInfos.password)
        ];
        
        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }

    static async validateAdminUser (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedUser = req.user as ILoginTokenPayload;
            const isAdmin = loggedUser.isAdmin === true;
            
            if (!isAdmin) {
                throw new ForbiddenAccessError('Middlware layer');
            }

            next();
        } catch (err) {
            const response = createResponse<null>(false, null, 'Internal server error.');

            if (err instanceof ForbiddenAccessError) {
                response.error = err.message;
                res.status(err.code).json(response);
                return;
            } else {
                res.status(500).json(response);
            }
        }
    }
}