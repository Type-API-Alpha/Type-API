import { IUser } from "../interfaces/interfaces";
import UserRepository from "../repositories/user-repository";
import { ConflictError } from "../utils/err";
import { createHashPassword } from "../utils/hash-password";

export default class UserService {
    
    static async createUser(userInfos:Partial<IUser>):Promise<Partial<IUser>> {

        const usernameUsed = await UserRepository.findUserByUsername(userInfos.username as string);
        if (usernameUsed) {
            throw new ConflictError('Service layer', 'Username already used.');
        }

        const registeredEmail = await UserRepository.findUserByEmail(userInfos.email as string);
        if (registeredEmail) {
            throw new ConflictError('Service layer', 'Invalid Email.');
        }

        const hashedPassword = await createHashPassword(userInfos.password as string);

        const userData:Partial<IUser> = {
            username: userInfos.username,
            email: userInfos.email,
            firstName: userInfos.firstName,
            lastName: userInfos.lastName,
            password: hashedPassword
        }

        const user = await UserRepository.insertNewUser(userData);

        const { password, ... userWithoutPass } = user as IUser;

        return userWithoutPass;
    }

	static async getAllUsers(): Promise<Partial<IUser[]>> {
		const users = await UserRepository.getAllUsers();
		return users;
	}
}