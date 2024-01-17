import { Schema } from 'mongoose';
import { ISpecies } from '../../src/interfaces/species.interface';
import Species from '../../src/models/species.model';
import Vaccine from '../../src/models/vaccine.model';
import { Logger } from '../../src/services/logger';
import { catVaccines } from '../static/cats';
import { dogVaccines } from '../static/dogs';

type VaccineType = {
  name: string;
  isCore: boolean;
};

export const initVaccines = async () => {
  Logger.update('Initializing dog vaccines');

  const species = await Species.find();

  await Promise.all(
    species.map(async (s: ISpecies) => {
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
    const dump = vaccines.map((vaccine: VaccineType) => ({
      speciesId,
      ...vaccine
    }));
    await Vaccine.create(dump);
    Logger.success('Dumping dog vaccines success');

    Logger.success('Initializing dog vaccines success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};

export const initCatVaccines = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing cat vaccines');
    const vaccines = catVaccines;
    Logger.success('Fetching cat vaccines success');

    Logger.update('Dumping cat vaccines');
    const dump = vaccines.map((vaccine: VaccineType) => ({
      speciesId,
      ...vaccine
    }));
    await Vaccine.create(dump);
    Logger.success('Dumping cat vaccines success');

    Logger.success('Initializing cat vaccines success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
