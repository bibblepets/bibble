import dotenv from 'dotenv';
import { after, before } from 'mocha';
import { Connection } from 'mongoose';

dotenv.config();

let db: Connection;

before(async function () {
  db = require('../src/mongodb/connection');
});

after(async function () {
  await db.dropDatabase();
  await db.close();
});
