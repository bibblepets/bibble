import { Schema } from 'mongoose';
import { IForwardRequest } from './forward.interface';

export interface IAuthorizedRequest<T = object>
  extends IForwardRequest<
    T & { email: string },
    { userId: string },
    object,
    object,
    { _id: Schema.Types.ObjectId }
  > {}
