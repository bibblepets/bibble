import { Schema } from 'mongoose';
import { ISpecies } from '../../src/interfaces/species.interface';
import HairCoat from '../../src/models/hair-coat.model';
import Species from '../../src/models/species.model';
import { Logger } from '../../src/services/logger';
import { catHairCoats } from '../static/cats';
import { dogHairCoats } from '../static/dogs';

export const initHairCoats = async () => {
  Logger.update('Initializing hair coats');

  const species = await Species.find();

  await Promise.all(
    species.map(async (s: ISpecies) => {
      if (s.name === 'dog') {
        await initDogHairCoats(s._id);
      } else if (s.name === 'cat') {
        await initCatHairCoats(s._id);
      }
    })
  );

  Logger.success('Initializing hair coats success');
};

export const initDogHairCoats = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing dog hair coats');
    const hairCoats = dogHairCoats;
    Logger.success('Fetching dog hair coats success');

    Logger.update('Dumping dog hair coats');
    const dump = hairCoats.map((hairCoat: string) => ({
      speciesId,
      name: hairCoat
    }));
    await HairCoat.create(dump);
    Logger.success('Dumping dog hair coats success');

    Logger.success('Initializing dog hair coats success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};

export const initCatHairCoats = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing cat hair coats');
    const hairCoats = catHairCoats;
    Logger.success('Fetching cat hair coats success');

    Logger.update('Dumping cat hair coats');
    const dump = hairCoats.map((hairCoat: string) => ({
      speciesId,
      name: hairCoat
    }));
    await HairCoat.create(dump);
    Logger.success('Dumping cat hair coats success');

    Logger.success('Initializing cat hair coats success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
