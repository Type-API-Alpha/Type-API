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
const db_connection_1 = __importDefault(require("../database/db-connection"));
class TeamRepository {
    static findTeamByID(teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM Team WHERE id = $1';
            const { rows } = yield db_connection_1.default.query(query, [teamID]);
            return rows[0];
        });
    }
    static addNewMember(teamID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE "User" SET squad = $1 WHERE id = $2 RETURNING *';
            const { rows } = yield db_connection_1.default.query(query, [teamID, userID]);
            return rows[0];
        });
    }
}
exports.default = TeamRepository;
