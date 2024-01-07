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
const speciesRouter = require('./routes/species.route');
const breedRouter = require('./routes/breed.route');
const countryRouter = require('./routes/country.route');
const vaccineRouter = require('./routes/vaccine.route');
const legalTagRouter = require('./routes/legal-tag.route');
const hairCoatRouter = require('./routes/hair-coat.route');

// Express initialization
const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/listing-creator', listingCreatorRouter);
app.use('/species', speciesRouter);
app.use('/breed', breedRouter);
app.use('/country', countryRouter);
app.use('/vaccine', vaccineRouter);
app.use('/legal-tag', legalTagRouter);
app.use('/hair-coat', hairCoatRouter);

// Error handling
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  Logger.success(`Bibble User API is alive at http://localhost:${SERVER_PORT}`);
});
