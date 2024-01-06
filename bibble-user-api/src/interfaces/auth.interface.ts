import { Request, Response } from 'express';
import { TypedResponse } from './response.interface';
import { IUser, IUserResponse } from './user.interface';

export interface IAuthRequest extends Request {
  cookies: {
    authToken: string;
  } & Request['cookies'];
}

export interface IAuthResponse extends TypedResponse<IUserResponse> {}
