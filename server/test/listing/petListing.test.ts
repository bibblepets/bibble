import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { Schema } from 'mongoose';
import {
  ICreatePetListingRequest,
  PetListingModel
} from '../../src/models/listing/petListing.model';
import { BuyerProfileModel } from '../../src/models/user/buyerProfile.model';
import { BusinessProfileModel } from '../../src/models/user/businessProfile.model';
import { IUser, UserModel } from '../../src/models/user/user.model';
import {
  DogModel,
  ICreateDogRequest
} from '../../src/models/listing/animal/dog/dog.model';
import {
  DogBreedModel,
  IDogBreed
} from '../../src/models/listing/animal/dog/dogBreed.model';
import { CountryModel, ICountry } from '../../src/models/country.model';
import {
  DogVaccineModel,
  IDogVaccine
} from '../../src/models/listing/animal/dog/dogVaccine.model';

const BuyerProfile: BuyerProfileModel = require('../../src/models/user/buyerProfile.model');
const BusinessProfile: BusinessProfileModel = require('../../src/models/user/businessProfile.model');
const User: UserModel = require('../../src/models/user/user.model');

const Country: CountryModel = require('../../src/models/country.model');
const DogBreed: DogBreedModel = require('../../src/models/listing/animal/dog/dogBreed.model');
const DogVaccine: DogVaccineModel = require('../../src/models/listing/animal/dog/dogVaccine.model');
const Dog: DogModel = require('../../src/models/listing/animal/dog/dog.model');

const PetListing: PetListingModel = require('../../src/models/listing/petListing.model');

describe('Pet Listing Model (CREATE)', () => {
  let user: IUser;

  let dogVaccines: IDogVaccine[];

  beforeEach(async () => {
    const buyerProfile = await BuyerProfile.create({
      firstName: 'John',
      lastName: 'Doe'
    });

    const businessProfile = await BusinessProfile.create({
      bibbleTier: 'Verified'
    });

    user = await User.create({
      buyerProfile: buyerProfile._id,
      businessProfile: businessProfile._id,
      email: 'verified@example.com',
      password: 'password'
    });

    const dogVaccineData: Omit<IDogVaccine, '_id'>[] = [
      {
        name: 'Canine Distemper Virus (CDV)',
        isCore: true
      },
      {
        name: 'Canine Adenovirus (CAV)',
        isCore: true
      },
      {
        name: 'Canine Parvovirus (CPV)',
        isCore: true
      },
      {
        name: 'Leptospirosis',
        isCore: false
      },
      {
        name: 'Rabies',
        isCore: false
      },
      {
        name: 'Canine Infectious Respiratory Disease Complex (Kennel Cough)',
        isCore: false
      },
      {
        name: 'Canine Coronavirus (CCV)',
        isCore: false
      }
    ];

    dogVaccines = await DogVaccine.create(dogVaccineData);
  });

  afterEach(async () => {
    await PetListing.deleteMany({});
  });

  it('Create Pet Listing (all fields)', async () => {
    const goldenRetrieverBreed: IDogBreed = await DogBreed.create({
      name: 'Golden Retriever'
    });

    const singaporeCountry: ICountry = await Country.create({
      name: 'Singapore'
    });

    const dogData: ICreateDogRequest['body'] = {
      avsLicenseNumber: 'AVS123456',
      birthdate: new Date('2019-01-01'),
      breeds: [goldenRetrieverBreed],
      gender: 'Male',
      hairCoat: 'Short',
      isHdbApproved: true,
      isHypoallergenic: true,
      isMicrochipped: true,
      isNeutered: true,
      origin: singaporeCountry,
      size: 'Medium',
      vaccines: dogVaccines,
      weight: 10,
      name: 'Buddy'
    };

    const petListingData: ICreatePetListingRequest['body'] = {
      lister: user,
      animal: dogData,
      description: 'This is a description',
      price: 1000,
      media: [
        {
          type: 'Image',
          url: 'https://via.placeholder.com/150'
        }
      ],
      saleStatus: 'Available',
      saleType: 'Sale',
      species: 'Dog'
    };

    const petListing = await PetListing.create(petListingData);

    expect(petListing).to.exist;
    expect(await User.findById(petListing.lister)).to.exist;
    expect(await Dog.findById(petListing.animal)).to.exist;
  });
});
