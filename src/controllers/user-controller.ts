import { Request, Response } from "express";
import {
	ConflictError,
	InvalidDataError,
	ForbiddenAccessError,
	NotFoundError,
} from "../utils/err";
import {
	IAPIResponse,
	ILoginTokenPayload,
	IUser,
	uuid,
} from "../interfaces/interfaces";
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
			const user = req.user as ILoginTokenPayload;
			if (!user.isAdmin)
				throw new ForbiddenAccessError(
					"controller",
					"access denied. this info is admin only."
				);
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
			if (error instanceof ForbiddenAccessError) {
				response.error = error.message;
				res.status(error.code).json(response);
			} else {
				res.status(500).json(response);
			}
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
			const user = req.user as ILoginTokenPayload;
			const targetUserID = req.params.userID;
			if (!user.userID || !targetUserID) {
				throw new InvalidDataError("controller", [
					"a parameter /id is needed in api url.",
					"example: api/v1/users/1234",
				]);
			}
			const isUUID =
				uuidValidate(user.userID) && uuidValidate(targetUserID);
			if (!isUUID) throw new Error("uuid is not valid.");

			const foundUser = await UserService.getOneUser(
				user.userID,
				targetUserID
			);
			const response = createResponse(true, foundUser, null);
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

	static async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const { user_id: userToErase } = req.params;
			const admin = req.user?.isAdmin;
			if (!admin) {
				throw new ForbiddenAccessError(
					"Controller Layer",
					"Forbidden Access!"
				);
			}
			const erased = await UserService.deleteUser(userToErase);
			const response = createResponse<Partial<IUser>>(true, erased, null);
			res.status(200).json(response);
		} catch (err: any) {
			const response: IAPIResponse<null> = createResponse(
				false,
				null,
				"Internal server error."
			);

			if (
				err instanceof ForbiddenAccessError ||
				err instanceof NotFoundError
			) {
				response.error = err.message;
				res.status(err.code).json(response);
			} else {
				res.status(500).json(response);
			}
		}
	}

	static async updateUser(req: Request, res: Response): Promise<void> {
		try {
			const loggedUser = req.user as ILoginTokenPayload;
			const userIDToUpdate: uuid = req.params.user_id;
			const newUserInfos = req.body;

			const updatedUser = await UserService.updateUserInfos(
				loggedUser,
				userIDToUpdate,
				newUserInfos
			);
			const response = createResponse<Partial<IUser>>(
				true,
				updatedUser,
				null
			);
			res.status(200).json(response);
		} catch (err) {
			const response = createResponse<null>(
				false,
				null,
				"Internal server error."
			);

			if (
				err instanceof ConflictError ||
				err instanceof ForbiddenAccessError ||
				err instanceof NotFoundError
			) {
				response.error = err.message;
				res.status(err.code).json(response);
			} else {
				res.status(500).json(response);
			}
		}
	}
}
