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
const validations_1 = require("../utils/validations");
const _1 = __importDefault(require("."));
const team_repository_1 = __importDefault(require("../repositories/team-repository"));
const err_1 = require("../utils/err");
const response_1 = __importDefault(require("../utils/response"));
const user_repository_1 = __importDefault(require("../repositories/user-repository"));
const user_service_1 = __importDefault(require("../services/user-service"));
class TeamMiddleware {
    static validadeRequestBodyToCreateTeam(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBodyValidator = new validations_1.RequestBodyValidator();
            const teamInfos = req.body;
            const validationFunctions = [
                () => requestBodyValidator.validateName('team name', teamInfos.name),
                () => requestBodyValidator.validateUUID(teamInfos.leader, 'Leader'),
            ];
            yield _1.default.validateRequest(req, res, next, validationFunctions);
        });
    }
    static validateIDTypeToAddNewMembers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBodyValidator = new validations_1.RequestBodyValidator();
            const teamID = req.params.team_id;
            const userID = req.params.user_id;
            const validationFunctions = [
                () => requestBodyValidator.validateUUID(teamID, 'Team'),
                () => requestBodyValidator.validateUUID(userID, 'User'),
            ];
            yield _1.default.validateRequest(req, res, next, validationFunctions);
        });
    }
    static validateAccessWithTeamLeaderRestriction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = req.user;
            const teamID = req.params.team_id;
            if (loggedUser.isAdmin) {
                next();
                return;
            }
            yield TeamMiddleware.validateTeamLeader(req, res, next, loggedUser.userID, teamID, true);
        });
    }
    static validateAccessWithTeamMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = req.user;
            const teamID = req.params.team_id;
            if (loggedUser.isAdmin) {
                next();
                return;
            }
            const isLeader = yield user_service_1.default.isLeader(loggedUser.userID);
            if (isLeader) {
                next();
                return;
            }
            yield TeamMiddleware.validateTeamMember(req, res, next, teamID);
        });
    }
    static validateTeamMember(req, res, next, teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userSquad = yield user_repository_1.default.findBySquad(teamID);
                console.log(userSquad);
                if (!userSquad) {
                    throw new err_1.ForbiddenAccessError('Middleware layer', 'Access denied: This resource is restricted to administrators, team leaders or members of this team only.');
                }
                next();
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, "Internal server error.");
                if (err instanceof err_1.ForbiddenAccessError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
    static validateAccessRestriction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = req.user;
            if (loggedUser.isAdmin) {
                next();
                return;
            }
            yield TeamMiddleware.validateTeamLeader(req, res, next, loggedUser.userID);
        });
    }
    static validateTeamLeader(req, res, next, loggedUserID, teamID, restrictToOwnTeam) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isLeader = yield team_repository_1.default.getTeamByLeaderId(loggedUserID);
                if (!isLeader) {
                    throw new err_1.ForbiddenAccessError('Middleware layer', 'Access denied: This resource is restricted to administrators and the team leaders only.');
                }
                if (restrictToOwnTeam && teamID) {
                    const teamInfos = yield team_repository_1.default.findTeamByID(teamID);
                    if (loggedUserID !== (teamInfos === null || teamInfos === void 0 ? void 0 : teamInfos.leader)) {
                        throw new err_1.ForbiddenAccessError('Middleware layer', 'Access denied: This resource is restricted to administrators and the own team leader only.');
                    }
                }
                next();
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, "Internal server error.");
                if (err instanceof err_1.ForbiddenAccessError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
}
exports.default = TeamMiddleware;
