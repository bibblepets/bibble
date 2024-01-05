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
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/listings', listingRouter);
app.use('/listing-creator', listingCreatorRouter);
app.use('/developer', developerRouter);

app.listen(SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Bibble Kennel API is alive at http://localhost:${SERVER_PORT}`
  );
});
