import { Request, Response } from "express";
import LoginService from "../services/login-service";
import { IAPIResponse, ICookieOptions, ILoginTokenPayload, IUser } from "../interfaces/interfaces";
import { createToken } from "../utils/token";
import createResponse from "../utils/response";
import { UnauthorizedError } from "../utils/err";

export default class LoginController {

    static async handleLoginRequest(req: Request, res: Response):Promise<void> {
        try {
            
            const authenticatedUser = await LoginService.authenticateUser(req.body);
            const sessionCookie:ICookieOptions = LoginService.createSessionCookie(authenticatedUser);
            const response:IAPIResponse<null> = createResponse(true, null, null);

            res.cookie(sessionCookie.name, sessionCookie.val, sessionCookie.options);
            res.status(200).json(response);
    
        } catch (err) {
            const response:IAPIResponse<null> = createResponse(false, null, 'Internal server error.');
       
            if (err instanceof UnauthorizedError) {
                response.error = err.errorMessage;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }
        }
    }
}