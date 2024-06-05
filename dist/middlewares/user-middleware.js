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
const err_1 = require("../utils/err");
const response_1 = __importDefault(require("../utils/response"));
class UserMiddleware {
    static validateRequestBodyUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfos = req.body;
            const validator = new validations_1.RequestBodyValidator();
            const validationFunctions = [];
            const usernameValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.username;
            const firstNameValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.firstName;
            const lastNameValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.lastName;
            const emailValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.email;
            const passwordValidation = req.method === 'POST' || req.method === 'PATCH' && userInfos.password;
            const adminDataTypeValidation = req.method === 'PATCH' && userInfos.isAdmin;
            usernameValidation ? validationFunctions.push(() => validator.validateName('username', userInfos.username)) : null;
            firstNameValidation ? validationFunctions.push(() => validator.validateName('firstName', userInfos.firstName)) : null;
            lastNameValidation ? validationFunctions.push(() => validator.validateName('lastName', userInfos.lastName)) : null;
            emailValidation ? validationFunctions.push(() => validator.validateUserEmail(userInfos.email)) : null;
            passwordValidation ? validationFunctions.push(() => validator.validateUserPassword(userInfos.password)) : null;
            adminDataTypeValidation ? validationFunctions.push(() => validator.validateAdminType(userInfos.isAdmin)) : null;
            yield _1.default.validateRequest(req, res, next, validationFunctions);
        });
    }
    static validateAdminUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUser = req.user;
                const isAdmin = loggedUser.isAdmin === true;
                if (!isAdmin) {
                    throw new err_1.ForbiddenAccessError('Middleware layer');
                }
                next();
            }
            catch (err) {
                const response = (0, response_1.default)(false, null, 'Internal server error.');
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
exports.default = UserMiddleware;
