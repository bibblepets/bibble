import { Request } from 'express';
import { TypedResponse } from './response.interface';
import { IUserResponse } from './user.interface';

export interface IAuthRequest extends Request {
  params: {
    userId: string;
  };
}

export interface IAuthResponse extends TypedResponse<IUserResponse> {}
