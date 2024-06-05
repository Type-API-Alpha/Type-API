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
const err_1 = require("../utils/err");
const user_service_1 = __importDefault(require("../services/user-service"));
const response_1 = __importDefault(require("../utils/response"));
const uuid_1 = require("uuid");
class UserController {
    static createNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.createUser(req.body);
                const response = (0, response_1.default)(true, user, null);
                res.status(201).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, "Internal server error.");
                if (err instanceof err_1.ConflictError) {
                    response.error = err.message;
                    res.status(err.code).json(response);
                }
                else {
                    res.status(500).json(response);
                }
            }
        });
    }
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const users = (_a = (yield user_service_1.default.getAllUsers())) !== null && _a !== void 0 ? _a : [
                    "No data available",
                ];
                const response = (0, response_1.default)(true, users, null);
                res.status(200).json(response);
            }
            catch (error) {
                const response = (0, response_1.default)(false, null, "Internal server error");
                res.status(500).json(response);
            }
        });
    }
    static getMyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
                if (!userID)
                    throw new Error("user do not have userID");
                const isUUID = (0, uuid_1.validate)(userID);
                if (!isUUID)
                    throw new Error("uuid not");
                const myUser = yield user_service_1.default.getMyUser(userID);
                const response = (0, response_1.default)(true, myUser, null);
                res.status(200).json(response);
            }
            catch (error) {
                const reason = error instanceof Error
                    ? error.message
                    : "Internal server error.";
                const response = (0, response_1.default)(false, null, reason);
                res.status(500).json(response);
            }
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUser = req.user;
                const userIDToUpdate = req.params.user_id;
                const newUserInfos = req.body;
                const updatedUser = yield user_service_1.default.updateUserInfos(loggedUser, userIDToUpdate, newUserInfos);
                const response = (0, response_1.default)(true, updatedUser, null);
                res.status(200).json(response);
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error.');
                if (err instanceof err_1.ConflictError || err instanceof err_1.ForbiddenAccessError || err instanceof err_1.NotFoundError) {
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
exports.default = UserController;
