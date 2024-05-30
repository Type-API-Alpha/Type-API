"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBodyValidator = void 0;
const uuid_1 = require("uuid");
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
            response.message = 'Inválid ID. ID type must be UUUID.';
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
}
exports.RequestBodyValidator = RequestBodyValidator;
