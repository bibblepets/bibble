import { Schema } from 'mongoose';
import { IAddress } from './address.interface';
import { IMedia, IMediaResponse } from './media.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';

export interface IBusiness {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: IAddress;
  media: IMedia[];
  description: string;
  instagramLink?: string;
  facebookLink?: string;
  websiteLink?: string;

  listingIds: Schema.Types.ObjectId[];
  reviewIds: Schema.Types.ObjectId[];
  rating: number;
  ratingCount: number;
  licenseNumber: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBusinessMethods {
  isCorrectPassword(password: string): boolean;
  formatResponse(): Promise<IBusinessResponse>;
}

export interface IBusinessResponse
  extends Omit<IBusiness, 'password' | 'media'> {
  password?: string;
  media: IMediaResponse[];
}

export interface IRegisterBusinessRequest extends TypedRequest<IBusiness> {}

export interface IRegisterBusinessResponse
  extends TypedResponse<IBusinessResponse> {}

export interface ILoginBusinessRequest
  extends TypedRequest<Pick<IBusiness, 'email' | 'password'>> {}

export interface ILoginBusinessResponse
  extends TypedResponse<IBusinessResponse> {}
