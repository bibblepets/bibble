import { Schema } from 'mongoose';
import { Logger } from '../../src/services/logger';
import { ISpeciesModel } from '../../src/models/species.model';
import { IVaccineModel } from '../../src/models/vaccine.model';
import { dogVaccines } from '../static/dogs';
import { catVaccines } from '../static/cats';

const Species: ISpeciesModel = require('../../src/models/species.model');
const Vaccine: IVaccineModel = require('../../src/models/vaccine.model');

export const initVaccines = async () => {
  Logger.update('Initializing dog vaccines');

  const species = await Species.find();

  await Promise.all(
    species.map(async (s: any) => {
      if (s.name === 'dog') {
        await initDogVaccines(s._id);
      } else if (s.name === 'cat') {
        await initCatVaccines(s._id);
      }
    })
  );

  Logger.success('Initializing dog vaccines success');
};

export const initDogVaccines = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing dog vaccines');
    const vaccines = dogVaccines;
    Logger.success('Fetching dog vaccines success');

    Logger.update('Dumping dog vaccines');
    const dump = vaccines.map((vaccine: any) => ({
      speciesId,
      ...vaccine
    }));
    await Vaccine.create(dump);
    Logger.success('Dumping dog vaccines success');

    Logger.success('Initializing dog vaccines success');
  } catch (error: any) {
    throw new Error(error);
  }
};

export const initCatVaccines = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing cat vaccines');
    const vaccines = catVaccines;
    Logger.success('Fetching cat vaccines success');

    Logger.update('Dumping cat vaccines');
    const dump = vaccines.map((vaccine: any) => ({
      speciesId,
      ...vaccine
    }));
    await Vaccine.create(dump);
    Logger.success('Dumping cat vaccines success');

    Logger.success('Initializing cat vaccines success');
  } catch (error: any) {
    throw new Error(error);
  }
};
