import { ParamsDictionary } from 'express-serve-static-core';
import { TypedRequest } from './request.interface';

export interface IAuthorizedRequest<T>
  extends TypedRequest<T & { userId: string }> {}
