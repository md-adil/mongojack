"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ConnectionError = exports.Error = void 0;
const mongodb_1 = require("mongodb");
class Error extends mongodb_1.MongoError {
    constructor() {
        super(...arguments);
        this.type = "MongoModelError";
    }
}
exports.Error = Error;
class ConnectionError extends Error {
}
exports.ConnectionError = ConnectionError;
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
