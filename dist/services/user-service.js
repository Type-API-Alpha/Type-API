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
const team_repository_1 = __importDefault(require("../repositories/team-repository"));
const user_repository_1 = __importDefault(require("../repositories/user-repository"));
const err_1 = require("../utils/err");
const hash_password_1 = require("../utils/hash-password");
class UserService {
    static createUser(userInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameUsed = yield user_repository_1.default.findUserByUsername(userInfos.username);
            if (usernameUsed) {
                throw new err_1.ConflictError("Service layer", "Username already used.");
            }
            const registeredEmail = yield user_repository_1.default.findUserByEmail(userInfos.email);
            if (registeredEmail) {
                throw new err_1.ConflictError("Service layer", "Invalid Email.");
            }
            const hashedPassword = yield (0, hash_password_1.createHashPassword)(userInfos.password);
            const userData = {
                username: userInfos.username,
                email: userInfos.email,
                firstName: userInfos.firstName,
                lastName: userInfos.lastName,
                password: hashedPassword,
            };
            const user = yield user_repository_1.default.insertNewUser(userData);
            const _a = user, { password } = _a, userWithoutPass = __rest(_a, ["password"]);
            return userWithoutPass;
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // isAdmin validation is in controller
            const users = yield user_repository_1.default.getAllUsers();
            return users;
        });
    }
    static getMyUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.default.findUserByID(userID);
            return user;
        });
    }
    static getOneUser(userID, targetUserID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.default.findUserByID(userID);
            if (!user)
                throw new err_1.NotFoundError("service", "o usuário que buscou a informação não está com dados corretos.");
            if (!user.isAdmin) {
                if (userID !== targetUserID) {
                    if (user.squad) {
                        const userTeam = yield team_repository_1.default.getTeamById(user.squad);
                        const userIsLeader = userTeam.leader === userID;
                        const foundUser = yield user_repository_1.default.findUserByID(targetUserID);
                        const bothFromSameTeam = user.squad === (foundUser === null || foundUser === void 0 ? void 0 : foundUser.squad);
                        if (bothFromSameTeam)
                            return foundUser;
                        // RETURN
                        const foundUserTeam = yield team_repository_1.default.getTeamByLeaderId(targetUserID);
                        if (!foundUserTeam)
                            throw new err_1.ForbiddenAccessError("service", "access denied.");
                        const foundUserIsLeader = foundUserTeam.leader === targetUserID;
                        const leaderReadingLeader = userIsLeader && foundUserIsLeader;
                        if (leaderReadingLeader) {
                            return foundUser;
                        }
                        else {
                            throw new err_1.ForbiddenAccessError("service", "access denied.");
                        }
                    }
                    else {
                        throw new err_1.ForbiddenAccessError("service", "access denied.");
                    }
                }
            }
            const foundUser = yield user_repository_1.default.findUserByID(targetUserID);
            return foundUser;
        });
    }
    static deleteUser(userToErase) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield user_repository_1.default.findUserByID(userToErase);
            if (!checkUser) {
                throw new err_1.NotFoundError("Service Layer", "User");
            }
            const erasedUser = yield user_repository_1.default.deleteUser(userToErase);
            const { password } = erasedUser, entityerased = __rest(erasedUser, ["password"]);
            return entityerased;
        });
    }
    static updateUserInfos(loggedUser, paramsUserID, newUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToUpdate = yield this.findUserByID(paramsUserID);
            this.checkUserPermissions(loggedUser, userToUpdate, newUserData);
            yield this.validateNewUserData(newUserData);
            if (newUserData.password) {
                newUserData.password = yield (0, hash_password_1.createHashPassword)(newUserData.password);
            }
            const _a = yield user_repository_1.default.updateUser(newUserData, paramsUserID), { password } = _a, updatedUser = __rest(_a, ["password"]);
            return updatedUser;
        });
    }
    static findUserByID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.default.findUserByID(userID);
            if (!user) {
                throw new err_1.NotFoundError("Service layer", "User");
            }
            return user;
        });
    }
    static checkUserPermissions(loggedUser, userToUpdate, newUserData) {
        if (loggedUser.userID !== userToUpdate.id && !loggedUser.isAdmin) {
            throw new err_1.ForbiddenAccessError("Service layer", "Access denied: This resource is restricted to administrators or the own user.");
        }
        if (newUserData.isAdmin) {
            if (!loggedUser.isAdmin) {
                throw new err_1.ForbiddenAccessError("Service layer", "Access denied: This resource is restricted to administrators only.");
            }
            if (userToUpdate.squad) {
                throw new err_1.ConflictError("Service layer", "Failed to promote user to admin: Administrators cannot be assigned to any team.");
            }
        }
    }
    static validateNewUserData(newUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newUserData.username) {
                const usernameUsed = yield user_repository_1.default.findUserByUsername(newUserData.username);
                if (usernameUsed) {
                    throw new err_1.ConflictError("Service layer", "Username already used.");
                }
            }
            if (newUserData.email) {
                const registeredEmail = yield user_repository_1.default.findUserByEmail(newUserData.email);
                if (registeredEmail) {
                    throw new err_1.ConflictError("Service layer", "Invalid Email.");
                }
            }
        });
    }
}
exports.default = UserService;
//   static async isLeader(userId: string): Promise<boolean> {
//       let isLeader = false;
//       const userInfos = await UserRepository.findUserByID(userId)
//       if(userInfos) {
//           const userSquad = userInfos.squad; 
//           const teamLeader = await TeamService.checkLeader(userSquad);
//           if(teamLeader.leader === userId) {
//               return isLeader = true;
//           }
//       }
//       return isLeader;
//     }
// }
