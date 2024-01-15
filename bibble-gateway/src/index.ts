// Global dependencies
import { Express } from 'express';
import { errorHandler } from './middleware/error.middleware';
import { Logger } from './services/logger';

require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

// Project dependencies
const userRouter = require('./routes/user.route');

// Express initialization
const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRouter);

// Error handling
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  Logger.success(`Bibble Gateway is alive at http://localhost:${SERVER_PORT}`);
});
