import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { LicensedPetShopModel } from '../licensed-pet-shop.model';

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

export interface IPopulatedBusinessProfile extends IBusinessProfile {}

// export type HydratedDocumentBusinessProfile = mongoose.HydratedDocument<IBusinessProfile>;
export interface BusinessProfileModel extends Model<IBusinessProfile> {}

export interface ICreateBusinessProfileRequest extends Request {
  body: Omit<IBusinessProfile, '_id' | 'createdAt' | 'updatedAt'>;
}

export interface IUpdateBusinessProfileRequest extends Request {
  body: Partial<ICreateBusinessProfileRequest['body']>;
}

const businessProfileSchema = new Schema(
  {
    bibbleTier: {
      type: String,
      enum: {
        values: bibbleTiers,
        message: 'Bibble Tier of `{VALUE}` is invalid.'
      },
      default: 'Basic'
    },
    businessName: {
      type: String,
      required: [
        function (this: IBusinessProfile) {
          return this.bibbleTier !== 'Basic';
        },
        'A business name is required for business tiers above `Basic`.'
      ]
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
      required: [
        function (this: IBusinessProfile) {
          return this.bibbleTier !== 'Basic';
        },
        'A business address is required for business tiers above `Basic`.'
      ]
    },
    businessContact: {
      type: String,
      required: [
        function (this: IBusinessProfile) {
          return this.bibbleTier !== 'Basic';
        },
        'A business contact number is required for business tiers above `Basic`.'
      ],
      validate: [validateContactNumber, 'Please enter a valid contact number.']
    },
    businessEmail: {
      type: String,
      required: [
        function (this: IBusinessProfile) {
          return this.bibbleTier !== 'Basic';
        },
        'A business email is required for business tiers above `Basic`.'
      ],
      validate: [validateEmail, 'Please enter a valid business email address.']
    },
    petShopLicenseNumber: {
      type: String,
      required: [
        function (this: IBusinessProfile) {
          return this.bibbleTier !== 'Basic';
        },
        'A Pet shop license number is required for business tiers above `Basic`.'
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
  const LicensedPetShop: LicensedPetShopModel = require('../licensed-pet-shop.model');
  return await LicensedPetShop.verifyLicense(licenseNumber);
}

function validateContactNumber(contactNumber: string): boolean {
  return RegExp(/^\+\d{1,3}\s?\d{8,}$/).test(contactNumber);
}
