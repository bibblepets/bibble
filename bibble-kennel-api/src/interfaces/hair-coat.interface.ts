import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';

export interface IHairCoat {
  _id: Schema.Types.ObjectId;
  speciesId: ISpecies['_id'];
  name: string;

  species?: ISpecies;
}
