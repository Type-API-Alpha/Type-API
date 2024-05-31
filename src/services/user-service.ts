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
            throw new ConflictError('Service layer', 'Inválid Email.');
        }

        const hashedPassword = await createHashPassword(userInfos.password as string);
        userInfos.password = hashedPassword;

        const user = await UserRepository.insertNewUser(userInfos);

        const { password, ... userWithoutPass } = user as IUser;

        return userWithoutPass;
    }
}