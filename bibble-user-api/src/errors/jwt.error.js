"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTError = void 0;
class JWTError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JWT_ERROR';
    }
}
exports.JWTError = JWTError;
