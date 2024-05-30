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
class ValidationMiddleware {
    static validateRequest(req, res, next, validationFunctions) {
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
                    throw new err_1.InvalidDataError('Middleware', messages);
                }
                ;
                next();
            }
            catch (err) {
                if (err instanceof Error) {
                    const response = {
                        success: false,
                        data: null,
                        error: 'Internal server error.'
                    };
                    if (err instanceof err_1.InvalidDataError) {
                        response.error = err.errorMessage;
                        response.messages = err.messages;
                        res.status(400).json(response);
                        return;
                    }
                    else {
                        res.status(500).json(response);
                    }
                }
                console.error(err);
            }
        });
    }
}
exports.default = ValidationMiddleware;
