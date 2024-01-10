import { Schema } from 'mongoose';
import { IMedia } from './media.interface';
import { IAddress } from './address.interface';

export interface IUser {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  address?: IAddress;
  profilePic?: IMedia;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
