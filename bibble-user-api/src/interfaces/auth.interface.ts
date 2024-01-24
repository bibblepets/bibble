import { Request } from 'express';
import { IBusinessResponse } from './business.interface';
import { TypedResponse } from './response.interface';
import { IUserResponse } from './user.interface';

export interface IAuthUserRequest extends Request {
  params: {
    userId: string;
  };
}

export interface IAuthUserResponse extends TypedResponse<IUserResponse> {}

export interface IAuthBusinessRequest extends Request {
  params: {
    businessId: string;
  };
}

export interface IAuthBusinessResponse
  extends TypedResponse<IBusinessResponse> {}
