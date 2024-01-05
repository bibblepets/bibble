"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_1 = require("./loggers/logger");
require('dotenv').config();
require('./mongodb/connection');
const express = require('express');
const cookieParser = require('cookie-parser');
// Project dependencies
const authRouter = require('./routes/auth.route');
// Express initialization
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
// Middlewares
app.use(express.json());
app.use(cookieParser());
// Routes
app.use('/auth', authRouter);
// Error handling
app.use(error_middleware_1.errorHandler);
app.listen(SERVER_PORT, () => {
    logger_1.Logger.success(`Bibble User API is alive at http://localhost:${SERVER_PORT}`);
});
