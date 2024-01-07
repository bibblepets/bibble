import mongoose, { Model, Schema } from 'mongoose';
import { ICountry } from '../interfaces/country.interface';

export interface ICountryModel extends Model<ICountry> {}

const CountrySchema = new Schema(
  {
    name: { type: String, required: true, unique: true }
  },
  { collection: 'countries' }
);

const Country = mongoose.model<ICountry, ICountryModel>(
  'Country',
  CountrySchema
);

module.exports = Country;
