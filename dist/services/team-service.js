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
class TeamService {
    static addNewMember(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredUser = yield user_repository_1.default.findUserByID(userID);
            if (!registeredUser) {
                throw new err_1.NotFoundError('Service layer', 'User');
            }
            const registeredTeam = yield team_repository_1.default.findTeamByID(teamID);
            if (!registeredTeam) {
                throw new err_1.NotFoundError('Service layer', 'Team');
            }
            if (registeredUser.squad) {
                throw new err_1.ConflictError('Service layer', 'User cannot be added to the team: the user is already a member of another team.');
            }
            const newMember = yield team_repository_1.default.addNewMember(teamID, userID);
            const { password } = newMember, newMemberWithoutPass = __rest(newMember, ["password"]);
            return newMemberWithoutPass;
        });
    }
}
exports.default = TeamService;
