import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { LicensedPetShopModel } from '../licensedPetShop.model';

export const bibbleTiers = ['Basic', 'Verified', 'Partner', 'Super'];

export interface IBusinessProfile {
  _id: Schema.Types.ObjectId;
  bibbleTier: string;
  businessName?: string;
  businessPic?: string;
  businessBio?: string;
  businessAddress?: string;
  businessContact?: string;
  businessEmail?: string;
  petShopLicenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// export type HydratedDocumentBusinessProfile = mongoose.HydratedDocument<IBusinessProfile>;
export interface BusinessProfileModel extends Model<IBusinessProfile> {}

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
      required: false
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
      required: false
    },
    businessContact: {
      type: String,
      required: false
    },
    businessEmail: {
      type: String,
      required: false,
      validate: [validateEmail, 'Please enter a valid business email address.']
    },
    petShopLicenseNumber: {
      type: String,
      required: [
        function (this: IBusinessProfile) {
          return this.bibbleTier !== 'Basic';
        },
        'A Pet shop license number is required for tiers above `Basic`.'
      ],
      immutable: true,
      validate: [
        validatePetShopLicenseNumber,
        'Please enter a valid pet shop license.'
      ]
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

module.exports = BusinessProfile;

function validateEmail(email: string): boolean {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/
  ).test(String(email).toLowerCase());
}

async function validatePetShopLicenseNumber(
  licenseNumber: string
): Promise<boolean> {
  const LicensedPetShop: LicensedPetShopModel = require('../licensedPetShop.model');
  return await LicensedPetShop.verifyLicense(licenseNumber);
}
