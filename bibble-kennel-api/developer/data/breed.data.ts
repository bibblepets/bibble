import axios from 'axios';
import { Schema } from 'mongoose';
import { ISpecies } from '../../src/interfaces/species.interface';
import Breed from '../../src/models/breed.model';
import Species from '../../src/models/species.model';
import { Logger } from '../../src/services/logger';
import { cats } from '../static/cats';

const DOG_CEO_URL = 'https://dog.ceo/api/breeds/list/all';

export const initBreeds = async () => {
  Logger.update('Initializing breeds');

  const species = await Species.find();

  await Promise.all(
    species.map(async (s: ISpecies) => {
      if (s.name === 'dog') {
        await initDogBreeds(s._id);
      } else if (s.name === 'cat') {
        await initCatBreeds(s._id);
      }
    })
  );

  Logger.success('Initializing breeds success');
};

export const initDogBreeds = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing dog breeds');
    const response = await axios.get(`${DOG_CEO_URL}`);
    const breeds = response.data;
    Logger.success('Fetching dog breeds success');

    Logger.update('Dumping dog breeds');
    const dump = Object.entries(breeds.message).flatMap(
      ([breed, subBreeds]) => {
        if (Array.isArray(subBreeds) && subBreeds.length > 0) {
          return subBreeds.map((subBreed: string) => ({
            speciesId,
            name: `${subBreed} ${breed}`
          }));
        }

        return {
          speciesId,
          name: breed
        };
      }
    );
    await Breed.create(dump);
    Logger.success('Dumping dog breeds success');

    Logger.success('Initializing dog breeds success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};

export const initCatBreeds = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing cat breeds');
    const breeds = cats;
    Logger.success('Fetching cat breeds success');

    Logger.update('Dumping cat breeds');
    const dump = breeds.map((breed: string) => ({
      speciesId,
      name: breed
    }));
    await Breed.create(dump);
    Logger.success('Dumping cat breeds success');

    Logger.success('Initializing cat breeds success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
