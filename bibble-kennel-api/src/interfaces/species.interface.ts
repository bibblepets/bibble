import { Schema } from 'mongoose';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';

export interface ISpecies {
  _id: Schema.Types.ObjectId;
  name: string;
}

export interface IGetSpeciesRequest
  extends TypedRequest<object, object, { name?: string }> {}

export interface IGetSpeciesResponse extends TypedResponse<ISpecies[]> {}
