"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error extends global.Error {
    constructor() {
        super(...arguments);
        this.code = "MongoModelError";
    }
}
exports.Error = Error;
class ConnectionError extends Error {
}
exports.ConnectionError = ConnectionError;
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
