"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = exports.authenticate = void 0;
const logger_1 = require("../loggers/logger");
const jwt_1 = require("../services/jwt");
const key_error_1 = require("../errors/key.error");
const auth_error_1 = require("../errors/auth.error");
const User = require('../models/user.model');
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies.authToken;
    try {
        if (!authToken) {
            throw new auth_error_1.AuthTokenError("Auth token doesn't exist");
        }
        const decodedToken = (0, jwt_1.verifyAuthToken)(authToken);
        const user = yield User.findById(decodedToken.id);
        if (!user) {
            throw new auth_error_1.AuthTokenError('Invalid auth token');
        }
        (0, jwt_1.signAuthToken)(req, res, user._id);
        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.authenticate = authenticate;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let createdUser;
    try {
        logger_1.Logger.update('Creating user.');
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            throw new key_error_1.UniqueKeyError('User already exists', 'email', email);
        }
        createdUser = yield User.create({
            email,
            password
        });
        logger_1.Logger.success('User created.', createdUser._id);
        (0, jwt_1.signAuthToken)(req, res, createdUser._id);
        return res.status(201).json(createdUser);
    }
    catch (error) {
        if (createdUser) {
            yield createdUser.deleteOne();
            logger_1.Logger.update('User deleted', createdUser._id);
        }
        next(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user) {
            throw new key_error_1.KeyNotFoundError('User not found', 'email', email);
        }
        if (!user.isCorrectPassword(password)) {
            throw new auth_error_1.PasswordError();
        }
        (0, jwt_1.signAuthToken)(req, res, user._id);
        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
const logoutUser = (_req, res) => {
    (0, jwt_1.deleteAuthToken)(res);
    return res.status(200).json('User logged out successfully');
};
exports.logoutUser = logoutUser;
