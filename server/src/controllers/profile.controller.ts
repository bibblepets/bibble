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
      console.log(
        'Buyer Profile created:',
        buyerProfile._id.toString()
      );
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

const updateProfiles = async (req: Request) => {
  let result: {
    buyerProfile: IBuyerProfile | undefined;
    businessProfile: IBusinessProfile | undefined;
  } = {
    buyerProfile: undefined,
    businessProfile: undefined
  };

  if (req.body.buyerProfile) {
    await updateBuyerProfile(req).then(
      (buyerProfile: IBuyerProfile) =>
        (result['buyerProfile'] = buyerProfile)
    );
  }

  if (req.body.businessProfile) {
    await updateBusinessProfile(req).then(
      (businessProfile: IBusinessProfile) =>
        (result['businessProfile'] = businessProfile)
    );
  }

  return result;
};

const updateBuyerProfile = async (req: Request) => {
  const { buyerProfileId } = req.params;

  return await BuyerProfile.findByIdAndUpdate(
    buyerProfileId,
    req.body.buyerProfile,
    {
      new: true,
      runValidators: true
    }
  )
    .then((buyerProfile: IBuyerProfile) => {
      console.log('Buyer Profile updated:', buyerProfile._id.toString());
      return buyerProfile;
    })
    .catch((error: any) => {
      console.log('Error updating Buyer Profile:');
      throw error;
    });
};

const updateBusinessProfile = async (req: Request) => {
  const { businessProfileId } = req.params;

  return await BusinessProfile.findByIdAndUpdate(
    businessProfileId,
    req.body.businessProfile,
    {
      new: true,
      runValidators: true
    }
  )
    .then((businessProfile: IBusinessProfile) => {
      console.log('Business Profile updated:', businessProfile._id.toString());
      return businessProfile;
    })
    .catch((error: any) => {
      console.log('Error updating Business Profile:');
      throw error;
    });
};

module.exports = {
  createProfiles,
  deleteProfiles,
  updateProfiles
};
