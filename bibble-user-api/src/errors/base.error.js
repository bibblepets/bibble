"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, BaseError.prototype);
    }
}
exports.default = BaseError;
