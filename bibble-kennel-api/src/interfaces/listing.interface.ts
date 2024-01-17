import { Schema } from 'mongoose';
import { AuthorizedRequest } from './auth.interface';
import { IBreed } from './breed.interface';
import { ICountry } from './country.interface';
import { IHairCoat } from './hair-coat.interface';
import { ILegalTag } from './legal-tag.interface';
import { IMedia, IMediaResponse } from './media.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';
import { ISpecies } from './species.interface';
import { IVaccine } from './vaccine.interface';

export interface IListing {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  speciesId: Schema.Types.ObjectId;
  breedIds: Schema.Types.ObjectId[];
  originId: Schema.Types.ObjectId;
  hairCoatId: Schema.Types.ObjectId;
  vaccineIds: Schema.Types.ObjectId[];
  legalTagIds: Schema.Types.ObjectId[];
  saleType: string;
  name?: string;
  gender: string;
  birthdate: Date;
  description: string;
  size: string;
  weight: number;
  avsLicenseNumber: string;
  price: number;
  media: IMedia[];
  createdAt?: Date;
  updatedAt?: Date;

  species?: ISpecies;
  breeds?: IBreed[];
  origin?: ICountry;
  hairCoat?: IHairCoat;
  vaccines?: IVaccine[];
  legalTags?: ILegalTag[];
}

export interface IListingMethods {
  formatResponse(): Promise<IListingResponse>;
}

export interface IListingRequest extends AuthorizedRequest<IListing> {}

export interface IListingResponse extends IListing {
  media: IMediaResponse[];
}

export interface IGetListingsRequest
  extends TypedRequest<object, object, { speciesId?: string; name?: string }> {}

export interface IGetListingsResponse
  extends TypedResponse<IListingResponse[]> {}

export interface IGetMyListingsRequest extends AuthorizedRequest {}

export interface IGetMyListingsResponse
  extends TypedResponse<IListingResponse[]> {}

export interface IGetListingByIdRequest
  extends AuthorizedRequest<object, { _id: string }> {}

export interface IGetListingByIdResponse
  extends TypedResponse<IListingResponse> {}

export interface IUpdateListingRequest
  extends AuthorizedRequest<IListing, { _id: string }> {}

export interface IUpdateListingResponse
  extends TypedResponse<IListingResponse> {}

export interface IUpdateListingMediaRequest
  extends AuthorizedRequest<{ mediaNames: string[] }, { _id: string }> {}

export interface IUpdateListingMediaResponse
  extends TypedResponse<IListingResponse> {}
