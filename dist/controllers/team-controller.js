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
const team_service_1 = __importDefault(require("../services/team-service"));
const response_1 = __importDefault(require("../utils/response"));
const err_1 = require("../utils/err");
class TeamController {
    static getAllTeams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teams = yield team_service_1.default.getAllTeams();
                const response = (0, response_1.default)(true, teams, null);
                res.status(200).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error.');
                res.status(500).json(response);
            }
        });
    }
    static addMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { team_id: teamID, user_id: userID } = req.params;
                const newMember = yield team_service_1.default.addNewMember(teamID, userID);
                const response = (0, response_1.default)(true, newMember, null);
                res.status(201).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error');
                if (err instanceof err_1.NotFoundError || err instanceof err_1.ConflictError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
    static deleteMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { team_id: teamID, user_id: userID } = req.params;
                const checkleader = yield team_service_1.default.checkLeader(teamID);
                const admin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin;
                if (!admin && checkleader.leader !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userID)) {
                    throw new err_1.ForbiddenAccessError('Controller Layer', 'Forbidden Access! Restrict to Administrators and Team Leaders!');
                }
                const erasedMember = yield team_service_1.default.deleteMember(teamID, userID);
                const response = (0, response_1.default)(true, erasedMember, null);
                res.status(201).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error');
                if (err instanceof err_1.NotFoundError || err instanceof err_1.ConflictError || err instanceof err_1.ForbiddenAccessError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
    static deleteTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const admin = (_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin;
                if (!admin) {
                    throw new err_1.ForbiddenAccessError('Controller Layer', 'Forbidden Access!');
                }
                const { team_id: teamID } = req.params;
                const erasedTeam = yield team_service_1.default.deleteTeam(teamID);
                const response = (0, response_1.default)(true, erasedTeam, null);
                res.status(200).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error');
                if (err instanceof err_1.NotFoundError || err instanceof err_1.ConflictError || err instanceof err_1.ForbiddenAccessError) {
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
exports.default = TeamController;
