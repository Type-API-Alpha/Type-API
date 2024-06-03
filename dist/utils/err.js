"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ForbiddenAccessError = exports.UnauthorizedSessionError = exports.UnauthorizedError = exports.ConflictError = exports.InvalidDataError = void 0;
class InvalidDataError extends Error {
    constructor(layer, messages) {
        super();
        this.name = this.constructor.name;
        this.errorMessage = 'Invalid data';
        this.messages = messages;
        this.code = 400;
        this.layer = layer;
    }
}
exports.InvalidDataError = InvalidDataError;
class ConflictError extends Error {
    constructor(layer, errorMessage) {
        super();
        this.name = this.constructor.name;
        this.message = errorMessage;
        this.code = 409;
        this.layer = layer;
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends Error {
    constructor(layer) {
        super();
        this.name = this.constructor.name;
        this.errorMessage = 'Invalid email and/or password.';
        this.code = 401;
        this.layer = layer;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class UnauthorizedSessionError extends UnauthorizedError {
    constructor(layer) {
        super(layer);
        this.errorMessage = 'Missing valid session cookie.';
    }
}
exports.UnauthorizedSessionError = UnauthorizedSessionError;
class ForbiddenAccessError extends Error {
    constructor(layer) {
        super();
        this.name = this.constructor.name;
        this.message = 'Access denied: This resource is restricted to administrators only.';
        this.code = 403;
        this.layer = layer;
    }
}
exports.ForbiddenAccessError = ForbiddenAccessError;
class NotFoundError extends Error {
    constructor(layer, resourceName) {
        super();
        this.name = this.constructor.name;
        this.message = `${resourceName} not found.`;
        this.code = 404;
        this.layer = layer;
    }
}
exports.NotFoundError = NotFoundError;
