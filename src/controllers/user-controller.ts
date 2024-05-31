import { Request, Response } from "express";
import { ConflictError } from "../utils/err";
import { IAPIResponse, IUser } from "../interfaces/interfaces";
import UserService from "../services/user-service";
import createResponse from "../utils/response";

export default class UserController {

    static async createNewUser(req: Request, res: Response):Promise<void> {
        try {
            const user = await UserService.createUser(req.body);
            const response: IAPIResponse<Partial<IUser>> = createResponse(true, user, null);
            res.status(201).json(response);
        } catch (err: any) {
            const response:IAPIResponse<null> = createResponse(false, null, 'Internal server error.');

            if (err instanceof ConflictError) {
                response.error = err.message;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }  
        }
    }
}