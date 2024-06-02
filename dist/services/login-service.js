"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user-repository"));
const err_1 = require("../utils/err");
const hash_password_1 = require("../utils/hash-password");
const token_1 = require("../utils/token");
class LoginService {
    static authenticateUser(userInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredUser = yield user_repository_1.default.findUserByEmail(userInfos.email);
            if (!registeredUser) {
                throw new err_1.UnauthorizedError('Service layer');
            }
            const validPassword = yield (0, hash_password_1.comparePassword)(userInfos.password, registeredUser.password);
            if (!validPassword) {
                throw new err_1.UnauthorizedError('Service layer');
            }
            return registeredUser;
        });
    }
    static createSessionCookie(authenticatedUser) {
        const payload = {
            userID: authenticatedUser.id,
            isAdmin: authenticatedUser.is_admin
        };
        const tokenOption = { expiresIn: '8h' };
        const sessionToken = (0, token_1.createToken)(payload, tokenOption);
        const cookieOptions = {
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
exports.default = LoginService;
