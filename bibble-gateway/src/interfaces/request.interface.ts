import { Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export interface TypedRequest<T = object, P = object, Q = object, R = object>
  extends Request<P, R, T, Q> {
  body: T;
  params: ParamsDictionary & P;
  query: Query & Q;
}
