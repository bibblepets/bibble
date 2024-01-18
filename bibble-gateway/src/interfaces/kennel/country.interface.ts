import { Schema } from 'mongoose';
import { TypedRequest } from '../request.interface';
import { TypedResponse } from '../response.interface';

export interface ICountry {
  _id: Schema.Types.ObjectId;
  name: string;
}

export interface IGetCountriesRequest
  extends TypedRequest<object, object, { name?: string }> {}

export interface IGetCountriesResponse extends TypedResponse<ICountry[]> {}
