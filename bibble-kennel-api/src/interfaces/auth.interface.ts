import { ParamsDictionary, Query } from 'express-serve-static-core';
import { TypedRequest } from './request.interface';

export interface AuthorizedRequest<T = {}, P = ParamsDictionary, Q = Query>
  extends TypedRequest<T & { userId: string }, P, Q> {}
