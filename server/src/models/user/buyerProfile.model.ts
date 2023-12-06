import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { IPetListing } from '../listing/petListing.model';

export interface IBuyerProfile {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  favouriteListings?: IPetListing['_id'][];
  profilePic?: string;
  contactNumber?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// export type HydratedDocumentBuyerProfile = mongoose.HydratedDocument<IBuyerProfile>;
export interface BuyerProfileModel extends Model<IBuyerProfile> {}

export interface ICreateBuyerProfileRequest extends Request {
  body: Omit<IBuyerProfile, '_id' | 'createdAt' | 'updatedAt'>;
}

export interface IUpdateBuyerProfileRequest extends Request {
  body: Partial<ICreateBuyerProfileRequest['body']>;
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
      type: String,
      required: false
    },
    contactNumber: {
      type: String,
      required: false,
      validate: [validateContactNumber, 'Please enter a valid contact number.']
    },
    bio: {
      type: String,
      equired: false
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
  return RegExp(/^\+\d{1,3}\s?\d{8,}$/).test(contactNumber);
}
