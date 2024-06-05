import { NextFunction, Request, Response } from "express";
import { RequestBodyValidator } from "../utils/validations";
import {
	validationFunction,
	IUser,
	ILoginTokenPayload,
} from "../interfaces/interfaces";
import ValidationMiddleware from ".";
import { ForbiddenAccessError } from "../utils/err";
import createResponse from "../utils/response";

export default class UserMiddleware {

    static async validateRequestBodyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userInfos:IUser = req.body;
        const validator = new RequestBodyValidator();
        const validationFunctions: Array<validationFunction> = [];

        const usernameValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.username;
        const firstNameValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.firstName;
        const lastNameValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.lastName;
        const emailValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.email;
        const passwordValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.password;
        const adminDataTypeValidation = req.method === 'PATCH' && userInfos.isAdmin;

        usernameValidation ? validationFunctions.push(() => validator.validateName('username', userInfos.username)) : null;
        firstNameValidation ? validationFunctions.push(() => validator.validateName('firstName', userInfos.firstName)) : null;
        lastNameValidation ? validationFunctions.push(() => validator.validateName('lastName', userInfos.lastName)) : null;
        emailValidation ? validationFunctions.push(() => validator.validateUserEmail(userInfos.email)) : null;
        passwordValidation ? validationFunctions.push(() => validator.validateUserPassword(userInfos.password)) : null;
        adminDataTypeValidation ? validationFunctions.push(() => validator.validateAdminType(userInfos.isAdmin)) : null;

        await ValidationMiddleware.validateRequest(req, res, next, validationFunctions);
    }

	static async validateAdminUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const loggedUser = req.user as ILoginTokenPayload;
			const isAdmin = loggedUser.isAdmin === true;

			if (!isAdmin) {
				throw new ForbiddenAccessError(
					"Middleware layer",
					"Access denied: This resource is restricted to administrators only."
				);
			}

			next();
		} catch (err) {
			const response = createResponse<null>(
				false,
				null,
				"Internal server error."
			);

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
