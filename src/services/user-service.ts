import { IUser, uuid } from "../interfaces/interfaces";
import UserRepository from "../repositories/user-repository";
import { ConflictError, NotFoundError } from "../utils/err";
import { createHashPassword } from "../utils/hash-password";

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
		// isAdmin validation?
		const users = await UserRepository.getAllUsers();
		return users;
	}

	static async getMyUser(userID: uuid): Promise<Partial<IUser>> {
		// validations
		const user = await UserRepository.getUserByID(userID);
		return user;
	}

	static async getOneUser(userID: uuid, targetUserID:uuid): Promise<Partial<IUser>> {
		// validations
		const user = await UserRepository.getUserByID(userID);
		return user;
	}

    static async deleteUser(userToErase:uuid):Promise<Partial<IUser>>{
        const checkUser:IUser | null = await UserRepository.findUserByID(userToErase);
        
        if(!checkUser){
            throw new NotFoundError('Service Layer', 'User');
        }
        const erasedUser:IUser = await UserRepository.deleteUser(userToErase)  
        const {password, ... entityerased} = erasedUser;
        return entityerased;
    }
}
