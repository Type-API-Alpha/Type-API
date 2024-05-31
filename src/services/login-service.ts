import { ICookieOptions, ILoginTokenPayload, IUser, email } from "../interfaces/interfaces";
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

    static createSessionCookie(authenticatedUser: IUser): ICookieOptions {

        const payload:ILoginTokenPayload = {
            userID: authenticatedUser.id,
            isAdmin: authenticatedUser.isAdmin
        }
        const tokenOption = { expiresIn: '8h'};
        const sessionToken = createToken(payload, tokenOption);

        const cookieOptions:ICookieOptions = {
            name: 'session_cookie',
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