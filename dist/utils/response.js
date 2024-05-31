"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createResponse = (success, data, error) => ({
    success,
    data,
    error
});
exports.default = createResponse;
