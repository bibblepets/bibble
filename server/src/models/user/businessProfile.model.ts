import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';

export const bibbleTiers = ['Basic', 'Verified', 'Partner', 'Super'];

export interface IBusinessProfile {
  _id: Schema.Types.ObjectId;
  bibbleTier: string;
  businessName: string;
  businessPic?: string;
  businessBio?: string;
  businessAddress: string;
  businessContact: string;
  businessEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HydratedDocumentBusinessProfile = mongoose.HydratedDocument<IBusinessProfile>;

export interface ICreateOrUpdateBusinessProfileRequest extends Request {
  body: Omit<IBusinessProfile, '_id' | 'createdAt' | 'updatedAt'>;
}

const businessProfileSchema = new Schema(
  {
    bibbleTier: {
      type: String,
      enum: {
        values: bibbleTiers,
        message: 'Bibble Tier of `{VALUE}` is invalid.'
      },
      required: [true, 'Bibble Tier is required.']
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required.']
    },
    businessPic: {
      type: String,
      required: false
    },
    businessBio: {
      type: String,
      required: false
    },
    businessAddress: {
      type: String,
      required: [true, 'Business address is required.']
    },
    businessContact: {
      type: String,
      required: [true, 'Business contact number is required.']
    },
    businessEmail: {
      type: String,
      required: [true, 'Business email is required.'],
      validate: [validateEmail, 'Please enter a valid business email address.']
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now()
    },
    updatedAt: {
      type: Date,
      default: () => Date.now()
    }
  },
  { collection: 'businessProfiles', timestamps: true, versionKey: false }
);

const BusinessProfile = mongoose.model<
  IBusinessProfile,
  Model<IBusinessProfile>
>('BusinessProfile', businessProfileSchema);

export default BusinessProfile;

function validateEmail(email: string): boolean {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/
  ).test(String(email).toLowerCase());
}
