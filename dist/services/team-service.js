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
    static getAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            const teams = yield team_repository_1.default.getAllTeams();
            return teams;
        });
    }
    static getTeamById(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const team = yield team_repository_1.default.getTeamById(teamId);
            return team;
        });
    }
    static createTeam(team) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamNameUsed = yield team_repository_1.default.findUserByName(team.name);
            if (teamNameUsed) {
                throw new err_1.ConflictError("Service layer", "Team Name already used.");
            }
            const userData = yield user_repository_1.default.findUserByID(team.leader);
            console.log(userData);
            if (!userData) {
                throw new err_1.NotFoundError("Service layer", "User");
            }
            if (userData.squad != null) {
                throw new err_1.ConflictError("Service layer", "User is already on a team");
            }
            if (userData.isAdmin) {
                throw new err_1.ConflictError("Service layer", "The admin cannot be a leader or be part of a group.");
            }
            const teamData = {
                name: team.name,
                leader: team.leader,
            };
            const teamReturn = yield team_repository_1.default.createTeam(teamData);
            yield team_repository_1.default.addNewMember(teamReturn.id, team.leader);
            return teamReturn;
        });
    }
    static addNewMember(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredUser = yield user_repository_1.default.findUserByID(userID);
            if (!registeredUser) {
                throw new err_1.NotFoundError("Service layer", "User");
            }
            const registeredTeam = yield team_repository_1.default.findTeamByID(teamID);
            if (!registeredTeam) {
                throw new err_1.NotFoundError("Service layer", "Team");
            }
            if (registeredUser.squad) {
                throw new err_1.ConflictError("Service layer", "User cannot be added to the team: the user is already a member of another team.");
            }
            const newMember = yield team_repository_1.default.addNewMember(teamID, userID);
            const { password } = newMember, newMemberWithoutPass = __rest(newMember, ["password"]);
            return newMemberWithoutPass;
        });
    }
    static checkLeader(teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkTeamLeader = yield team_repository_1.default.findTeamByID(teamID);
            if (!checkTeamLeader) {
                throw new err_1.NotFoundError("Service Layer", "Team");
            }
            return checkTeamLeader;
        });
    }
    static deleteMember(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkTeam = yield team_repository_1.default.findTeamByID(teamID);
            if (!checkTeam) {
                throw new err_1.NotFoundError("Service Layer", "Team");
            }
            const checkUser = yield user_repository_1.default.findUserByID(userID);
            if (!checkUser) {
                throw new err_1.NotFoundError("Service Layer", "User");
            }
            else if (checkUser.squad !== teamID) {
                throw new err_1.ConflictError("Service layer", "User does not belong to the selected Team");
            }
            else {
                const deletedMember = yield team_repository_1.default.deleteMember(userID, teamID);
                const { password } = deletedMember, entityWithoutPassword = __rest(deletedMember, ["password"]);
                return entityWithoutPassword;
            }
        });
    }
    static deleteTeam(teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkTeam = yield team_repository_1.default.findTeamByID(teamID);
            if (!checkTeam) {
                throw new err_1.NotFoundError("Service Layer", "Team");
            }
            const emptyCheck = yield user_repository_1.default.findBySquad(teamID);
            if (emptyCheck) {
                throw new err_1.ConflictError("Service Layer", "The team cannot be deleted, since is not empty");
            }
            const erasedTeam = yield team_repository_1.default.deleteTeam(teamID);
            return erasedTeam;
        });
    }
}
exports.default = TeamService;
