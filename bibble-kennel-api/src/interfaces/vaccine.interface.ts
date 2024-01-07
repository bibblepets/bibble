import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';

export interface IVaccine {
  _id: Schema.Types.ObjectId;
  speciesId: ISpecies['_id'];
  name: string;
  isCore: boolean;

  species?: ISpecies;
}
