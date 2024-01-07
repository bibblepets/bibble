import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';

export interface ILegalTag {
  _id: Schema.Types.ObjectId;
  speciesId: ISpecies['_id'];
  name: string;

  species?: ISpecies;
}

export interface IGetLegalTagsRequest
  extends TypedRequest<{}, {}, { speciesId?: string; name?: string }> {}

export interface IGetLegalTagsResponse extends TypedResponse<ILegalTag[]> {}
