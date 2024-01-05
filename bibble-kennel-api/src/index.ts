import { Express } from 'express';

require('dotenv').config();
require('./mongodb/connection');

const express = require('express');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const listingRouter = require('./routes/listing.route');
const listingCreatorRouter = require('./routes/listing-creator.route');
const developerRouter = require('./routes/developer.route');

const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listings', listingRouter);
app.use('/api/listing-creator', listingCreatorRouter);
app.use('/api/developer', developerRouter);

app.listen(SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Bibble Kennel API is alive at http://localhost:${SERVER_PORT}`
  );
});
