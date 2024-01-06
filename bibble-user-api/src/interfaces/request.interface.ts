import { Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export interface TypedRequest<T = any, P = ParamsDictionary, Q = Query>
  extends Request<P, any, T, Q> {
  body: T;
  params: P;
  query: Q;
}
