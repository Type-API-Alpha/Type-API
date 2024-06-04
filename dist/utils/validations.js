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
exports.RequestBodyValidator = void 0;
const uuid_1 = require("uuid");
const team_repository_1 = __importDefault(require("../repositories/team-repository"));
class RequestBodyValidator {
    validateField(value, pattern, emptyFieldMessage, invalidDataMessage) {
        const response = {
            isValid: true,
            message: null
        };
        if (!value) {
            response.isValid = false;
            response.message = emptyFieldMessage;
            return response;
        }
        if (typeof value !== 'string') {
            response.isValid = false;
            response.message = 'The data must be of type string.';
        }
        if (!pattern.test(value)) {
            response.isValid = false;
            response.message = invalidDataMessage;
            return response;
        }
        return response;
    }
    validateName(typeName, value) {
        const pattern = /^(?=(?:.*[a-zA-Z]){4})[a-zA-Z\s]*$/;
        return this.validateField(value, pattern, `Missing ${typeName} in the request body`, `The ${typeName} field must contain only letters and spaces, and must be at least 4 characters long (excluding spaces).`);
    }
    validateUserEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.validateField(email, emailPattern, 'Missing email in the request body', 'The email address is not valid.');
    }
    validateUserPassword(password) {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return this.validateField(password, passwordPattern, 'Missing password in the request body', 'The password must contain at least one letter, one number, and be at least 8 characters long.');
    }
    validateUUID(ID) {
        const response = {
            isValid: true,
            message: null
        };
        if (ID && !(0, uuid_1.validate)(ID)) {
            response.isValid = false;
            response.message = 'Inválid ID. ID must be UUUID type.';
            return response;
        }
        return response;
    }
    validateAdminType(isAdminField) {
        const response = {
            isValid: true,
            message: null
        };
        if (isAdminField && typeof isAdminField !== 'boolean') {
            response.isValid = false;
            response.message = 'Invalid value to isAdmin field. It must be boolean.';
        }
        return response;
    }
    validateLeaderType(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                isValid: true,
                message: null
            };
            const team = yield team_repository_1.default.getTeamByLeaderId(userId);
            if (!team) {
                response.isValid = false;
                response.message = "No team was found with this user as leader";
            }
            return response;
        });
    }
}
exports.RequestBodyValidator = RequestBodyValidator;
