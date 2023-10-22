import { Schema } from 'mongoose';
import {
  UserModel,
  ICreateUserRequest,
  IUpdateUserRequest
} from '../../src/models/user/user.model';
import {
  BuyerProfileModel,
  ICreateBuyerProfileRequest,
  IUpdateBuyerProfileRequest
} from '../../src/models/user/buyerProfile.model';
import {
  BusinessProfileModel,
  ICreateBusinessProfileRequest,
  IUpdateBusinessProfileRequest
} from '../../src/models/user/businessProfile.model';
import { afterEach } from 'mocha';

const chai: Chai.ChaiStatic = require('chai');

const User: UserModel = require('../../src/models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyerProfile.model');
const BusinessProfile: BusinessProfileModel = require('../../src/models/user/businessProfile.model');

describe('User model', () => {
  afterEach(async function () {
    await User.deleteMany({});
  });

  it('+ Create User with Buyer Profile', async function () {
    const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const buyerProfile = new BuyerProfile(buyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    chai.expect(savedBuyerProfile._id).to.exist;
    chai
      .expect(savedBuyerProfile.firstName)
      .to.equal(buyerProfileData.firstName);
    chai.expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

    const userData: ICreateUserRequest['body'] = {
      email: 'test@example.com',
      password: 'password',
      buyerProfile: savedBuyerProfile
    };
    const user = new User(userData);
    const savedUser = await user.save();

    chai.expect(savedUser._id).to.exist;
    chai.expect(savedUser.email).to.equal(userData.email);
    chai.expect(savedUser.buyerProfile).to.exist;
    chai.expect(savedUser.buyerProfile).to.be.equal(savedBuyerProfile);
  });

  it('+ Create User with Buyer and Business Profile (Basic)', async function () {
    const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const buyerProfile = new BuyerProfile(buyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    chai.expect(savedBuyerProfile._id).to.exist;
    chai
      .expect(savedBuyerProfile.firstName)
      .to.equal(buyerProfileData.firstName);
    chai.expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

    const businessProfileData: ICreateBusinessProfileRequest['body'] = {
      bibbleTier: 'Basic'
    };

    const businessProfile = new BusinessProfile(businessProfileData);
    const savedBusinessProfile = await businessProfile.save();

    chai.expect(savedBusinessProfile._id).to.exist;
    chai
      .expect(savedBusinessProfile.bibbleTier)
      .to.equal(businessProfileData.bibbleTier);

    const userData: ICreateUserRequest['body'] = {
      email: 'test@example.com',
      password: 'password',
      buyerProfile: savedBuyerProfile,
      businessProfile: savedBusinessProfile
    };

    const user = new User(userData);
    const savedUser = await user.save();

    chai.expect(savedUser._id).to.exist;
    chai.expect(savedUser.email).to.equal(userData.email);
    chai.expect(savedUser.buyerProfile).to.exist;
    chai.expect(savedUser.buyerProfile).to.be.equal(savedBuyerProfile);
    chai.expect(savedUser.businessProfile).to.exist;
    chai.expect(savedUser.businessProfile).to.be.equal(savedBusinessProfile);
  });

  it('- Create User (missing `buyerProfile`)', async function () {
    try {
      const userData: Omit<ICreateUserRequest['body'], 'buyerProfile'> = {
        email: 'test@exmaple.com',
        password: 'password'
      };
      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create User with Buyer Profile (missing `email`)', async function () {
    try {
      const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
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

      const userData: Omit<ICreateUserRequest['body'], 'email'> = {
        password: 'password',
        buyerProfile: savedBuyerProfile
      };

      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create User with Buyer Profile (missing `password`)', async function () {
    try {
      const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
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

      const userData: Omit<ICreateUserRequest['body'], 'password'> = {
        email: 'test@exmaple.com',
        buyerProfile: savedBuyerProfile
      };

      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create User with Buyer Profile (invalid `email`)', async function () {
    try {
      const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
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

      const userData: ICreateUserRequest['body'] = {
        email: 'invalid-email',
        password: 'password',
        buyerProfile: savedBuyerProfile
      };
      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create User with Buyer Profile (invalid `password`)', async function () {
    try {
      const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
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

      const userData: ICreateUserRequest['body'] = {
        email: 'test@exmaple.com',
        password: 'pass',
        buyerProfile: savedBuyerProfile
      };
      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });
});
