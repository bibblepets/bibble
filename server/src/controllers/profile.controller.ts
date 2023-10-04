import { Request, Response } from 'express';
import { IBusinessProfile } from '../models/user/businessProfile.model';
import { IBuyerProfile } from '../models/user/buyerProfile.model';
import { IUser } from '../models/user/user.model';

const BuyerProfile = require('../models/user/buyerProfile.model');
const BusinessProfile = require('../models/user/businessProfile.model');

const createProfiles = async (
  buyerProfileParams: IBuyerProfile,
  businessProfileParams: IBusinessProfile | undefined
) => {
  const buyerProfile = new BuyerProfile(buyerProfileParams);
  const businessProfile = new BusinessProfile(businessProfileParams);

  let result: {
    buyerProfile: IBuyerProfile | undefined;
    businessProfile: IBusinessProfile | undefined;
  } = {
    buyerProfile: undefined,
    businessProfile: undefined
  };

  await buyerProfile
    .save()
    .then((buyerProfile: IBuyerProfile) => {
      console.log('Buyer Profile created:', buyerProfile._id.toString());
      result['buyerProfile'] = buyerProfile;
    })
    .catch((error: any) => {
      console.log('Error creating Buyer Profile:');
      throw error;
    });

  if (businessProfileParams) {
    await businessProfile
      .save()
      .then((businessProfile: IBusinessProfile) => {
        console.log(
          'Business Profile created:',
          businessProfile._id.toString()
        );
        result['businessProfile'] = businessProfile;
      })
      .catch(async (error: any) => {
        console.log('Error creating Business Profile:');
        await deleteProfiles(buyerProfile, undefined);
        throw error;
      });
  }

  return result;
};

const deleteProfiles = async (
  buyerProfile: IBuyerProfile,
  businessProfile: IBusinessProfile | undefined
) => {
  await BuyerProfile.findByIdAndDelete(buyerProfile._id).then(() =>
    console.log('Buyer Profile deleted:', buyerProfile._id.toString())
  );
  if (businessProfile) {
    await BusinessProfile.findByIdAndDelete(businessProfile._id).then(() =>
      console.log('Business Profile deleted:', businessProfile._id.toString())
    );
  }
};

const updateProfiles = async (
  user: IUser,
  buyerProfileParams: IBuyerProfile | undefined,
  businessProfileParams: IBusinessProfile | undefined
) => {
  if (buyerProfileParams) {
    await BuyerProfile.findByIdAndUpdate(user.buyerProfile, {
      ...buyerProfileParams
    })
      .then((updatedBuyerProfile: IBuyerProfile) =>
        console.log('Buyer Profile updated:', updatedBuyerProfile._id.toString())
      )
      .catch((error: any) => {
        console.log('Error updating Buyer Profile:');
        console.log(error);
        throw error;
      });
  }
  if (businessProfileParams) {
    await BusinessProfile.findByIdAndUpdate(user.businessProfile, {
      ...businessProfileParams
    })
      .then((updatedBusinessProfile: IBusinessProfile) =>
        console.log('Business Profile updated:', updatedBusinessProfile._id.toString())
      )
      .catch((error: any) => {
        console.log('Error updating Business Profile:');
        throw error;
      });
  }
};

module.exports = {
  createProfiles,
  deleteProfiles,
  updateProfiles
};
