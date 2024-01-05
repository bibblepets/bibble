import { Express } from 'express';

require('dotenv').config();
require('./mongodb/connection');

const express = require('express');
const cookieParser = require('cookie-parser');

const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());

app.listen(SERVER_PORT, () => {
  console.log(
    `⚡️[server]: Bibble User API is alive at http://localhost:${SERVER_PORT}`
  );
});
