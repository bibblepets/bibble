import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';

export interface IBuyerProfile {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  favouriteListings?: Schema.Types.ObjectId[] | undefined;
  profilePic?: string | undefined;
  contactNumber?: string | undefined;
  bio?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

// export type HydratedDocumentBuyerProfile = mongoose.HydratedDocument<IBuyerProfile>;
export interface BuyerProfileModel extends Model<IBuyerProfile> {}

export interface ICreateOrUpdateBuyerProfileRequest extends Request {
  body: Omit<IBuyerProfile, '_id' | 'createdAt' | 'updatedAt'>;
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
      type: Number,
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

function validateContactNumber(contactNumber: number): boolean {
  return RegExp(/^\d{8,}$/).test(String(contactNumber));
}
