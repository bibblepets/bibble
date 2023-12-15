import mongoose, { Schema, Model } from 'mongoose';

export interface IDogVaccine {
  _id: Schema.Types.ObjectId;
  name: string;
  species?: string;
  isCore: boolean;
}

export interface DogVaccineModel extends Model<IDogVaccine> {}

const dogVaccineSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    species: { type: String, default: 'Dog' },
    isCore: { type: Boolean, required: true }
  },
  { collection: 'dogVaccines' }
);

const DogVaccine = mongoose.model<IDogVaccine, DogVaccineModel>(
  'DogVaccine',
  dogVaccineSchema
);

module.exports = DogVaccine;
