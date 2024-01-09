import { ParamsDictionary, Query } from 'express-serve-static-core';
import { TypedRequest } from './request.interface';

export interface IAuthorizedRequest<T = {}, P = ParamsDictionary, Q = Query>
  extends TypedRequest<T & { userId: string }, P, Q> {}
