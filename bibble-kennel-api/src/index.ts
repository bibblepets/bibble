// Global dependencies
import { Express } from 'express';
import { errorHandler } from './middleware/error.middleware';
import { Logger } from './services/logger';

require('dotenv').config();
require('./mongodb/connection');

const express = require('express');
const cookieParser = require('cookie-parser');

// Project dependencies
const listingCreatorRouter = require('./routes/listing-creator.route');

// Express initialization
const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/listing-creator', listingCreatorRouter);

// Error handling
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  Logger.success(`Bibble User API is alive at http://localhost:${SERVER_PORT}`);
});
