import {
  BuyerProfileModel,
  ICreateOrUpdateBuyerProfileRequest
} from '../../src/models/user/buyerProfile.model';
import { afterEach } from 'mocha';

require('dotenv').config();
const assert = require('assert');

const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyerProfile.model');

describe('Buyer Profile model', () => {
  afterEach(async function () {
    try {
      await BuyerProfile.deleteMany({});
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create Buyer Profile (only required fields)', async function () {
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
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create Buyer Profile (all fields)', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'I am a buyer',
        profilePic: 'https://www.google.com',
        contactNumber: 12345678,
        favouriteListings: []
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      const savedBuyerProfile = await buyerProfile.save();
      assert.strictEqual(
        savedBuyerProfile.firstName,
        buyerProfileData.firstName
      );
      assert.strictEqual(savedBuyerProfile.lastName, buyerProfileData.lastName);
      assert.strictEqual(savedBuyerProfile.bio, buyerProfileData.bio);
      assert.strictEqual(
        savedBuyerProfile.profilePic,
        buyerProfileData.profilePic
      );
      assert.strictEqual(
        savedBuyerProfile.contactNumber,
        buyerProfileData.contactNumber
      );
      assert.strictEqual(
        assert.strictEqual(savedBuyerProfile.favouriteListings?.length, 0),
        assert.strictEqual(buyerProfileData.favouriteListings?.length, 0)
      );
      assert(savedBuyerProfile._id);
    } catch (error: any) {
      console.error(error);
    }
  });

  it('- Create Buyer Profile (missing `firstName`)', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: '',
        lastName: 'Doe'
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      assert.strictEqual(error.name, 'ValidationError');
    }
  });

  it('- Create Buyer Profile (missing `lasttName`)', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: 'John',
        lastName: ''
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      assert.strictEqual(error.name, 'ValidationError');
    }
  });

  it('- Create Buyer Profile (missing `firstName` and `lastName`)', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: '',
        lastName: ''
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      assert.strictEqual(error.name, 'ValidationError');
    }
  });
});
