import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';
import { TypedRequest } from '../request.interface';
import { TypedResponse } from '../response.interface';

export interface IVaccine {
  _id: Schema.Types.ObjectId;
  speciesId: Schema.Types.ObjectId;
  name: string;
  isCore: boolean;

  species?: ISpecies;
}

export interface IGetVaccinesRequest
  extends TypedRequest<
    {},
    {},
    { speciesId?: string; name?: string; isCore?: boolean }
  > {}

export interface IGetVaccinesResponse extends TypedResponse<IVaccine[]> {}
