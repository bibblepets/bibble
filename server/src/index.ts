import { Express } from 'express';

require('dotenv').config();
require('./mongodb/db');

const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');

const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

app.listen(SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Server is alive at http://localhost:${SERVER_PORT}`
  );
});
