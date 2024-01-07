import { Schema } from 'mongoose';

export interface ISpecies {
  _id: Schema.Types.ObjectId;
  name: string;
}
