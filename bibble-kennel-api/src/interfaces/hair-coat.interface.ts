import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';

export interface IHairCoat {
  _id: Schema.Types.ObjectId;
  speciesId: Schema.Types.ObjectId;
  name: string;

  species?: ISpecies;
}

export interface IGetHairCoatsRequest
  extends TypedRequest<{}, {}, { speciesId?: string; name?: string }> {}

export interface IGetHairCoatsResponse extends TypedResponse<IHairCoat[]> {}
