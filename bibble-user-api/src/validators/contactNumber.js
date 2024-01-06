"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactNumberError = exports.validateContactNumber = void 0;
function validateContactNumber(contactNumber) {
    console.log(contactNumber);
    return RegExp(/^[0-9\b]+$/).test(contactNumber);
}
exports.validateContactNumber = validateContactNumber;
exports.contactNumberError = 'Contact number is invalid.';
