import mongoose, { Schema, Model } from 'mongoose';

export interface IDogBreed {
  _id: Schema.Types.ObjectId;
  name: string;
  species?: string;
}

export interface DogBreedModel extends Model<IDogBreed> {}

const dogBreedSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    species: { type: String, default: 'Dog' }
  },
  { collection: 'dogBreeds' }
);

const DogBreed = mongoose.model<IDogBreed, DogBreedModel>(
  'DogBreed',
  dogBreedSchema
);

module.exports = DogBreed;
