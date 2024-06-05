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
class UserRepository {
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id, username, email, first_name, last_name, squad FROM "User";`;
            const { rows } = yield db_connection_1.default.query(query);
            return rows;
        });
    }
    static getMyUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id, username, email, first_name, last_name, squad FROM "User" WHERE id = $1;`;
            const { rows } = yield db_connection_1.default.query(query, [userID]);
            return rows[0];
        });
    }
    static insertNewUser(userInfos) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO "User" 
        (username, email, first_name, last_name, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const { rows } = yield db_connection_1.default.query(query, [
                ...Object.values(userInfos),
            ]);
            return rows[0];
        });
    }
    static findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM "User" WHERE username = $1';
            const { rows } = yield db_connection_1.default.query(query, [username]);
            return rows[0];
        });
    }
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM "User" WHERE email = $1';
            const { rows } = yield db_connection_1.default.query(query, [email]);
            return rows[0];
        });
    }
    static findUserByID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM "User" WHERE id = $1';
            const { rows } = yield db_connection_1.default.query(query, [userID]);
            return rows[0];
        });
    }
    static deleteUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM "User" WHERE id = $1 RETURNING * ';
            const { rows } = yield db_connection_1.default.query(query, [userID]);
            return rows[0];
        });
    }
    static findBySquad(teamID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM "User" WHERE squad = $1';
            const { rows } = yield db_connection_1.default.query(query, [teamID]);
            return rows[0];
        });
    }
}
exports.default = UserRepository;
