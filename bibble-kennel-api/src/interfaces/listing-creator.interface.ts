import { Schema } from 'mongoose';
import { IBreed } from './breed.interface';
import { ISpecies } from './species.interface';
import { ICountry } from '../../src-old/models/country.model';
import { IHairCoat } from './hair-coat.interface';
import { IVaccine } from '../../src-old/models/listing/animal/vaccine.model';
import { IMedia, IMediaResponse } from './media.interface';
import { ILegalTag } from './legal-tag.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';
import { AuthorizedRequest } from './auth.interface';

export interface IListingCreator {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  stage: number;
  saleType: string;
  biology?: IBiologyCreator;
  biography?: IBiographyCreator;
  medical?: IMedicalCreator;
  legal?: ILegalCreator;
  media?: IMedia[];
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IListingCreatorMethods {
  formatResponse(): Promise<IListingCreatorResponse>;
}

export interface IListingCreatorRequest
  extends AuthorizedRequest<IListingCreator> {}

export interface IListingCreatorResponse extends IListingCreator {
  media?: IMediaResponse[];
}

export interface IBiologyCreator {
  speciesId?: Schema.Types.ObjectId;
  breedIds?: Schema.Types.ObjectId[];

  species?: ISpecies;
  breeds?: IBreed[];
}

export interface IBiographyCreator {
  originId?: Schema.Types.ObjectId;

  name?: string;
  origin?: ICountry;
  gender?: string;
  birthdate?: Date;
  description?: string;
}

export interface IMedicalCreator {
  size?: string;
  weight?: number;
  hairCoatId?: Schema.Types.ObjectId;
  vaccineIds?: Schema.Types.ObjectId[];

  hairCoat?: IHairCoat;
  vaccines?: IVaccine[];
}

export interface ILegalCreator {
  avsLicenseNumber?: string;
  legalTagIds?: Schema.Types.ObjectId[];

  legalTags?: ILegalTag[];
}

export interface ICreateListingCreatorRequest
  extends TypedRequest<IListingCreatorRequest> {}

export interface ICreateListingCreatorResponse
  extends TypedResponse<IListingCreatorResponse> {}

export interface ICreateListingRequest
  extends AuthorizedRequest<{}, { _id: string }> {}

export interface ICreateListingResponse extends TypedResponse<{}> {}

export interface IGetMyListingCreatorsRequest extends AuthorizedRequest {}

export interface IGetMyListingCreatorsResponse
  extends TypedResponse<IListingCreatorResponse[]> {}

export interface IGetListingCreatorByIdRequest
  extends AuthorizedRequest<{}, { _id: string }> {}

export interface IGetListingCreatorByIdResponse
  extends TypedResponse<IListingCreatorResponse> {}

export interface IUpdateListingCreatorRequest
  extends AuthorizedRequest<IListingCreator & { _id: string }> {}

export interface IUpdateListingCreatorResponse
  extends TypedResponse<IListingCreatorResponse> {}

export interface IUpdateListingCreatorStageRequest<T>
  extends AuthorizedRequest<T & { _id: string; stage: number }> {}

export interface IUpdateBiologyCreatorRequest
  extends IUpdateListingCreatorStageRequest<IBiologyCreator> {}

export interface IUpdateBiographyCreatorRequest
  extends IUpdateListingCreatorStageRequest<IBiographyCreator> {}

export interface IUpdateMedicalCreatorRequest
  extends IUpdateListingCreatorStageRequest<IMedicalCreator> {}

export interface IUpdateLegalCreatorRequest
  extends IUpdateListingCreatorStageRequest<ILegalCreator> {}

export interface IUpdateMediaCreatorRequest
  extends IUpdateListingCreatorStageRequest<{ mediaNames: string[] }> {}

export interface IUpdatePriceCreatorRequest
  extends IUpdateListingCreatorStageRequest<{ price: number }> {}

export interface IUpdateListingCreatorResponse
  extends TypedResponse<IListingCreatorResponse> {}

export interface IDeleteListingCreatorRequest
  extends AuthorizedRequest<{}, { _id: string }> {}

export interface IDeleteListingCreatorResponse extends TypedResponse<{}> {}
