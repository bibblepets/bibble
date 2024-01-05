import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { IListing } from '../listing/listing.model';
import { IMedia, IPopulatedMedia } from '../listing/media.model';

export interface IBuyerProfile {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  favouriteListings?: IListing['_id'][];
  profilePic?: IMedia['_id'];
  contactNumber?: string;
  address?: IAddress;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedBuyerProfile
  extends Omit<IBuyerProfile, 'favouriteListings' | 'profilePic'> {
  favouriteListings: IListing[];
  profilePic?: IPopulatedMedia;
}

// export type HydratedDocumentBuyerProfile = mongoose.HydratedDocument<IBuyerProfile>;
export interface BuyerProfileModel extends Model<IBuyerProfile> {}

export interface ICreateBuyerProfileRequest extends Request {
  body: Omit<IBuyerProfile, '_id' | 'createdAt' | 'updatedAt'>;
}

export interface IUpdateBuyerProfileRequest extends Request {
  body: Partial<ICreateBuyerProfileRequest['body']>;
}

export interface IAddress {
  country: string;
  streetAddress: string;
  unit: string;
  city: string;
  postcode: string;
}

const buyerProfileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required.']
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required.']
    },
    favouriteListings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: false,
        cast: '{VALUE} is not a valid listing ID.'
      }
    ],
    profilePic: {
      name: {
        type: String,
        required: [true, 'Please specify the name of this media asset.']
      }
    },
    contactNumber: {
      type: String,
      required: false,
      validate: [validateContactNumber, 'Please enter a valid contact number.']
    },
    address: {
      country: { type: String, required: false },
      streetAddress: { type: String, required: false },
      unit: { type: String, required: false },
      city: { type: String, required: false },
      postcode: { type: String, required: false }
    },
    bio: {
      type: String,
      required: false
    }
  },
  { collection: 'buyerProfiles', timestamps: true, versionKey: false }
);

const BuyerProfile = mongoose.model<IBuyerProfile, Model<IBuyerProfile>>(
  'BuyerProfile',
  buyerProfileSchema
);

module.exports = BuyerProfile;

function validateContactNumber(contactNumber: string): boolean {
  console.log(contactNumber);
  return RegExp(/^[0-9\b]+$/).test(contactNumber);
}
