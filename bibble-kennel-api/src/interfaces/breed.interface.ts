import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';

export interface IBreed {
  _id: Schema.Types.ObjectId;
  speciesId: Schema.Types.ObjectId;
  name: string;

  species?: ISpecies;
}

export interface IGetBreedsRequest
  extends TypedRequest<{}, {}, { speciesId?: string; name?: string }> {}

export interface IGetBreedsResponse extends TypedResponse<IBreed[]> {}
