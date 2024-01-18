import { Schema } from 'mongoose';
import { TypedRequest } from '../request.interface';
import { TypedResponse } from '../response.interface';
import { ISpecies } from './species.interface';

export interface ILegalTag {
  _id: Schema.Types.ObjectId;
  speciesId: Schema.Types.ObjectId;
  name: string;

  species?: ISpecies;
}

export interface IGetLegalTagsRequest
  extends TypedRequest<object, object, { speciesId?: string; name?: string }> {}

export interface IGetLegalTagsResponse extends TypedResponse<ILegalTag[]> {}
