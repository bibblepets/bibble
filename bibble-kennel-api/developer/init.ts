import dotenv from 'dotenv';
import connection from '../src/mongodb/connection';
import { Logger } from '../src/services/logger';
import { initBreeds } from './data/breed.data';
import { initCountries } from './data/countries.data';
import { initHairCoats } from './data/hair-coat.data';
import { initLegalTags } from './data/legal-tag.data';
import { initSpecies } from './data/species.data';
import { initVaccines } from './data/vaccine.data';

dotenv.config();

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
  } catch (error: unknown) {
    Logger.fail(new Error(String(error)));
  } finally {
    connection.close();
    Logger.success('Database connection closed');
  }
};

run();
