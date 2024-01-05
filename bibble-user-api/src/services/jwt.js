"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../loggers/logger");
const jwt_error_1 = require("../errors/jwt.error");
const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
};
function signAuthToken(req, res, id) {
    if (!SECRET_JWT_CODE) {
        throw new jwt_error_1.JWTError('SECRET_JWT_CODE not found.');
    }
    const { email } = req.body;
    const token = jsonwebtoken_1.default.sign({ id, email }, SECRET_JWT_CODE);
    logger_1.Logger.success('Auth token created.', token);
    res.cookie('authToken', token, COOKIE_OPTIONS);
    logger_1.Logger.success('Auth token set.', token);
}
exports.signAuthToken = signAuthToken;
