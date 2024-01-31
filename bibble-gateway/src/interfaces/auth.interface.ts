import { Schema } from 'mongoose';
import { IForwardRequest } from './forward.interface';

export interface IAuthorizedRequest<T = object, P = object>
  extends IForwardRequest<
    T & { email: string },
    P,
    object,
    object,
    { _id: Schema.Types.ObjectId }
  > {}

export interface IUserAuthorizedRequest<T = object>
  extends IAuthorizedRequest<T, { userId: string }> {}

export interface IBusinessAuthorizedRequest<T = object>
  extends IAuthorizedRequest<T, { businessId: string }> {}
