"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const base_error_1 = __importDefault(require("./base.error"));
class ServerError extends base_error_1.default {
    constructor(message) {
        super(message);
        this.errorCode = 500;
        this.errorType = 'SERVER_ERROR';
        Object.setPrototypeOf(this, ServerError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
    toString() {
        return `${this.message}`;
    }
}
exports.ServerError = ServerError;
