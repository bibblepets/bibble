import { Request, Response } from 'express';
import { IBusinessProfile } from '../models/user/businessProfile.model';
import { IBuyerProfile } from '../models/user/buyerProfile.model';

const BuyerProfile = require('../models/user/buyerProfile.model');
const BusinessProfile = require('../models/user/businessProfile.model');

const createBuyerProfile = async (req: Request): Promise<IBuyerProfile> => {
  const buyerProfile = new BuyerProfile(req.body.buyerProfile);

  return await buyerProfile
    .save()
    .then((buyerProfile: IBuyerProfile) => {
      console.log('Buyer Profile created:', buyerProfile._id.toString());
      return buyerProfile;
    })
    .catch((error: any) => {
      console.log('Error creating Buyer Profile:');
      throw error;
    });
};

const createBusinessProfile = async (req: Request): Promise<IBusinessProfile> => {
  const businessProfile = new BusinessProfile(req.body.businessProfile);

  return await businessProfile
    .save()
    .then((businessProfile: IBusinessProfile) => {
      console.log('Business Profile created:', businessProfile._id.toString());
      return businessProfile;
    })
    .catch((error: any) => {
      console.log('Error creating Business Profile:');
      throw error;
    });
};

const deleteProfiles = async (req: Request): Promise<void> => {
  const { buyerProfileId, businessProfileId } = req.params;
  await BuyerProfile.findByIdAndDelete(buyerProfileId).then(
    (buyerProfile: IBuyerProfile) =>
      console.log('Buyer Profile deleted:', buyerProfile._id.toString())
  );
  if (businessProfileId) {
    await BusinessProfile.findByIdAndDelete(businessProfileId).then(
      (businessProfile: IBusinessProfile) =>
        console.log('Business Profile deleted:', businessProfile._id.toString())
    );
  }
};

const updateProfiles = async (req: Request): Promise<{
  buyerProfile: IBuyerProfile | undefined;
  businessProfile: IBusinessProfile | undefined;
}> => {
  let result: {
    buyerProfile: IBuyerProfile | undefined;
    businessProfile: IBusinessProfile | undefined;
  } = {
    buyerProfile: undefined,
    businessProfile: undefined
  };

  if (req.body.buyerProfile) {
    await updateBuyerProfile(req).then(
      (buyerProfile: IBuyerProfile) => (result['buyerProfile'] = buyerProfile)
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

const updateBuyerProfile = async (req: Request): Promise<IBuyerProfile> => {
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

const updateBusinessProfile = async (
  req: Request
): Promise<IBusinessProfile> => {
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
  createBuyerProfile,
  createBusinessProfile,
  deleteProfiles,
  updateBuyerProfile,
  updateBusinessProfile
};
