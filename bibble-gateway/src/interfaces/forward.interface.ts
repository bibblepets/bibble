import { IAuthorizedRequest } from './auth.interface';
import { TypedRequest } from './request.interface';

export interface IForwardRequest<
  T = object,
  P = object,
  Q = object,
  R = object,
  S = object
> extends TypedRequest<T, P, Q, R> {
  payload?: S;
}

export interface IForwardFileRequest
  extends IAuthorizedRequest<{ media?: string | string[] }> {}
