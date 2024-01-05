import { Response } from 'express';
import { BusinessProfileModel } from '../models/user/business-profile.model';
import { BuyerProfileModel } from '../models/user/buyer-profile.model';
import {
  IGetUserRequest,
  IUpdateProfilePictureRequest,
  IUpdateUserRequest,
  UserModel
} from '../models/user/user.model';
import { handleError } from '../utils/util';
import { putMedia, userBucketName } from '../services/s3.service';

const User: UserModel = require('../models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('../models/user/buyer-profile.model');
const BusinessProfile: BusinessProfileModel = require('../models/user/business-profile.model');

export const getUser = async (req: IGetUserRequest, res: Response) => {
  const { user } = req.body;

  return res.json({ user: user, message: 'User found.' });
};

export const updateUser = async (req: IUpdateUserRequest, res: Response) => {
  const { user, buyerProfile, businessProfile, email, password } = req.body;

  try {
    const buyerProfileId = user.buyerProfile._id;
    const businessProfileId = user.businessProfile._id;

    // Validate request body
    if (buyerProfile) {
      console.log('Validating Buyer Profile request body...');
      await BuyerProfile.validate(buyerProfile, Object.keys(buyerProfile));
    }
    if (businessProfile) {
      // If user has a business profile, validate request body for update
      console.log('Validating Business Profile (Update) request body...');
      if (businessProfileId) {
        await BusinessProfile.validate(
          businessProfile,
          Object.keys(businessProfile)
        );
      }
    }
    if (email || password) {
      console.log('Validating User request body...');
      const userPathsToUpdate = ['email', 'password'].filter(
        (key: string) => req.body[key as keyof typeof req.body]
      );
      await User.validate({ email, password }, userPathsToUpdate);
    }

    // Update Buyer Profile
    console.log('Updating buyer profile...');
    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      buyerProfileId,
      buyerProfile,
      { new: true }
    );

    if (!updatedBuyerProfile) {
      return res.status(404).json({ message: 'Buyer profile not found.' });
    }

    // Update Business Profile
    console.log('Updating business profile...');
    const updatedBusinessProfile = await BusinessProfile.findByIdAndUpdate(
      businessProfileId,
      businessProfile,
      { new: true }
    );

    if (!updatedBusinessProfile) {
      return res.status(404).json({ message: 'Business profile not found.' });
    }

    // Update User
    console.log('Updating user...');
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        buyerProfile: updatedBuyerProfile._id,
        businessProfile: updatedBusinessProfile._id,
        email,
        password
      },
      { new: true }
    );

    const populatedUser = await updatedUser?.populateAll();

    return res.json({
      user: populatedUser,
      message: 'User updated successfully.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateProfilePicture = async (
  req: IUpdateProfilePictureRequest,
  res: Response
) => {
  try {
    const { user, profilePic } = req.body;
    const file = req.file as Express.Multer.File;

    const media = { name: profilePic, url: undefined };

    const uploadedMedia = await putMedia(
      user.buyerProfile._id,
      file,
      media,
      userBucketName
    );
    console.log(uploadedMedia);

    console.log('Updating buyer profile...');
    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      user.buyerProfile._id,
      { profilePic: uploadedMedia[0] },
      { new: true }
    );

    if (!updatedBuyerProfile) {
      return res.status(404).json({ message: 'Buyer profile not found.' });
    }

    console.log('Updating user...');
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        buyerProfile: updatedBuyerProfile._id
      },
      { new: true }
    );

    const populatedUser = await updatedUser?.populateAll();

    return res.status(200).json({
      user: populatedUser,
      message: 'Profile picture updated successfully.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};
