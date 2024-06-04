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
    static validateIDsTypeToAddNewMembers(req, res, next) {
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
    static validateUserType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUser = req.user;
                if (loggedUser.isAdmin) {
                    next();
                    return;
                }
                const team = yield team_repository_1.default.getTeamByLeaderId(loggedUser.userID);
                if (!team) {
                    throw new err_1.ForbiddenAccessError("Middleware layer", "This user don't have permission.");
                }
                // if (req.params.team_id && test) {
                //     const paramTeam = await TeamRepository.getTeamById(req.params.team_id);
                //     if (paramTeam.leader !== loggedUser.userID) { // getuserbyid para pegar o squad
                //         throw new ForbiddenAccessError("Middleware layer", "This user don't have permission.");
                //     }
                // }
                next();
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, "Internal server error.");
                if (err instanceof err_1.ForbiddenAccessError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                    return;
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
}
exports.default = TeamMiddleware;
