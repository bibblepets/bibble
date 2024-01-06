"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyNotFoundError = exports.UniqueKeyError = void 0;
const base_error_1 = __importDefault(require("./base.error"));
class KeyError extends base_error_1.default {
    constructor(message, property, key) {
        super(message);
        this.property = property;
        this.key = key;
        Object.setPrototypeOf(this, KeyError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message, property: this.property, key: this.key }];
    }
    toString() {
        return `${this.message}, ${this.key}`;
    }
}
class UniqueKeyError extends KeyError {
    constructor(message, property, key) {
        super(message, property, key);
        this.errorCode = 409;
        this.errorType = 'UNIQUE_KEY_ERROR';
        Object.setPrototypeOf(this, UniqueKeyError.prototype);
    }
}
exports.UniqueKeyError = UniqueKeyError;
class KeyNotFoundError extends KeyError {
    constructor(message, property, key) {
        super(message, property, key);
        this.errorCode = 404;
        this.errorType = 'KEY_NOT_FOUND_ERROR';
        Object.setPrototypeOf(this, KeyNotFoundError.prototype);
    }
}
exports.KeyNotFoundError = KeyNotFoundError;
