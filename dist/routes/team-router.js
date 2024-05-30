"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import TeamController from "../controllers/team-controller";
const team_middleware_1 = __importDefault(require("../middlewares/team-middleware"));
const teamRouter = (0, express_1.Router)();
teamRouter.post('/team', team_middleware_1.default.validadeRequestBodyToCreateTeam);
exports.default = teamRouter;
