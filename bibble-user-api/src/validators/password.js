"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordError = exports.validatePassword = void 0;
function validatePassword(password) {
    return password.length >= 6;
}
exports.validatePassword = validatePassword;
exports.passwordError = 'Password must be at least 6 characters long.';
