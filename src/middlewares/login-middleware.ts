import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import { validationFunction, IUser } from "../interfaces/interfaces";
import ValidationMiddleware from ".";

export default class LoginMiddleware {

    static async validateBodyToLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const requestBodyValidator = new RequestBodyValidator();
        
        const validationFunctions: Array<validationFunction> = [
            () => requestBodyValidator.validateUserEmail(req.body.email),
            () => requestBodyValidator.validateUserPassword(req.body.password)
        ];

        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }
}