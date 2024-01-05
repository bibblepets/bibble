"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../loggers/logger");
const database_error_1 = require("../errors/database.error");
const jwt_error_1 = require("../errors/jwt.error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof database_error_1.UniqueKeyError) {
        logger_1.Logger.error(err, err.key);
        res.status(409).send(`${err.name} : ${err.message} ${err.key}`);
    }
    else if (err instanceof jwt_error_1.JWTError) {
        logger_1.Logger.error(err);
        res.status(500).send(`${err.name} : ${err.message}`);
    }
    else {
        logger_1.Logger.error(err);
        res.status(500).send(`UNKNOWN_SERVER_ERROR : ${err.message}`);
    }
};
exports.errorHandler = errorHandler;
