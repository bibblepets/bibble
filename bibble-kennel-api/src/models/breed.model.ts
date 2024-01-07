import mongoose, { Model, Schema } from 'mongoose';
import { IBreed } from '../interfaces/breed.interface';

export interface IBreedModel extends Model<IBreed> {}

const BreedSchema = new Schema(
  {
    speciesId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true }
  },
  { collection: 'breeds' }
);

const Breed = mongoose.model<IBreed, IBreedModel>('Breed', BreedSchema);

module.exports = Breed;
