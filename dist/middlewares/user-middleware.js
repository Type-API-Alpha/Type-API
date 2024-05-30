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
class UserMiddleware {
    static validadeRequestBodyToCreateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBodyValidator = new validations_1.RequestBodyValidator();
            const userInfos = req.body;
            const validationFunctions = [
                () => requestBodyValidator.validateName('username', userInfos.username),
                () => requestBodyValidator.validateName('firstName', userInfos.firstName),
                () => requestBodyValidator.validateName('lastName', userInfos.lastName),
                () => requestBodyValidator.validateUserEmail(userInfos.email),
                () => requestBodyValidator.validateUserPassword(userInfos.password),
                () => requestBodyValidator.validateUUID(userInfos.squad),
                () => requestBodyValidator.validateAdminType(userInfos.isAdmin)
            ];
            yield _1.default.validateRequest(req, res, next, validationFunctions);
        });
    }
}
exports.default = UserMiddleware;
