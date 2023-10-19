import {
  BusinessProfileModel,
  ICreateOrUpdateBusinessProfileRequest
} from '../../src/models/user/businessProfile.model';

const chai: Chai.ChaiStatic = require('chai');

const BusinessProfile: BusinessProfileModel = require('../../src/models/user/businessProfile.model');

describe('Business Profile model', () => {
  afterEach(async function () {
    try {
      await BusinessProfile.deleteMany({});
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create Business Profile (only required `bibbleTier` with `Basic`)', async function () {
    try {
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
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create Business Profile (only required `bibbleTier` with `Verfied`)', async function () {
    try {
      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Verified'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      const savedBusinessProfile = await businessProfile.save();

      chai.expect(savedBusinessProfile._id).to.exist;
      chai
        .expect(savedBusinessProfile.bibbleTier)
        .to.equal(businessProfileData.bibbleTier);
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create Business Profile (only required `bibbleTier` with `Partner`)', async function () {
    try {
      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Partner'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      const savedBusinessProfile = await businessProfile.save();

      chai.expect(savedBusinessProfile._id).to.exist;
      chai
        .expect(savedBusinessProfile.bibbleTier)
        .to.equal(businessProfileData.bibbleTier);
    } catch (error: any) {
      console.error(error);
    }
  });

  it('+ Create Business Profile (all fields)', async function () {
    try {
      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
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

      chai.expect(savedBusinessProfile._id).to.exist;
      chai
        .expect(savedBusinessProfile.bibbleTier)
        .to.equal(businessProfileData.bibbleTier);
      chai
        .expect(savedBusinessProfile.businessName)
        .to.equal(businessProfileData.businessName);
      chai
        .expect(savedBusinessProfile.businessAddress)
        .to.equal(businessProfileData.businessAddress);
      chai
        .expect(savedBusinessProfile.businessBio)
        .to.equal(businessProfileData.businessBio);
      chai
        .expect(savedBusinessProfile.businessContact)
        .to.equal(businessProfileData.businessContact);
      chai
        .expect(savedBusinessProfile.businessEmail)
        .to.equal(businessProfileData.businessEmail);
      chai
        .expect(savedBusinessProfile.businessPic)
        .to.equal(businessProfileData.businessPic);
    } catch (error: any) {
      console.error(error);
    }
  });

  it('- Create Business Profile (missing `bibbleTier`)', async function () {
    try {
      const businessProfileData: Omit<
        ICreateOrUpdateBusinessProfileRequest['body'],
        'bibbleTier'
      > = {};

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Business Profile (invalid `bibbleTier`)', async function () {
    try {
      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Invalid'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Business Profile (invlid `businessContact`)', async function () {
    try {
      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Basic',
          businessContact: 'Invalid'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });

  it('- Create Business Profile (invalid `businessEmail`)', async function () {
    try {
      const businessProfileData: ICreateOrUpdateBusinessProfileRequest['body'] =
        {
          bibbleTier: 'Basic',
          businessEmail: 'Invalid'
        };

      const businessProfile = new BusinessProfile(businessProfileData);
      await businessProfile.save();
    } catch (error: any) {
      chai.expect(error.name).to.equal('ValidationError');
    }
  });
});
