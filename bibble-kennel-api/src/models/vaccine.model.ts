import mongoose, { Model, Schema } from 'mongoose';
import { IVaccine } from '../interfaces/vaccine.interface';

export interface IVaccineModel extends Model<IVaccine> {}

const VaccineSchema = new Schema(
  {
    speciesId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isCore: { type: Boolean, required: true }
  },
  { collection: 'vaccines' }
);

const Vaccine = mongoose.model<IVaccine, IVaccineModel>(
  'Vaccine',
  VaccineSchema
);

module.exports = Vaccine;
