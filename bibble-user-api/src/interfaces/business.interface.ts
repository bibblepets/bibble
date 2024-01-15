import { Schema } from 'mongoose';
import { IAddress } from './address.interface';
import { IMedia } from './media.interface';

export interface IBusiness {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  contactNumber: string;
  address: IAddress;
  opensAt: Date;
  closesAt: Date;
  instagramLink: string;
  facebookLink: string;
  websiteLink: string;
  media: IMedia[];
  description: string;

  ownerId: Schema.Types.ObjectId;
  adminIds: Schema.Types.ObjectId[];
  listingIds: Schema.Types.ObjectId[];
  reviewIds: Schema.Types.ObjectId[];
  rating: number;
  ratingCount: number;
  licenseNumber: string;

  createdAt?: Date;
  updatedAt?: Date;
}
