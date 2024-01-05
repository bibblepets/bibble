"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailError = exports.validateEmail = void 0;
function validateEmail(email) {
    return RegExp(/^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/).test(String(email).toLowerCase());
}
exports.validateEmail = validateEmail;
exports.emailError = 'Email is invalid';
