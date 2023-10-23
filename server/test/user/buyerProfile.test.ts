import { Schema } from 'mongoose';
import {
  BuyerProfileModel,
  ICreateBuyerProfileRequest,
  IUpdateBuyerProfileRequest
} from '../../src/models/user/buyerProfile.model';
import { afterEach } from 'mocha';

const chai: Chai.ChaiStatic = require('chai');

const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyerProfile.model');

describe('Buyer Profile model (CREATE)', () => {
  afterEach(async function () {
    await BuyerProfile.deleteMany({});
  });

  it('+ Create Buyer Profile (only required fields)', async function () {
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
  });

  it('+ Create Buyer Profile (all fields)', async function () {
    const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
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
        ICreateBuyerProfileRequest['body'],
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
        ICreateBuyerProfileRequest['body'],
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
        ICreateBuyerProfileRequest['body'],
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
      const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
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

describe('Buyer Profile model (READ)', () => {
  const existingBuyerProfileData: ICreateBuyerProfileRequest['body'] = {
    firstName: 'John',
    lastName: 'Doe'
  };

  let existingBuyerProfileId: Schema.Types.ObjectId;
  beforeEach(async function () {
    const buyerProfile = new BuyerProfile(existingBuyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    existingBuyerProfileId = savedBuyerProfile._id;
  });

  afterEach(async function () {
    await BuyerProfile.deleteMany({});
  });

  it('+ Get Buyer Profile (by `id`)', async function () {
    const foundBuyerProfile = await BuyerProfile.findById(
      existingBuyerProfileId
    );

    chai.expect(foundBuyerProfile).to.exist;
    chai
      .expect(foundBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
  });

  it('- Get Buyer Profile (invalid `id`)', async function () {
    try {
      await BuyerProfile.findById('Invalid');
    } catch (error: any) {
      chai.expect(error.name).to.equal('CastError');
    }
  });
});

describe('Buyer Profile model (UPDATE)', () => {
  const existingBuyerProfileData: ICreateBuyerProfileRequest['body'] = {
    firstName: 'John',
    lastName: 'Doe'
  };

  let existingBuyerProfileId: Schema.Types.ObjectId;

  beforeEach(async function () {
    const buyerProfile = new BuyerProfile(existingBuyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    existingBuyerProfileId = savedBuyerProfile._id;
  });

  afterEach(async function () {
    await BuyerProfile.deleteMany({});
  });

  it('+ Update Buyer Profile (only `firstName`)', async function () {
    const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
      firstName: 'Jane'
    };

    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      existingBuyerProfileId,
      buyerProfileData,
      { new: true }
    );

    chai.expect(updatedBuyerProfile?.isNew).to.be.false;
    chai
      .expect(updatedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
    chai
      .expect(updatedBuyerProfile?.firstName)
      .to.equal(buyerProfileData.firstName);
    chai
      .expect(updatedBuyerProfile?.lastName)
      .to.equal(existingBuyerProfileData.lastName);
  });

  it('+ Update Buyer Profile (only `lastName`)', async function () {
    const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
      lastName: 'Smith'
    };

    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      existingBuyerProfileId,
      buyerProfileData,
      { new: true }
    );

    chai.expect(updatedBuyerProfile?.isNew).to.be.false;
    chai
      .expect(updatedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
    chai
      .expect(updatedBuyerProfile?.firstName)
      .to.equal(existingBuyerProfileData.firstName);
    chai
      .expect(updatedBuyerProfile?.lastName)
      .to.equal(buyerProfileData.lastName);
  });

  it('+ Update Buyer Profile (only `bio`)', async function () {
    const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
      bio: 'I am a buyer'
    };

    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      existingBuyerProfileId,
      buyerProfileData,
      { new: true }
    );

    chai.expect(updatedBuyerProfile?.isNew).to.be.false;
    chai
      .expect(updatedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
    chai
      .expect(updatedBuyerProfile?.firstName)
      .to.equal(existingBuyerProfileData.firstName);
    chai
      .expect(updatedBuyerProfile?.lastName)
      .to.equal(existingBuyerProfileData.lastName);
    chai.expect(updatedBuyerProfile?.bio).to.equal(buyerProfileData.bio);
  });

  it('+ Update Buyer Profile (only `profilePic`)', async function () {
    const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
      profilePic: 'https://www.google.com'
    };

    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      existingBuyerProfileId,
      buyerProfileData,
      { new: true }
    );

    chai.expect(updatedBuyerProfile?.isNew).to.be.false;
    chai
      .expect(updatedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
    chai
      .expect(updatedBuyerProfile?.firstName)
      .to.equal(existingBuyerProfileData.firstName);
    chai
      .expect(updatedBuyerProfile?.lastName)
      .to.equal(existingBuyerProfileData.lastName);
    chai
      .expect(updatedBuyerProfile?.profilePic)
      .to.equal(buyerProfileData.profilePic);
  });

  it('+ Update Buyer Profile (only `contactNumber`)', async function () {
    const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
      contactNumber: '+0012345678'
    };

    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      existingBuyerProfileId,
      buyerProfileData,
      { new: true }
    );

    chai.expect(updatedBuyerProfile?.isNew).to.be.false;
    chai
      .expect(updatedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
    chai
      .expect(updatedBuyerProfile?.firstName)
      .to.equal(existingBuyerProfileData.firstName);
    chai
      .expect(updatedBuyerProfile?.lastName)
      .to.equal(existingBuyerProfileData.lastName);
    chai
      .expect(updatedBuyerProfile?.contactNumber)
      .to.equal(buyerProfileData.contactNumber);
  });

  it('+ Update Buyer Profile (all fields)', async function () {
    const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'I am a buyer',
      profilePic: 'https://www.google.com',
      contactNumber: '+0012345678',
      favouriteListings: []
    };

    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      existingBuyerProfileId,
      buyerProfileData,
      { new: true }
    );

    chai.expect(updatedBuyerProfile?.isNew).to.be.false;
    chai
      .expect(updatedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
    chai
      .expect(updatedBuyerProfile?.firstName)
      .to.equal(buyerProfileData.firstName);
    chai
      .expect(updatedBuyerProfile?.lastName)
      .to.equal(buyerProfileData.lastName);
    chai.expect(updatedBuyerProfile?.bio).to.equal(buyerProfileData.bio);
    chai
      .expect(updatedBuyerProfile?.profilePic)
      .to.equal(buyerProfileData.profilePic);
    chai
      .expect(updatedBuyerProfile?.contactNumber)
      .to.equal(buyerProfileData.contactNumber);
    chai.expect(updatedBuyerProfile?.favouriteListings).to.be.empty;
  });

  it('- Update Buyer Profile (empty `firstName`)', async function () {
    try {
      const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
        firstName: ''
      };

      await BuyerProfile.findByIdAndUpdate(
        existingBuyerProfileId,
        buyerProfileData,
        { new: true }
      );
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Update Buyer Profile (empty `lastName`)', async function () {
    try {
      const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
        lastName: ''
      };

      await BuyerProfile.findByIdAndUpdate(
        existingBuyerProfileId,
        buyerProfileData,
        { new: true }
      );
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Update Buyer Profile (invalid `contactNumber`)', async function () {
    try {
      const buyerProfileData: IUpdateBuyerProfileRequest['body'] = {
        contactNumber: 'Invalid'
      };

      await BuyerProfile.findByIdAndUpdate(
        existingBuyerProfileId,
        buyerProfileData,
        { new: true }
      );
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });
});

describe('Buyer Profile model (DELETE)', () => {
  const existingBuyerProfileData: ICreateBuyerProfileRequest['body'] = {
    firstName: 'John',
    lastName: 'Doe'
  };

  let existingBuyerProfileId: Schema.Types.ObjectId;

  beforeEach(async function () {
    const buyerProfile = new BuyerProfile(existingBuyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    existingBuyerProfileId = savedBuyerProfile._id;
  });

  afterEach(async function () {
    await BuyerProfile.deleteMany({});
  });

  it('+ Delete Buyer Profile (by `id`)', async function () {
    const deletedBuyerProfile = await BuyerProfile.findByIdAndDelete(
      existingBuyerProfileId
    );

    chai
      .expect(deletedBuyerProfile?._id.toString())
      .to.equal(existingBuyerProfileId.toString());
  });

  it('- Delete Buyer Profile (invalid `id`)', async function () {
    try {
      await BuyerProfile.findByIdAndDelete('Invalid');
    } catch (error: any) {
      chai.expect(error.name).to.equal('CastError');
    }
  });
});
