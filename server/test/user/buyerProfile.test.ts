import {
  BuyerProfileModel,
  ICreateOrUpdateBuyerProfileRequest
} from '../../src/models/user/buyerProfile.model';
import { afterEach } from 'mocha';

const chai: Chai.ChaiStatic = require('chai');

const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyerProfile.model');

describe('Buyer Profile model', () => {
  afterEach(async function () {
    await BuyerProfile.deleteMany({});
  });

  it('+ Create Buyer Profile (only required fields)', async function () {
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
    chai.expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);
  });

  it('+ Create Buyer Profile (all fields)', async function () {
    const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'I am a buyer',
      profilePic: 'https://www.google.com',
      contactNumber: '+0012345678',
      favouriteListings: []
    };

    const buyerProfile = new BuyerProfile(buyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    chai.expect(savedBuyerProfile._id).to.exist;
    chai
      .expect(savedBuyerProfile.firstName)
      .to.equal(buyerProfileData.firstName);
    chai.expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);
    chai.expect(savedBuyerProfile.bio).to.equal(buyerProfileData.bio);
    chai
      .expect(savedBuyerProfile.profilePic)
      .to.equal(buyerProfileData.profilePic);
    chai
      .expect(savedBuyerProfile.contactNumber)
      .to.equal(buyerProfileData.contactNumber);
    chai.expect(savedBuyerProfile.favouriteListings).to.be.empty;
  });

  it('- Create Buyer Profile (missing `firstName`)', async function () {
    try {
      const buyerProfileData: Omit<
        ICreateOrUpdateBuyerProfileRequest['body'],
        'firstName'
      > = {
        lastName: 'Doe'
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Buyer Profile (missing `lasttName`)', async function () {
    try {
      const buyerProfileData: Omit<
        ICreateOrUpdateBuyerProfileRequest['body'],
        'lastName'
      > = {
        firstName: 'John'
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Buyer Profile (missing `firstName` and `lastName`)', async function () {
    try {
      const buyerProfileData: Omit<
        ICreateOrUpdateBuyerProfileRequest['body'],
        'firstName' | 'lastName'
      > = {};

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Buyer Profile (invalid `contactNumber`)', async function () {
    try {
      const buyerProfileData: ICreateOrUpdateBuyerProfileRequest['body'] = {
        firstName: 'John',
        lastName: 'Doe',
        contactNumber: 'Invalid'
      };

      const buyerProfile = new BuyerProfile(buyerProfileData);
      await buyerProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });
});
