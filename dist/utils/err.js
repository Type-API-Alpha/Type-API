"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.InvalidDataError = void 0;
class InvalidDataError extends Error {
    constructor(layer, messages) {
        super();
        this.name = this.constructor.name;
        this.errorMessage = 'Inválid data';
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
