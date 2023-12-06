import { Connection } from 'mongoose';
import { before, after } from 'mocha';

require('dotenv').config();
let db: Connection;

before(async function () {
  db = require('../src/mongodb/db');
});

after(async function () {
  await db.dropDatabase();
  await db.close();
});
