import { ICookieOptions, ILoginTokenPayload, IUser, IUserDatabase, email, uuid } from "../interfaces/interfaces";
import UserRepository from "../repositories/user-repository";
import { UnauthorizedError } from "../utils/err";
import { comparePassword } from "../utils/hash-password";
import { createToken } from "../utils/token";

export default class LoginService {

    static async authenticateUser(userInfos: Partial<IUser>):Promise<IUser>  {

        const registeredUser:IUser | null = await UserRepository.findUserByEmail(userInfos.email as email);

        if (!registeredUser) {
            throw new UnauthorizedError('Service layer');
        }

        const validPassword = await comparePassword(userInfos.password as string, registeredUser.password);

        if (!validPassword) {
            throw new UnauthorizedError('Service layer');
        }

        return registeredUser;
    }

    static createSessionCookie(authenticatedUser: Partial<IUserDatabase>): ICookieOptions {

        const payload:ILoginTokenPayload = {
            userID: authenticatedUser.id as string,
            isAdmin: authenticatedUser.is_admin as boolean,
            squad: authenticatedUser.squad as uuid
        }   
        
        const tokenOption = { expiresIn: '8h'};
        const sessionToken = createToken(payload, tokenOption);

        const cookieOptions:ICookieOptions = {
            name: 'session_token',
            val: sessionToken,
            options: {
                maxAge: 8 * 60 * 60 * 1000, 
                httpOnly: true,
                sameSite: 'strict',
                secure: true
            }
        };

        return cookieOptions;
    }
}