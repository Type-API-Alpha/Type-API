import { IValidationResponse, email, uuid, typeName } from "../interfaces/interfaces";
import { validate as uuidValidate } from 'uuid';

export class RequestBodyValidator {

    private validateField(value: string | undefined, pattern: RegExp, emptyFieldMessage: string, invalidDataMessage: string): IValidationResponse {
        const response: IValidationResponse = {
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
            response.message = 'The data must be of type string.'
        }

        if (!pattern.test(value)) {
            response.isValid = false;
            response.message = invalidDataMessage;
            return response;
        }

        return response;
    }

    public validateName(typeName: typeName, value: string): IValidationResponse {
        const pattern: RegExp = /^(?=(?:.*[a-zA-Z]){4})[a-zA-Z\s]*$/;
        return this.validateField(
            value,
            pattern,
            `Missing ${typeName} in the request body`,
            `The ${typeName} field must contain only letters and spaces, and must be at least 4 characters long (excluding spaces).`
        )
    }

    public validateUserEmail(email: email): IValidationResponse {
        const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.validateField(
            email,
            emailPattern,
            'Missing email in the request body',
            'The email address is not valid.'
        )
    }

    public validateUserPassword(password: string): IValidationResponse {
        const passwordPattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return this.validateField(
            password,
            passwordPattern,
            'Missing password in the request body',
            'The password must contain at least one letter, one number, and be at least 8 characters long.'
        );
    }

    public validateUUID(ID: uuid): IValidationResponse {
        const response: IValidationResponse = {
            isValid: true,
            message: null
        };

        if (ID && !uuidValidate(ID)) {
            response.isValid = false;
            response.message = 'Inválid ID. ID must be UUUID type.';
            return response;
        }

        return response;
    } 

    public validateAdminType(isAdminField: boolean): IValidationResponse {
        const response: IValidationResponse = {
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