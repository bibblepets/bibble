import { Connection } from 'mongoose';
import { Logger } from '../src/services/logger';
import { initCountries } from './data/countries.data';
import { initSpecies } from './data/species.data';
import { initBreeds } from './data/breed.data';
import { initHairCoats } from './data/hair-coat.data';
import { initVaccines } from './data/vaccine.data';
import { initLegalTags } from './data/legal-tag.data';

require('dotenv').config();

export const connection: Connection = require('../src/mongodb/connection');

const run = async () => {
  try {
    Logger.update('Connecting to database');
    await connection.asPromise();
    Logger.success('Connecting to database success');

    Logger.update('Dropping database');
    await connection.dropDatabase();
    Logger.success('Dropping database success');

    await initCountries();
    await initSpecies();
    await initBreeds();
    await initHairCoats();
    await initVaccines();
    await initLegalTags();
  } catch (error: any) {
    Logger.fail(error);
  } finally {
    connection.close();
    Logger.success('Database connection closed');
  }
};

run();
