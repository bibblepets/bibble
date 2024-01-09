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
import { IAuthorizedRequest } from './auth.interface';

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
  extends IAuthorizedRequest<IListingCreator> {}

export interface IListingCreatorResponse extends IListingCreator {
  media?: IMediaResponse[];
}

export interface IBiologyCreator {
  speciesId?: ISpecies['_id'];
  breedIds?: IBreed['_id'][];

  species?: ISpecies;
  breeds?: IBreed[];
}

export interface IBiographyCreator {
  originId?: ICountry['_id'];

  name?: string;
  origin?: ICountry;
  gender?: string;
  birthdate?: Date;
  description?: string;
}

export interface IMedicalCreator {
  size?: string;
  weight?: number;
  hairCoatId?: IHairCoat['_id'];
  vaccineIds?: IVaccine['_id'][];

  hairCoat?: IHairCoat;
  vaccines?: IVaccine[];
}

export interface ILegalCreator {
  avsLicenseNumber?: string;
  legalTagIds?: ILegalTag['_id'][];

  legalTags?: ILegalTag[];
}

export interface IGetListingCreatorsRequest extends IAuthorizedRequest {}

export interface IGetListingCreatorsResponse
  extends TypedResponse<IListingCreatorResponse[]> {}

export interface IGetListingCreatorByIdRequest
  extends IAuthorizedRequest<{}, { id: string }> {}

export interface IGetListingCreatorByIdResponse
  extends TypedResponse<IListingCreatorResponse> {}

export interface ICreateListingCreatorRequest
  extends TypedRequest<IListingCreatorRequest> {}

export interface ICreateListingCreatorResponse
  extends TypedResponse<IListingCreatorResponse> {}

export interface IUpdateListingCreatorStageRequest<T>
  extends IAuthorizedRequest<T & { _id: string; stage: number }> {}

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
