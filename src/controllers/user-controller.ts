import { Request, Response } from "express";
import { ConflictError, ForbiddenAccessError, NotFoundError } from "../utils/err";
import { ConflictError, ForbiddenAccessError, NotFoundError } from "../utils/err";
import { IAPIResponse, IUser } from "../interfaces/interfaces";
import UserService from "../services/user-service";
import createResponse from "../utils/response";

export default class UserController {

    static async createNewUser(req: Request, res: Response):Promise<void> {
        try {
            const user = await UserService.createUser(req.body);
            const response: IAPIResponse<Partial<IUser>> = createResponse(true, user, null);
            console.log(response);
            res.status(201).json(response);
        } catch (err: any) {
            const response:IAPIResponse<null> = createResponse(false, null, 'Internal server error.');
            console.log(err);

            if (err instanceof ConflictError) {
                response.error = err.message;
                res.status(err.code).json(response);
            } else {
                res.status(500).json(response);
            }
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const {user_id: userToErase} = req.params
            const admin = req.user?.isAdmin
            if(!admin){
                throw new ForbiddenAccessError('Controller Layer', 'Forbidden Access!');
            }
           const erased = await UserService.deleteUser(userToErase);    
           const response= createResponse<Partial<IUser>>(true, erased, null);     
           res.status(200).json(response)
        } catch (err: any) {
            const response: IAPIResponse<null> = createResponse(false, null, 'Internal server error.');

            if (err instanceof ForbiddenAccessError || err instanceof NotFoundError) {
                response.error = err.message;
                res.status(err.code).json(response);
            }
            else {
                res.status(500).json(response);
            }
        }
    }
}