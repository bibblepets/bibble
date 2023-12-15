import mongoose, { Schema, Model } from 'mongoose';

export interface IBreed {
  _id: Schema.Types.ObjectId;
  name: string;
  species?: string;
}

export interface BreedModel extends Model<IBreed> {}

const breedSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    species: { type: String, required: true }
  },
  { collection: 'breeds' }
);

const Breed = mongoose.model<IBreed, BreedModel>(
  'Breed',
  breedSchema
);

module.exports = Breed;
