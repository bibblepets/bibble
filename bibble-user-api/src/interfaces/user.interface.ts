import { Schema } from 'mongoose';
import { IMedia } from './media.interface';
import { IAddress } from './address.interface';
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
  populateProfilePic(): Promise<IUser>;
  populateAll(): Promise<IUser>;
}

export interface IUserResponse extends Omit<IUser, 'password'> {
  password?: string;
}
export interface IRegisterUserRequest extends TypedRequest<IUser> {}

export interface IRegisterUserResponse extends TypedResponse<IUserResponse> {}

export interface ILoginUserRequest extends TypedRequest<IUser> {}

export interface ILoginUserResponse extends TypedResponse<IUserResponse> {}

export interface ILogoutUserRequest extends TypedRequest<{}> {}

export interface ILogoutUserResponse extends TypedResponse<string> {}
