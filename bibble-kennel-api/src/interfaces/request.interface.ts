import { Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export interface TypedRequest<
  T = object,
  P = ParamsDictionary,
  Q = Query,
  R = object
> extends Request<P, R, T, Q> {
  body: T;
  params: P;
  query: Q;
}
