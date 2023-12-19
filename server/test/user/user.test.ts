import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Schema } from 'mongoose';
import {
  UserModel,
  ICreateUserRequest,
  IUpdateUserRequest,
  IPopulatedUser
} from '../../src/models/user/user.model';
import {
  BuyerProfileModel,
  ICreateBuyerProfileRequest,
  IUpdateBuyerProfileRequest
} from '../../src/models/user/buyer-profile.model';
import {
  BusinessProfileModel,
  ICreateBusinessProfileRequest,
  IUpdateBusinessProfileRequest
} from '../../src/models/user/business-profile.model';

const User: UserModel = require('../../src/models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyer-profile.model');
const BusinessProfile: BusinessProfileModel = require('../../src/models/user/business-profile.model');

describe('User model (CREATE)', () => {
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

    expect(savedBuyerProfile._id).to.exist;

    expect(savedBuyerProfile.firstName).to.equal(buyerProfileData.firstName);
    expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

    const businessProfile = new BusinessProfile();
    const savedBusinessProfile = await businessProfile.save();

    expect(savedBusinessProfile._id).to.exist;

    expect(savedBusinessProfile.bibbleTier).to.equal('Basic');

    const userData: ICreateUserRequest['body'] = {
      email: 'test@example.com',
      password: 'password',
      buyerProfile: savedBuyerProfile,
      businessProfile: savedBusinessProfile
    };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).to.exist;
    expect(savedUser.email).to.equal(userData.email);
    expect(savedUser.buyerProfile).to.exist;
    expect(savedUser.buyerProfile).to.be.equal(savedBuyerProfile);
    expect(savedUser.businessProfile).to.exist;
    expect(savedUser.businessProfile).to.be.equal(savedBusinessProfile);
  });

  it('+ Create User with Buyer and Business Profile (only required fields)', async function () {
    const buyerProfileData: ICreateBuyerProfileRequest['body'] = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const buyerProfile = new BuyerProfile(buyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    expect(savedBuyerProfile._id).to.exist;

    expect(savedBuyerProfile.firstName).to.equal(buyerProfileData.firstName);
    expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

    const businessProfileData: ICreateBusinessProfileRequest['body'] = {
      bibbleTier: 'Basic'
    };

    const businessProfile = new BusinessProfile(businessProfileData);
    const savedBusinessProfile = await businessProfile.save();

    expect(savedBusinessProfile._id).to.exist;

    expect(savedBusinessProfile.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );

    const userData: ICreateUserRequest['body'] = {
      email: 'test@example.com',
      password: 'password',
      buyerProfile: savedBuyerProfile,
      businessProfile: savedBusinessProfile
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).to.exist;
    expect(savedUser.email).to.equal(userData.email);
    expect(savedUser.buyerProfile).to.exist;
    expect(savedUser.buyerProfile).to.be.equal(savedBuyerProfile);
    expect(savedUser.businessProfile).to.exist;
    expect(savedUser.businessProfile).to.be.equal(savedBusinessProfile);
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
      expect(error.name).to.equal('ValidationError');
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

      expect(savedBuyerProfile._id).to.exist;

      expect(savedBuyerProfile.firstName).to.equal(buyerProfileData.firstName);

      expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

      const userData: Omit<ICreateUserRequest['body'], 'email'> = {
        password: 'password',
        buyerProfile: savedBuyerProfile
      };

      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
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

      expect(savedBuyerProfile._id).to.exist;

      expect(savedBuyerProfile.firstName).to.equal(buyerProfileData.firstName);

      expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

      const userData: Omit<ICreateUserRequest['body'], 'password'> = {
        email: 'test@exmaple.com',
        buyerProfile: savedBuyerProfile
      };

      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
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

      expect(savedBuyerProfile._id).to.exist;

      expect(savedBuyerProfile.firstName).to.equal(buyerProfileData.firstName);

      expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

      const userData: ICreateUserRequest['body'] = {
        email: 'invalid-email',
        password: 'password',
        buyerProfile: savedBuyerProfile
      };
      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
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

      expect(savedBuyerProfile._id).to.exist;

      expect(savedBuyerProfile.firstName).to.equal(buyerProfileData.firstName);

      expect(savedBuyerProfile.lastName).to.equal(buyerProfileData.lastName);

      const userData: ICreateUserRequest['body'] = {
        email: 'test@exmaple.com',
        password: 'pass',
        buyerProfile: savedBuyerProfile
      };
      const user = new User(userData);
      await user.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });
});

