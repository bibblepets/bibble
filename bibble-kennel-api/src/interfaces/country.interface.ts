import { Schema } from 'mongoose';

export interface ICountry {
  _id: Schema.Types.ObjectId;
  name: string;
}
