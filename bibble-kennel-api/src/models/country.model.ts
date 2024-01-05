import { Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';

export interface ICountry {
  _id: Schema.Types.ObjectId;
  name: string;
}

export interface IGetAllCountriesOfOriginRequest extends Request {}

export interface CountryModel extends Model<ICountry> {}

const countrySchema = new Schema(
  {
    name: { type: String, required: [true, 'Please provide the name of this country.'] },
  },
  { collection: "countries" }
);

const Country = mongoose.model<ICountry, CountryModel>(
  "Country",
  countrySchema
);

module.exports = Country;