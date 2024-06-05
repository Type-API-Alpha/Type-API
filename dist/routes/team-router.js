"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_middleware_1 = __importDefault(require("../middlewares/team-middleware"));
const team_controller_1 = __importDefault(require("../controllers/team-controller"));
const user_middleware_1 = __importDefault(require("../middlewares/user-middleware"));
const teamRouter = (0, express_1.Router)();
teamRouter.get('/teams', team_middleware_1.default.validateAccessRestriction, team_controller_1.default.getAllTeams);
teamRouter.get('/teams/:team_id', team_middleware_1.default.validateAccessWithTeamMember, team_controller_1.default.getTeamById);
teamRouter.post('/teams', user_middleware_1.default.validateAdminUser, team_middleware_1.default.validadeRequestBodyToCreateTeam, team_controller_1.default.createTeam);
teamRouter.post('/teams/:team_id/member/:user_id', team_middleware_1.default.validateIDTypeToAddNewMembers, team_middleware_1.default.validateAccessWithTeamLeaderRestriction, team_controller_1.default.addMember);
teamRouter.delete('/teams/:team_id/member/:user_id', team_controller_1.default.deleteMember);
teamRouter.delete('/teams/:team_id', team_controller_1.default.deleteTeam);
exports.default = teamRouter;
