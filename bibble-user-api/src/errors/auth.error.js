"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordError = exports.AuthTokenError = void 0;
const base_error_1 = __importDefault(require("./base.error"));
class AuthTokenError extends base_error_1.default {
    constructor(message) {
        super(message);
        this.errorCode = 401;
        this.errorType = 'AUTH_TOKEN_ERROR';
        Object.setPrototypeOf(this, AuthTokenError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message, property: 'token' }];
    }
    toString() {
        return `${this.message}`;
    }
}
exports.AuthTokenError = AuthTokenError;
class PasswordError extends base_error_1.default {
    constructor() {
        super('Incorrect password');
        this.errorCode = 401;
        this.errorType = 'PASSWORD_ERROR';
        Object.setPrototypeOf(this, PasswordError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message, property: 'password' }];
    }
    toString() {
        return `${this.message}`;
    }
}
exports.PasswordError = PasswordError;
