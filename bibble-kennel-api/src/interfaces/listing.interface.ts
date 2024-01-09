import { Schema } from 'mongoose';
import { ISpecies } from './species.interface';
import { IBreed } from './breed.interface';
import { ICountry } from './country.interface';
import { IHairCoat } from './hair-coat.interface';
import { IVaccine } from './vaccine.interface';
import { ILegalTag } from './legal-tag.interface';
import { IMedia, IMediaResponse } from './media.interface';
import { AuthorizedRequest } from './auth.interface';
import { TypedResponse } from './response.interface';

export interface IListing {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  speciesId: ISpecies['_id'];
  breedIds: IBreed['_id'][];
  originId: ICountry['_id'];
  hairCoatId: IHairCoat['_id'];
  vaccineIds: IVaccine['_id'][];
  legalTagIds: ILegalTag['_id'][];
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

export interface IGetMyListingsRequest extends AuthorizedRequest {}

export interface IGetMyListingsResponse
  extends TypedResponse<IListingResponse[]> {}
