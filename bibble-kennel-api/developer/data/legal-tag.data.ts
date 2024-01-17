import { Schema } from 'mongoose';
import { ISpecies } from '../../src/interfaces/species.interface';
import LegalTag from '../../src/models/legal-tag.model';
import Species from '../../src/models/species.model';
import { Logger } from '../../src/services/logger';
import { catLegalTags } from '../static/cats';
import { dogLegalTags } from '../static/dogs';

export const initLegalTags = async () => {
  Logger.update('Initializing legal tags');

  const species = await Species.find();

  await Promise.all(
    species.map(async (s: ISpecies) => {
      if (s.name === 'dog') {
        await initDogLegalTags(s._id);
      } else if (s.name === 'cat') {
        await initCatLegalTags(s._id);
      }
    })
  );

  Logger.success('Initializing legal tags success');
};

export const initDogLegalTags = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing dog legal tags');
    const legalTags = dogLegalTags;
    Logger.success('Fetching dog legal tags success');

    Logger.update('Dumping dog legal tags');
    const dump = legalTags.map((legalTag: string) => ({
      speciesId,
      name: legalTag
    }));
    await LegalTag.create(dump);
    Logger.success('Dumping dog legal tags success');

    Logger.success('Initializing dog legal tags success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};

export const initCatLegalTags = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing cat legal tags');
    const legalTags = catLegalTags;
    Logger.success('Fetching cat legal tags success');

    Logger.update('Dumping cat legal tags');
    const dump = legalTags.map((legalTag: string) => ({
      speciesId,
      name: legalTag
    }));
    await LegalTag.create(dump);
    Logger.success('Dumping cat legal tags success');

    Logger.success('Initializing cat legal tags success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
