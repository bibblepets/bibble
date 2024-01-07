import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';

export interface IBreed {
  _id: Schema.Types.ObjectId;
  speciesId: ISpecies['_id'];
  name: string;

  species?: ISpecies;
}
