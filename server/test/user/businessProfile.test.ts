import { afterEach, before, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Schema } from 'mongoose';
import {
  BusinessProfileModel,
  ICreateBusinessProfileRequest,
  IUpdateBusinessProfileRequest
} from '../../src/models/user/business-profile.model';
import { LicensedPetShopModel } from '../../src/models/licensed-pet-shop.model';

const BusinessProfile: BusinessProfileModel = require('../../src/models/user/business-profile.model');
const LicensedPetShop: LicensedPetShopModel = require('../../src/models/licensed-pet-shop.model');

const existingLicensedPetShopNumber: string = 'AS19J00045'; // This is a valid license number for '181 AQUARIUM'.

describe('Business Profile model (CREATE)', () => {
  afterEach(async function () {
    await BusinessProfile.deleteMany({});
  });

  it('+ Create Business Profile (only required `bibbleTier` with `Basic`)', async function () {
    const businessProfileData: ICreateBusinessProfileRequest['body'] = {
      bibbleTier: 'Basic'
    };

    const businessProfile = new BusinessProfile(businessProfileData);
    const savedBusinessProfile = await businessProfile.save();

    expect(savedBusinessProfile._id).to.exist;

    expect(savedBusinessProfile.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );
  });

  it('+ Create Business Profile (only required `bibbleTier` with `Verfied`)', async function () {
    console.log(existingLicensedPetShopNumber);
    const businessProfileData: ICreateBusinessProfileRequest['body'] = {
      bibbleTier: 'Verified',
      businessName: 'Test Business',
      businessAddress: 'Test Address',
      businessContact: '+6512345678',
      businessEmail: 'testbusiness@example.com',
      petShopLicenseNumber: existingLicensedPetShopNumber
    };
    const businessProfile = new BusinessProfile(businessProfileData);
    const savedBusinessProfile = await businessProfile.save();

    expect(savedBusinessProfile._id).to.exist;

    expect(savedBusinessProfile.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );

    expect(savedBusinessProfile.businessName).to.equal(
      businessProfileData.businessName
    );

    expect(savedBusinessProfile.businessAddress).to.equal(
      businessProfileData.businessAddress
    );

    expect(savedBusinessProfile.businessContact).to.equal(
      businessProfileData.businessContact
    );

    expect(savedBusinessProfile.businessEmail).to.equal(
      businessProfileData.businessEmail
    );

    expect(savedBusinessProfile.petShopLicenseNumber).to.equal(
      businessProfileData.petShopLicenseNumber
    );
  });

  it('+ Create Business Profile (only required `bibbleTier` with `Partner`)', async function () {
    const businessProfileData: ICreateBusinessProfileRequest['body'] = {
      bibbleTier: 'Partner',
      businessName: 'Test Business',
      businessAddress: 'Test Address',
      businessContact: '+6512345678',
      businessEmail: 'testbusiness@example.com',
      petShopLicenseNumber: existingLicensedPetShopNumber
    };

    const businessProfile = new BusinessProfile(businessProfileData);
    const savedBusinessProfile = await businessProfile.save();

    expect(savedBusinessProfile._id).to.exist;

    expect(savedBusinessProfile.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );
    
    expect(savedBusinessProfile.businessName).to.equal(
      businessProfileData.businessName
    );
    
    expect(savedBusinessProfile.businessAddress).to.equal(
      businessProfileData.businessAddress
    );

    expect(savedBusinessProfile.businessContact).to.equal(
      businessProfileData.businessContact
    );

    expect(savedBusinessProfile.businessEmail).to.equal(
      businessProfileData.businessEmail
    );

    expect(savedBusinessProfile.petShopLicenseNumber).to.equal(
      businessProfileData.petShopLicenseNumber
    );
  });

  it('+ Create Business Profile (all fields)', async function () {
    const businessProfileData: ICreateBusinessProfileRequest['body'] = {
      bibbleTier: 'Basic',
      businessName: 'Test Business',
      businessAddress: 'Test Address',
      businessBio: 'Test Bio',
      businessContact: '+0012345678',
      businessEmail: 'test-business@example.com',
      businessPic: 'https://www.google.com'
    };

    const businessProfile = new BusinessProfile(businessProfileData);
    const savedBusinessProfile = await businessProfile.save();

    expect(savedBusinessProfile._id).to.exist;

    expect(savedBusinessProfile.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );

    expect(savedBusinessProfile.businessName).to.equal(
      businessProfileData.businessName
    );

    expect(savedBusinessProfile.businessAddress).to.equal(
      businessProfileData.businessAddress
    );

    expect(savedBusinessProfile.businessBio).to.equal(
      businessProfileData.businessBio
    );

    expect(savedBusinessProfile.businessContact).to.equal(
      businessProfileData.businessContact
    );

    expect(savedBusinessProfile.businessEmail).to.equal(
      businessProfileData.businessEmail
    );

    expect(savedBusinessProfile.businessPic).to.equal(
      businessProfileData.businessPic
    );
  });

  it('- Create Business Profile (missing `bibbleTier`)', async function () {
    try {
      const businessProfileData: Omit<
        ICreateBusinessProfileRequest['body'],
        'bibbleTier'
      > = {};

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Business Profile (invalid `bibbleTier`)', async function () {
    try {
      const businessProfileData: ICreateBusinessProfileRequest['body'] = {
        bibbleTier: 'Invalid'
      };

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Business Profile (invlid `businessContact`)', async function () {
    try {
      const businessProfileData: ICreateBusinessProfileRequest['body'] = {
        bibbleTier: 'Basic',
        businessContact: 'Invalid'
      };

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Business Profile (invalid `businessEmail`)', async function () {
    try {
      const businessProfileData: ICreateBusinessProfileRequest['body'] = {
        bibbleTier: 'Basic',
        businessEmail: 'Invalid'
      };

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });
});

describe('Business Profile model (READ)', () => {
  const existingBusinessProfileData: ICreateBusinessProfileRequest['body'] = {
    bibbleTier: 'Basic'
  };

  let existingBusinessProfileId: Schema.Types.ObjectId;

  beforeEach(async function () {
    const businessProfile = new BusinessProfile(existingBusinessProfileData);
    const savedBusinessProfile = await businessProfile.save();
    existingBusinessProfileId = savedBusinessProfile._id;
  });

  afterEach(async function () {
    await BusinessProfile.deleteMany({});
  });

  it('+ Get Business Profile (by `id`)', async function () {
    const businessProfile = await BusinessProfile.findById(
      existingBusinessProfileId
    );

    expect(businessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );
  });

  it('- Get Business Profile (invalid `id`)', async function () {
    try {
      await BusinessProfile.findById('Invalid');
    } catch (error: any) {
      expect(error.name).to.equal('CastError');
    }
  });
});

describe('Business Profile model (UPDATE)', () => {
  const existingBusinessProfileData: ICreateBusinessProfileRequest['body'] = {
    bibbleTier: 'Basic'
  };

  let existingBusinessProfileId: Schema.Types.ObjectId;

  beforeEach(async function () {
    const businessProfile = new BusinessProfile(existingBusinessProfileData);
    const savedBusinessProfile = await businessProfile.save();
    existingBusinessProfileId = savedBusinessProfile._id;
  });

  afterEach(async function () {
    await BusinessProfile.deleteMany({});
  });

  it('+ Update Business Profile (only `bibbleTier` to `Verified`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      bibbleTier: 'Verified'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );
  });

  it('+ Update Business Profile (only `bibbleTier` to `Partner`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      bibbleTier: 'Partner'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      businessProfileData.bibbleTier
    );
  });

  it('+ Update Business Profile (only `businessName`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      businessName: 'Test Business'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      existingBusinessProfileData.bibbleTier
    );

    expect(updatedBusinessProfile?.businessName).to.equal(
      businessProfileData.businessName
    );
  });

  it('+ Update Business Profile (only `businessAddress`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      businessAddress: 'Test Address'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      existingBusinessProfileData.bibbleTier
    );

    expect(updatedBusinessProfile?.businessAddress).to.equal(
      businessProfileData.businessAddress
    );
  });

  it('+ Update Business Profile (only `businessBio`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      businessBio: 'Test Bio'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      existingBusinessProfileData.bibbleTier
    );

    expect(updatedBusinessProfile?.businessBio).to.equal(
      businessProfileData.businessBio
    );
  });

  it('+ Update Business Profile (only `businessContact`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      businessContact: '+0012345678'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      existingBusinessProfileData.bibbleTier
    );

    expect(updatedBusinessProfile?.businessContact).to.equal(
      businessProfileData.businessContact
    );
  });

  it('+ Update Business Profile (only `businessEmail`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      businessEmail: 'test-business-email@example.com'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      existingBusinessProfileData.bibbleTier
    );

    expect(updatedBusinessProfile?.businessEmail).to.equal(
      businessProfileData.businessEmail
    );
  });

  it('+ Update Business Profile (only `businessPic`)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      businessPic: 'https://www.google.com'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.bibbleTier).to.equal(
      existingBusinessProfileData.bibbleTier
    );

    expect(updatedBusinessProfile?.businessPic).to.equal(
      businessProfileData.businessPic
    );
  });

  it('+ Update Business Profile (all fields)', async function () {
    const businessProfileData: IUpdateBusinessProfileRequest['body'] = {
      bibbleTier: 'Basic',
      businessName: 'Test Business',
      businessAddress: 'Test Address',
      businessBio: 'Test Bio',
      businessContact: '+0012345678',
      businessEmail: 'test-business-email@example.com',
      businessPic: 'https://www.google.com'
    };

    const updatedBusinessProfile = await BusinessProfile.findOneAndUpdate(
      { _id: existingBusinessProfileId },
      businessProfileData,
      { new: true }
    );

    expect(updatedBusinessProfile?.isNew).to.be.false;

    expect(updatedBusinessProfile?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );

    expect(updatedBusinessProfile?.businessName).to.equal(
      businessProfileData.businessName
    );

    expect(updatedBusinessProfile?.businessAddress).to.equal(
      businessProfileData.businessAddress
    );

    expect(updatedBusinessProfile?.businessBio).to.equal(
      businessProfileData.businessBio
    );

    expect(updatedBusinessProfile?.businessContact).to.equal(
      businessProfileData.businessContact
    );

    expect(updatedBusinessProfile?.businessEmail).to.equal(
      businessProfileData.businessEmail
    );

    expect(updatedBusinessProfile?.businessPic).to.equal(
      businessProfileData.businessPic
    );
  });

  it('- Update Business Profile (invalid `businessContact`)', async function () {
    try {
      const businessProfileData: Partial<
        ICreateBusinessProfileRequest['body']
      > = {
        businessContact: 'Invalid'
      };

      await BusinessProfile.findOneAndUpdate(
        { _id: existingBusinessProfileId },
        businessProfileData,
        { new: true }
      );
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Update Business Profile (invalid `businessEmail`)', async function () {
    try {
      const businessProfileData: Partial<
        ICreateBusinessProfileRequest['body']
      > = {
        businessEmail: 'Invalid'
      };

      await BusinessProfile.findOneAndUpdate(
        { _id: existingBusinessProfileId },
        businessProfileData,
        { new: true }
      );
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Update Business Profile (invalid `bibbleTier`)', async function () {
    try {
      const businessProfileData: Partial<
        ICreateBusinessProfileRequest['body']
      > = {
        bibbleTier: 'Invalid'
      };

      await BusinessProfile.findOneAndUpdate(
        { _id: existingBusinessProfileId },
        businessProfileData,
        { new: true }
      );
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Update Business Profile (empty `bibbleTier`)', async function () {
    try {
      const businessProfileData: Partial<
        ICreateBusinessProfileRequest['body']
      > = {
        bibbleTier: ''
      };

      await BusinessProfile.findOneAndUpdate(
        { _id: existingBusinessProfileId },
        businessProfileData,
        { new: true }
      );
    } catch (error: any) {
      expect(error.name).to.equal('ValidationError');
    }
  });
});

describe('Business Profile model (DELETE)', () => {
  const existingBusinessProfileData: ICreateBusinessProfileRequest['body'] = {
    bibbleTier: 'Basic'
  };

  let existingBusinessProfileId: Schema.Types.ObjectId;

  beforeEach(async function () {
    const businessProfile = new BusinessProfile(existingBusinessProfileData);
    const savedBusinessProfile = await businessProfile.save();
    existingBusinessProfileId = savedBusinessProfile._id;
  });

  afterEach(async function () {
    await BusinessProfile.deleteMany({});
  });

  it('+ Delete Business Profile (by `id`)', async function () {
    const deletedBusinessProfile = await BusinessProfile.findOneAndDelete({
      _id: existingBusinessProfileId
    });

    expect(deletedBusinessProfile?.value?._id.toString()).to.equal(
      existingBusinessProfileId.toString()
    );
  });

  it('- Delete Business Profile (invalid `id`)', async function () {
    try {
      await BusinessProfile.findOneAndDelete({ _id: 'Invalid' });
    } catch (error: any) {
      expect(error.name).to.equal('CastError');
    }
  });
});
