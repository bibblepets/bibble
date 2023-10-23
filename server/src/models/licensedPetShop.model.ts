import { Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';

export interface ILicensedPetShop {
  _id: Schema.Types.ObjectId;
  licenseNumber: string;
  name: string;
  address: string;
}

export interface LicensedPetShopModel extends Model<ILicensedPetShop> {
  verifyLicense(licenseNumber: string): Promise<boolean>;
}

const licensedPetShopSchema = new Schema(
  {
    licenseNumber: {
      type: String,
      immutable: true,
      required: [true, 'Please specify the license number of this pet shop.']
    },
    name: {
      type: String,
      required: [true, 'Please specify the name of this pet shop.']
    },
    address: {
      type: String,
      required: [true, 'Please specify the address of this pet shop.']
    }
  },
  { collection: 'licensedPetShops' }
);

licensedPetShopSchema.statics.verifyLicense = async function (
  licenseNumber: string
): Promise<boolean> {
  const licensedPetShop = await this.findOne({ licenseNumber: licenseNumber });
  return !!licensedPetShop;
};

const LicensedPetShop = mongoose.model<ILicensedPetShop, LicensedPetShopModel>(
  'LicensedPetShop',
  licensedPetShopSchema
);

module.exports = LicensedPetShop;
