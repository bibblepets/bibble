import { Schema } from 'mongoose';
import { ILegalTagModel } from '../../src/models/legal-tag.model';
import { ISpeciesModel } from '../../src/models/species.model';
import { Logger } from '../../src/services/logger';
import { dogLegalTags } from '../static/dogs';
import { catLegalTags } from '../static/cats';

const Species: ISpeciesModel = require('../../src/models/species.model');
const LegalTag: ILegalTagModel = require('../../src/models/legal-tag.model');

export const initLegalTags = async () => {
  Logger.update('Initializing legal tags');

  const species = await Species.find();

  await Promise.all(
    species.map(async (s: any) => {
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
    const dump = legalTags.map((legalTag: any) => ({
      speciesId,
      name: legalTag
    }));
    await LegalTag.create(dump);
    Logger.success('Dumping dog legal tags success');

    Logger.success('Initializing dog legal tags success');
  } catch (error: any) {
    throw new Error(error);
  }
};

export const initCatLegalTags = async (speciesId: Schema.Types.ObjectId) => {
  try {
    Logger.update('Initializing cat legal tags');
    const legalTags = catLegalTags;
    Logger.success('Fetching cat legal tags success');

    Logger.update('Dumping cat legal tags');
    const dump = legalTags.map((legalTag: any) => ({
      speciesId,
      name: legalTag
    }));
    await LegalTag.create(dump);
    Logger.success('Dumping cat legal tags success');

    Logger.success('Initializing cat legal tags success');
  } catch (error: any) {
    throw new Error(error);
  }
};
