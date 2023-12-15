import mongoose, { Schema, Model } from 'mongoose';

export interface IVaccine {
  _id: Schema.Types.ObjectId;
  name: string;
  species?: string;
  isCore: boolean;
}

export interface VaccineModel extends Model<IVaccine> {}

const VaccineSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    species: { type: String, required: true },
    isCore: { type: Boolean, required: true }
  },
  { collection: 'vaccines' }
);

const Vaccine = mongoose.model<IVaccine, VaccineModel>(
  'Vaccine',
  VaccineSchema
);

module.exports = Vaccine;
