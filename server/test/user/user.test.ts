import { Schema } from 'mongoose';
import {
  ICreateOrUpdateUserRequest,
  UserModel
} from '../../src/models/user/user.model';
import {
  BuyerProfileModel,
  ICreateOrUpdateBuyerProfileRequest
} from '../../src/models/user/buyerProfile.model';
import {
  BusinessProfileModel,
  ICreateOrUpdateBusinessProfileRequest
} from '../../src/models/user/businessProfile.model';
import { afterEach } from 'mocha';

require('dotenv').config();
const assert = require('assert');

const User: UserModel = require('../../src/models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyerProfile.model');
const BusinessProfile: BusinessProfileModel = require('../../src/models/user/businessProfile.model');

describe('User model', () => {
  afterEach(async function () {
    try {
      await User.deleteMany({});
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create User with Buyer Profile', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: 'John',
        lastName: 'Doe'
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      const savedBuyerProfile = await buyerProfile.save();
      assert.strictEqual(
        savedBuyerProfile.firstName,
        buyerProfileData.firstName
      );
      assert.strictEqual(savedBuyerProfile.lastName, buyerProfileData.lastName);
      assert(savedBuyerProfile._id);

      const userData: Omit<
        ICreateOrUpdateUserRequest['body'],
        'buyerProfile'
      > & {
        buyerProfile: Schema.Types.ObjectId;
      } = {
        email: 'test@example.com',
        password: 'password',
        buyerProfile: savedBuyerProfile._id
      };
      const user = new User(userData);
      const savedUser = await user.save();

      assert.strictEqual(savedUser.email, userData.email);
      assert(savedUser._id);
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create User with Buyer and Business Profile (Basic)', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: 'John',
        lastName: 'Doe'
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      const savedBuyerProfile = await buyerProfile.save();
      assert.strictEqual(
        savedBuyerProfile.firstName,
        buyerProfileData.firstName
      );
      assert.strictEqual(savedBuyerProfile.lastName, buyerProfileData.lastName);
      assert(savedBuyerProfile._id);

      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Basic'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      const savedBusinessProfile = await businessProfile.save();
      assert.strictEqual(
        savedBusinessProfile.bibbleTier,
        businessProfileData.bibbleTier
      );
      assert(savedBusinessProfile._id);

      const userData: Omit<
        ICreateOrUpdateUserRequest['body'],
        'buyerProfile'
      > & {
        buyerProfile: Schema.Types.ObjectId;
      } = {
        email: 'test@example.com',
        password: 'password',
        buyerProfile: savedBuyerProfile._id
      };
      const user = new User(userData);
      const savedUser = await user.save();

      assert.strictEqual(savedUser.email, userData.email);
      assert(savedUser._id);
    } catch (error: any) {
      console.error(error);
    }
  });
});
