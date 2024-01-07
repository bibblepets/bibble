import mongoose, { Model, Schema } from 'mongoose';
import { ISpecies } from '../interfaces/species.interface';

export interface ISpeciesModel extends Model<ISpecies> {}

const SpeciesSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  { collection: 'species' }
);

const Species = mongoose.model<ISpecies, ISpeciesModel>(
  'Species',
  SpeciesSchema
);

module.exports = Species;
