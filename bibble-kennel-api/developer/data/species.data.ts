import Species from '../../src/models/species.model';
import { Logger } from '../../src/services/logger';

const speciesData = ['dog', 'cat'];

export const initSpecies = async () => {
  Logger.update('Initializing species');

  try {
    Logger.update('Fetching species');
    const species = speciesData;
    Logger.success('Fetching species success');

    Logger.update('Dumping species');
    const dump = species.map((species: string) => ({
      name: species
    }));
    await Species.create(dump);
    Logger.success('Dumping species success');

    Logger.success('Initializing species success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
