import { Request, Response } from "express";
import { ConflictError, InvalidDataError } from "../utils/err";
import { IAPIResponse, IUser } from "../interfaces/interfaces";
import UserService from "../services/user-service";
import createResponse from "../utils/response";
import { validate as uuidValidate } from "uuid";

export default class UserController {
	static async createNewUser(req: Request, res: Response): Promise<void> {
		try {
			const user = await UserService.createUser(req.body);
			const response: IAPIResponse<Partial<IUser>> = createResponse(
				true,
				user,
				null
			);
			res.status(201).json(response);
		} catch (err: any) {
			const response: IAPIResponse<null> = createResponse(
				false,
				null,
				"Internal server error."
			);

			if (err instanceof ConflictError) {
				response.error = err.message;
				res.status(err.code).json(response);
			} else {
				res.status(500).json(response);
			}
		}
	}

	static async getAllUsers(req: Request, res: Response): Promise<void> {
		try {
			const users = (await UserService.getAllUsers()) ?? [
				"No data available",
			];
			const response = createResponse(true, users, null);
			res.status(200).json(response);
		} catch (error) {
			const response = createResponse(
				false,
				null,
				"Internal server error"
			);
			res.status(500).json(response);
		}
	}

	static async getMyUser(req: Request, res: Response): Promise<void> {
		try {
			const userID = req.user?.userID;
			if (!userID) throw new Error("user do not have userID");

			const isUUID = uuidValidate(userID);
			if (!isUUID) throw new Error("uuid is not valid.");

			const myUser = await UserService.getMyUser(userID);
			const response = createResponse(true, myUser, null);
			res.status(200).json(response);
		} catch (error) {
			const reason =
				error instanceof Error
					? error.message
					: "Internal server error.";

			const response = createResponse(false, null, reason);
			res.status(500).json(response);
		}
	}

	static async getOneUser(req: Request, res: Response): Promise<void> {
		try {
			const userID = req.user?.userID;
			const targetUserID = req.params.userID;
			if (!userID || !targetUserID) {
				throw new InvalidDataError("controller", [
					"a parameter /id is needed in api url.",
					"example: api/v1/users/1234",
				]);
			}
			const isUUID = uuidValidate(userID) && uuidValidate(targetUserID);
			if (!isUUID) throw new Error("uuid is not valid.");

			const user = await UserService.getOneUser(userID, targetUserID);
			const response = createResponse(true, user, null);
			res.status(200).json(response);
		} catch (error) {
			if (error instanceof InvalidDataError) {
				const response = createResponse(false, null, "Invalid data.");
				response.messages = error.messages;

				res.status(error.code).json(response);
				return;
			}
			const reason =
				error instanceof Error
					? error.message
					: "Internal server error.";

			const response = createResponse(false, null, reason);
			res.status(500).json(response);
		}
	}
}
