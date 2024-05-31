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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("../repositories/user-repository"));
const err_1 = require("../utils/err");
const hash_password_1 = require("../utils/hash-password");
class UserService {
    static createUser(userInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameUsed = yield user_repository_1.default.findUserByUsername(userInfos.username);
            if (usernameUsed) {
                throw new err_1.ConflictError('service', 'Username already used.');
            }
            const registeredEmail = yield user_repository_1.default.findUserByEmail(userInfos.email);
            if (registeredEmail) {
                throw new err_1.ConflictError('service', 'Inválid Email.');
            }
            const hashedPassword = yield (0, hash_password_1.createHashPassword)(userInfos.password);
            userInfos.password = hashedPassword;
            const user = yield user_repository_1.default.insertNewUser(userInfos);
            const _a = user, { password } = _a, userWithoutPass = __rest(_a, ["password"]);
            return userWithoutPass;
        });
    }
}
exports.default = UserService;
