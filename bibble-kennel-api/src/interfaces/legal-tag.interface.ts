import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';

export interface ILegalTag {
  _id: Schema.Types.ObjectId;
  speciesId: ISpecies['_id'];
  name: string;

  species?: ISpecies;
}
