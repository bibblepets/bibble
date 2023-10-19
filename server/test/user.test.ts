import { Connection, Schema } from 'mongoose';
import {
  ICreateOrUpdateUserRequest,
  UserModel
} from '../src/models/user/user.model';
import {
  BuyerProfileModel,
  ICreateOrUpdateBuyerProfileRequest
} from '../src/models/user/buyerProfile.model';
import { BusinessProfileModel } from '../src/models/user/businessProfile.model';
import { before, after, afterEach } from 'mocha';

require('dotenv').config();
const db: Connection = require('../src/mongodb/db');
const assert = require('assert');

const User: UserModel = require('../src/models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('../src/models/user/buyerProfile.model');
const BusinessProfile: BusinessProfileModel = require('../src/models/user/businessProfile.model');

describe('User model', () => {
  before('Initialising MongoDB...', function (done) {
    setTimeout(() => done(), 3000);
  });

  after('Cleaning up...', async function () {
    try {
      await db.dropDatabase();
      await db.close();
    } catch (error: any) {
      console.error(error);
    }
  });

  afterEach('Deleting all users..', function (done) {
    User.deleteMany();
    done();
  });

  it('Create User with Buyer Profile', async function () {
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
});