describe('User model (READ)', () => {
  const existingBuyerProfileData: ICreateBuyerProfileRequest['body'] = {
    firstName: 'John',
    lastName: 'Doe'
  };

  const existingUserData: Omit<ICreateUserRequest['body'], 'buyerProfile'> = {
    email: 'test@example.com',
    password: 'password'
  };

  let existingUser: IPopulatedUser;

  beforeEach(async function () {
    const buyerProfile = new BuyerProfile(existingBuyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    const user = new User({
      ...existingUserData,
      buyerProfile: savedBuyerProfile
    });
    const savedUser = await user.save();

    existingUser = await savedUser.populate('buyerProfile businessProfile');
  });

  afterEach(async function () {
    await User.deleteMany({});
  });

  it('+ Get User (by `id`)', async function () {
    const user = await User.findById(existingUser._id);

    expect(user).to.exist;
    expect(user?._id.toString()).to.be.equal(existingUser._id.toString());
  });

  it('+ Get User (by `email`)', async function () {
    const user = await User.findOne({ email: existingUserData.email });

    expect(user).to.exist;
    expect(user?._id.toString()).to.be.equal(existingUser._id.toString());
  });

  it('- Get User (invalid `id`)', async function () {
    try {
      await User.findById('Invalid');
    } catch (error: any) {
      expect(error.name).to.equal('CastError');
    }
  });

  it('- Get User (invalid `email`)', async function () {
    try {
      await User.findOne({ email: 'Invalid' });
    } catch (error: any) {
      expect(error.name).to.equal('CastError');
    }
  });

  it('- Get User (`email` that does not exist)', async function () {
    const user = await User.findOne({ email: 'missing@example.com' });

    expect(user).to.not.exist;
  });
});

describe('User model (UPDATE)', () => {
  const existingBuyerProfileData: ICreateBuyerProfileRequest['body'] = {
    firstName: 'John',
    lastName: 'Doe'
  };

  const existingUserData: Omit<ICreateUserRequest['body'], 'buyerProfile'> = {
    email: 'test@example.com',
    password: 'password'
  };

  let existingUser: IPopulatedUser;

  beforeEach(async function () {
    const buyerProfile = new BuyerProfile(existingBuyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    const user = new User({
      ...existingUserData,
      buyerProfile: savedBuyerProfile
    });
    const savedUser = await user.save();

    existingUser = await savedUser.populate('buyerProfile businessProfile');
  });

  afterEach(async function () {
    await User.deleteMany({});
  });

  it('+ Update User (only `email`)', async function () {
    const updateUserData: IUpdateUserRequest['body'] = {
      user: existingUser,
      email: 'updated@example.com'
    };

    const updatedUser = await User.findOneAndUpdate(
      { _id: existingUser._id },
      updateUserData,
      { new: true }
    );

    expect(updatedUser).to.exist;

    expect(updatedUser?._id.toString()).to.be.equal(existingUser._id.toString());
    expect(updatedUser?.email).to.equal(updateUserData.email);
  });

  it('+ Update User (only `password`)', async function () {
    const updateUserData: IUpdateUserRequest['body'] = {
      user: existingUser,
      password: 'updatedPassword'
    };

    const updatedUser = await User.findOneAndUpdate(
      { _id: existingUser._id },
      updateUserData,
      { new: true }
    );

    expect(updatedUser).to.exist;

    expect(updatedUser?._id.toString()).to.be.equal(existingUser._id.toString());
    expect(updatedUser?.password).to.not.equal(updateUserData.password);
    expect(updatedUser?.password).to.not.equal(existingUserData.password);
    expect(updatedUser?.isCorrectPassword(existingUserData.password)).to.be
      .false;
    expect(updatedUser?.isCorrectPassword(updateUserData.password!)).to.be.true;
  });

  it('+ Update User (all fields excluding profiles)', async function () {
    const updateUserData: IUpdateUserRequest['body'] = {
      user: existingUser,
      email: 'updated@example.com',
      password: 'updatedPassword'
    };

    const updatedUser = await User.findOneAndUpdate(
      { _id: existingUser._id },
      updateUserData,
      { new: true }
    );

    expect(updatedUser).to.exist;

    expect(updatedUser?._id.toString()).to.be.equal(existingUser._id.toString());
    expect(updatedUser?.email).to.equal(updateUserData.email);
    expect(updatedUser?.password).to.not.equal(updateUserData.password);
    expect(updatedUser?.password).to.not.equal(existingUserData.password);
    expect(updatedUser?.isCorrectPassword(existingUserData.password)).to.be
      .false;
    expect(updatedUser?.isCorrectPassword(updateUserData.password!)).to.be.true;
  });

  it('- Update User (invalid `email`)', async function () {
    try {
      const updateUserData: IUpdateUserRequest['body'] = {
        user: existingUser,
        email: 'updated'
      };

      await User.findOneAndUpdate({ _id: existingUser._id }, updateUserData, {
        new: true
      });
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Update User (invalid `password`)', async function () {
    try {
      const updateUserData: IUpdateUserRequest['body'] = {
        user: existingUser,
        password: 'pass'
      };

      await User.findOneAndUpdate({ _id: existingUser._id }, updateUserData, {
        new: true
      });
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });
});

describe('User model (DELETE)', () => {
  const existingBuyerProfileData: ICreateBuyerProfileRequest['body'] = {
    firstName: 'John',
    lastName: 'Doe'
  };

  const existingUserData: Omit<ICreateUserRequest['body'], 'buyerProfile'> = {
    email: 'test@example.com',
    password: 'password'
  };

  let existingUserId: Schema.Types.ObjectId;

  beforeEach(async function () {
    const buyerProfile = new BuyerProfile(existingBuyerProfileData);
    const savedBuyerProfile = await buyerProfile.save();

    const user = new User({
      ...existingUserData,
      buyerProfile: savedBuyerProfile
    });
    const savedUser = await user.save();

    existingUserId = savedUser._id;
  });

  afterEach(async function () {
    await User.deleteMany({});
  });

  it('+ Delete User (by `id`)', async function () {
    const deletedUser = await User.findByIdAndDelete(existingUserId);

    expect(deletedUser).to.exist;

    expect(deletedUser?._id.toString()).to.be.equal(existingUserId.toString());
  });

  it('+ Delete User (by `email`)', async function () {
    const deletedUser = await User.findOneAndDelete({
      email: existingUserData.email
    });

    expect(deletedUser).to.exist;

    expect(deletedUser?._id.toString()).to.be.equal(existingUserId.toString());
  });

  it('- Delete User (invalid `id`)', async function () {
    try {
      await User.findByIdAndDelete('Invalid');
    } catch (error: any) {
      expect(error.name).to.equal('CastError');
    }
  });

  it('- Delete User (invalid `email`)', async function () {
    try {
      await User.findOneAndDelete({ email: 'Invalid' });
    } catch (error: any) {
      expect(error.name).to.equal('CastError');
    }
  });

  it('- Delete User (`email` that does not exist)', async function () {
    const user = await User.findOneAndDelete({ email: 'missing@example.com' });

    expect(user).to.not.exist;
  });
});
