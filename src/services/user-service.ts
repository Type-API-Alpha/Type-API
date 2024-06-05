import {
	ILoginTokenPayload,
	ITeam,
	IUser,
	uuid,
} from "../interfaces/interfaces";
import TeamRepository from "../repositories/team-repository";
import UserRepository from "../repositories/user-repository";
import {
	ConflictError,
	ForbiddenAccessError,
	NotFoundError,
} from "../utils/err";
import { createHashPassword } from "../utils/hash-password";
import TeamService from "./team-service";

export default class UserService {

	static async createUser(
		userInfos: Partial<IUser>
	): Promise<Partial<IUser>> {
		const usernameUsed = await UserRepository.findUserByUsername(
			userInfos.username as string
		);
		if (usernameUsed) {
			throw new ConflictError("Service layer", "Username already used.");
		}

		const registeredEmail = await UserRepository.findUserByEmail(
			userInfos.email as string
		);
		if (registeredEmail) {
			throw new ConflictError("Service layer", "Invalid Email.");
		}

		const hashedPassword = await createHashPassword(
			userInfos.password as string
		);

		const userData: Partial<IUser> = {
			username: userInfos.username,
			email: userInfos.email,
			firstName: userInfos.firstName,
			lastName: userInfos.lastName,
			password: hashedPassword,
		};

		const user = await UserRepository.insertNewUser(userData);

		const { password, ...userWithoutPass } = user as IUser;

		return userWithoutPass;
	}
  
	static async getAllUsers(): Promise<Partial<IUser[]>> {
		// isAdmin validation is in controller
		const users = await UserRepository.getAllUsers();
		return users;
	}

	static async getMyUser(userID: uuid): Promise<Partial<IUser | null>> {
		const user = await UserRepository.findUserByID(userID);
		return user;
	}

	static async getOneUser(
		userID: uuid,
		targetUserID: uuid
	): Promise<Partial<IUser | null>> {
		const user = await UserRepository.findUserByID(userID);
		if (!user)
			throw new NotFoundError(
				"service",
				"o usuário que buscou a informação não está com dados corretos."
			);
		if (!user.isAdmin) {
			if (userID !== targetUserID) {
				if (user.squad) {
					const userTeam = await TeamRepository.getTeamById(
						user.squad
					);
					const userIsLeader = userTeam.leader === userID;

					const foundUser = await UserRepository.findUserByID(
						targetUserID
					);
					const bothFromSameTeam = user.squad === foundUser?.squad;
					if (bothFromSameTeam) return foundUser;
					// RETURN

					const foundUserTeam: ITeam | null =
						await TeamRepository.getTeamByLeaderId(targetUserID);
					if (!foundUserTeam)
						throw new ForbiddenAccessError(
							"service",
							"access denied."
						);
					const foundUserIsLeader =
						foundUserTeam.leader === targetUserID;

					const leaderReadingLeader =
						userIsLeader && foundUserIsLeader;

					if (leaderReadingLeader) {
						return foundUser;
					} else {
						throw new ForbiddenAccessError(
							"service",
							"access denied."
						);
					}
				} else {
					throw new ForbiddenAccessError("service", "access denied.");
				}
			}
		}
		const foundUser = await UserRepository.findUserByID(targetUserID);
		return foundUser;
	}

	static async deleteUser(userToErase: uuid): Promise<Partial<IUser>> {
		const checkUser: IUser | null = await UserRepository.findUserByID(
			userToErase
		);

		if (!checkUser) {
			throw new NotFoundError("Service Layer", "User");
		}
		const erasedUser: IUser = await UserRepository.deleteUser(userToErase);
		const { password, ...entityerased } = erasedUser;
		return entityerased;
	}

	static async updateUserInfos(
		loggedUser: ILoginTokenPayload,
		paramsUserID: string,
		newUserData: Partial<IUser>
	) {
		const userToUpdate = await this.findUserByID(paramsUserID);

		this.checkUserPermissions(loggedUser, userToUpdate, newUserData);

		await this.validateNewUserData(newUserData);

		if (newUserData.password) {
			newUserData.password = await createHashPassword(
				newUserData.password
			);
		}

		const { password, ...updatedUser } = await UserRepository.updateUser(
			newUserData,
			paramsUserID
		);
		return updatedUser;
	}

	private static async findUserByID(userID: string): Promise<IUser> {
		const user = await UserRepository.findUserByID(userID);
		if (!user) {
			throw new NotFoundError("Service layer", "User");
		}
		return user;
	}

	private static checkUserPermissions(
		loggedUser: ILoginTokenPayload,
		userToUpdate: IUser,
		newUserData: Partial<IUser>
	): void {
		if (loggedUser.userID !== userToUpdate.id && !loggedUser.isAdmin) {
			throw new ForbiddenAccessError(
				"Service layer",
				"Access denied: This resource is restricted to administrators or the own user."
			);
		}

		if (newUserData.isAdmin) {
			if (!loggedUser.isAdmin) {
				throw new ForbiddenAccessError(
					"Service layer",
					"Access denied: This resource is restricted to administrators only."
				);
			}

			if (userToUpdate.squad) {
				throw new ConflictError(
					"Service layer",
					"Failed to promote user to admin: Administrators cannot be assigned to any team."
				);
			}
		}
	}

	private static async validateNewUserData(
		newUserData: Partial<IUser>
	): Promise<void> {
		if (newUserData.username) {
			const usernameUsed = await UserRepository.findUserByUsername(
				newUserData.username
			);
			if (usernameUsed) {
				throw new ConflictError(
					"Service layer",
					"Username already used."
				);
			}
		}

		if (newUserData.email) {
			const registeredEmail = await UserRepository.findUserByEmail(
				newUserData.email
			);
			if (registeredEmail) {
				throw new ConflictError("Service layer", "Invalid Email.");
			}
		}
	}
}
