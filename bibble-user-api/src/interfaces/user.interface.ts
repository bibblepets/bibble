import { ParamsDictionary } from 'express-serve-static-core';
import { Schema } from 'mongoose';
import { IAddress } from './address.interface';
import { IMedia, IMediaResponse } from './media.interface';
import { TypedRequest } from './request.interface';
import { TypedResponse } from './response.interface';

export interface IUser {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  address?: IAddress;
  profilePic?: IMedia;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  isCorrectPassword(password: string): boolean;
  formatResponse(): Promise<IUserResponse>;
}

export interface IUserRequest<T, P = ParamsDictionary>
  extends TypedRequest<T, P & { userId: string }> {}

export interface IUserResponse extends Omit<IUser, 'password'> {
  password?: string;
  profilePic?: IMediaResponse;
}
export interface IRegisterUserRequest extends TypedRequest<IUser> {}

export interface IRegisterUserResponse extends TypedResponse<IUserResponse> {}

export interface ILoginUserRequest extends TypedRequest<IUser> {}

export interface ILoginUserResponse extends TypedResponse<IUserResponse> {}

export interface ILogoutUserRequest extends TypedRequest {}

export interface ILogoutUserResponse extends TypedResponse<string> {}

export interface IGetUserRequest
  extends TypedRequest<object, { userId: string }> {}

export interface IGetUserResponse extends TypedResponse<IUserResponse> {}

export interface IUpdateUserRequest extends IUserRequest<Partial<IUser>> {}

export interface IUpdateUserResponse extends TypedResponse<IUserResponse> {}

export interface IUpdateUserProfilePictureRequest
  extends IUserRequest<{ media: string }> {
  file?: Express.Multer.File;
}

export interface IUpdateUserProfilePictureResponse
  extends TypedResponse<IUserResponse> {}
