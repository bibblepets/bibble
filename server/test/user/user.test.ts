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

const chai: Chai.ChaiStatic = require('chai');

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

      chai.expect(savedBuyerProfile._id).to.exist;
      chai
        .expect(savedBuyerProfile.firstName)
        .to.equal(buyerProfileData.firstName);
      chai
        .expect(savedBuyerProfile.lastName)
        .to.equal(buyerProfileData.lastName);

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

      chai.expect(savedUser._id).to.exist;
      chai.expect(savedUser.email).to.equal(userData.email);
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

      chai.expect(savedBuyerProfile._id).to.exist;
      chai
        .expect(savedBuyerProfile.firstName)
        .to.equal(buyerProfileData.firstName);
      chai
        .expect(savedBuyerProfile.lastName)
        .to.equal(buyerProfileData.lastName);

      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Basic'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      const savedBusinessProfile = await businessProfile.save();

      chai.expect(savedBusinessProfile._id).to.exist;
      chai
        .expect(savedBusinessProfile.bibbleTier)
        .to.equal(businessProfileData.bibbleTier);

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

      chai.expect(savedUser._id).to.exist;
      chai.expect(savedUser.email).to.equal(userData.email);
    } catch (error: any) {
      console.error(error);
    }
  });
});
