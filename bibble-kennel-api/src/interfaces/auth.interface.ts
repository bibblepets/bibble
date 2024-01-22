import { ParamsDictionary, Query } from 'express-serve-static-core';
import { TypedRequest } from './request.interface';

export interface AuthorizedRequest<T = object, P = ParamsDictionary, Q = Query>
  extends TypedRequest<T, P & { userId: string }, Q> {}
