"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../loggers/logger");
const base_error_1 = __importDefault(require("../errors/base.error"));
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof base_error_1.default) {
        logger_1.Logger.error(err);
        return res.send({ errors: err.serializeErrors() });
    }
    res.send({ errors: [{ message: 'Something went wrong.' }] });
};
exports.errorHandler = errorHandler;
