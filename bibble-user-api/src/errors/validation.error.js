"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const base_error_1 = __importDefault(require("./base.error"));
class ValidationError extends base_error_1.default {
    constructor(message, property, item) {
        super(message);
        this.property = property;
        this.item = item;
        this.errorCode = 400;
        this.errorType = 'VALIDATION_ERROR';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
    serializeErrors() {
        return [
            { message: this.message, property: this.property, item: this.item }
        ];
    }
    toString() {
        return `${this.message}, ${this.property}, ${this.item}`;
    }
}
exports.ValidationError = ValidationError;
