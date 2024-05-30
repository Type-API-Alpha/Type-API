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
Object.defineProperty(exports, "__esModule", { value: true });
const err_1 = require("../utils/err");
class UserMiddleware {
    static validateRequest(res, next, validationFunctions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = [];
                validationFunctions.forEach(validation => {
                    const validationResult = validation();
                    if (!validationResult.isValid) {
                        messages.push(validationResult.message);
                    }
                });
                if (messages.length > 0) {
                    throw new err_1.InvalidDataError('Middleware', 'Invalid fields', messages);
                }
                next();
            }
            catch (err) {
                if (err instanceof Error) {
                    const response = {
                        success: false,
                        data: null,
                        error: err.message
                    };
                    if (err instanceof err_1.InvalidDataError) {
                        response.error = err.errorMessage;
                        response.messages = err.messages;
                        res.json(response);
                        return;
                    }
                    else {
                        res.json(response);
                    }
                }
                console.error(err);
            }
        });
    }
    static validadeRequestBodyToCreate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const requestBodyValidator = new UserCreateRequestBodyValidator(req.body);
            const validationFunctions = [
            // () => requestBodyValidator.validateUsername(),
            // () => requestBodyValidator.validateUserEmail(),
            // () => requestBodyValidator.validateUserPassword()
            ];
            // await UserMiddleware.validateRequest(req, res, next, validationFunctions);
        });
    }
    static validateBodyToLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // const requestBodyValidator = new UserCreateRequestBodyValidator(req.body);
            // const validationFunctions = [
            //     // () => requestBodyValidator.validateUserEmail(),
            //     // () => requestBodyValidator.validateUserPassword()
            // ];
            // await UserMiddleware.validateRequest(req, res, next, validationFunctions);
        });
    }
}
exports.default = UserMiddleware;
