import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import Config from './config';
import { errorHandler } from './middleware/error.middleware';
import breedRouter from './routes/breed.route';
import countryRouter from './routes/country.route';
import hairCoatRouter from './routes/hair-coat.route';
import legalTagRouter from './routes/legal-tag.route';
import listingCreatorRouter from './routes/listing-creator.route';
import listingRouter from './routes/listing.route';
import speciesRouter from './routes/species.route';
import vaccineRouter from './routes/vaccine.route';
import { Logger } from './services/logger';

require('./mongodb/connection');

// Express initialization
const app: Express = express();
export const { SERVER_PORT, MONGO_URI } = Config.getVars();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/listing', listingRouter);
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
  Logger.success(
    `Bibble Kennel API is alive at http://localhost:${SERVER_PORT}`
  );
});
