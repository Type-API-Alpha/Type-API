import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import { validationFunction, IUser } from "../interfaces/interfaces";
import ValidationMiddleware from ".";

export default class UserMiddleware {

    static async validadeRequestBodyToCreateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();
        const userInfos:IUser = req.body;

        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateName('username', userInfos.username),
            () => requestBodyValidator.validateName('firstName', userInfos.firstName),
            () => requestBodyValidator.validateName('lastName', userInfos.lastName),
            () => requestBodyValidator.validateUserEmail(userInfos.email),
            () => requestBodyValidator.validateUserPassword(userInfos.password),
            () => requestBodyValidator.validateUUID( userInfos.squad),
            () => requestBodyValidator.validateAdminType(userInfos.isAdmin)
        ];
        
        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }
}