import { Logger } from '../../src/services/logger';

const speciesData = ['dog', 'cat'];

const Species = require('../../src/models/species.model');

export const initSpecies = async () => {
  Logger.update('Initializing species');

  try {
    Logger.update('Fetching species');
    const species = speciesData;
    Logger.success('Fetching species success');

    Logger.update('Dumping species');
    const dump = species.map((species: any) => ({
      name: species
    }));
    await Species.create(dump);
    Logger.success('Dumping species success');

    Logger.success('Initializing species success');
  } catch (error: any) {
    throw new Error(error);
  }
};
