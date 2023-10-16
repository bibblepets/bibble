import { Connection } from 'mongoose';
import { IUser, UserModel } from './models/user/user.model';
import {
  BuyerProfileModel,
  IBuyerProfile
} from './models/user/buyerProfile.model';
import {
  BusinessProfileModel,
  IBusinessProfile
} from './models/user/businessProfile.model';
import {
  PetListingModel,
  IPetListing
} from './models/listing/petListing.model';
import { DogModel, IDog } from './models/listing/animal/dog/dog.model';
import {
  DogBreedModel,
  IDogBreed
} from './models/listing/animal/dog/dogBreed.model';
import {
  DogVaccineModel,
  IDogVaccine
} from './models/listing/animal/dog/dogVaccine.model';
import { CountryModel, ICountry } from './models/country.model';

const User: UserModel = require('./models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('./models/user/buyerProfile.model');
const BusinessProfile: BusinessProfileModel = require('./models/user/businessProfile.model');
const {
  PetListing,
  saleTypes,
  mediaTypes,
  speciesTypes,
  saleStatuses
}: {
  PetListing: PetListingModel;
  saleTypes: string[];
  mediaTypes: string[];
  speciesTypes: string[];
  saleStatuses: string[];
} = require('./models/listing/petListing.model');
const {
  Dog,
  sizes,
  hairCoats,
  genders
}: {
  Dog: DogModel;
  sizes: string[];
  hairCoats: string[];
  genders: string[];
} = require('./models/listing/animal/dog/dog.model');
const DogBreed: DogBreedModel = require('./models/listing/animal/dog/dogBreed.model');
const DogVaccine: DogVaccineModel = require('./models/listing/animal/dog/dogVaccine.model');
const Country: CountryModel = require('./models/country.model');

// Seed Data -------------------------------------------------------------------
const adminBuyerProfile: Omit<
  IBuyerProfile,
  '_id' | 'createdAt' | 'updatedAt'
> = {
  firstName: 'Bibble',
  lastName: 'Admin'
};

const adminBusinessProfile: Omit<
  IBusinessProfile,
  '_id' | 'createdAt' | 'updatedAt'
> = {
  bibbleTier: 'Partner',
  businessName: 'Bibble',
  businessEmail: 'teamsaturdaydevs@gmail.com',
  businessContact: '12345678'
};

const admin: Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'buyerProfile'> = {
  email: 'admin@bibble.com',
  password: '123456'
};

const dogBreeds: Omit<IDogBreed, '_id'>[] = [
  { name: 'Labrador Retriever' },
  { name: 'German Shepherd' },
  { name: 'Golden Retriever' },
  { name: 'Bulldog' },
  { name: 'Poodle' },
  { name: 'Beagle' },
  { name: 'Rottweiler' },
  { name: 'Yorkshire Terrier' },
  { name: 'Dachshund' },
  { name: 'Boxer' },
  { name: 'Siberian Husky' },
  { name: 'Pembroke Welsh Corgi' },
  { name: 'Australian Shepherd' },
  { name: 'Doberman Pinscher' },
  { name: 'Great Dane' },
  { name: 'Cavalier King Charles Spaniel' },
  { name: 'Shih Tzu' },
  { name: 'Boston Terrier' },
  { name: 'Pug' },
  { name: 'Havanese' }
];

const dogVaccines: Omit<IDogVaccine, '_id'>[] = [
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

const countries: Omit<ICountry, '_id'>[] = [
  { name: 'United States' },
  { name: 'China' },
  { name: 'United Kingdom' },
  { name: 'Germany' },
  { name: 'Brazil' },
  { name: 'Japan' },
  { name: 'France' },
  { name: 'Canada' },
  { name: 'Italy' },
  { name: 'Australia' },
  { name: 'South Korea' },
  { name: 'Spain' },
  { name: 'Netherlands' },
  { name: 'India' },
  { name: 'Russia' },
  { name: 'Mexico' },
  { name: 'Turkey' },
  { name: 'Sweden' },
  { name: 'Poland' },
  { name: 'Belgium' }
];
// ----------------------------------------------------------------------------

// Data Initialisation Functions ----------------------------------------------
const initDogBreeds = async (): Promise<IDogBreed[]> => {
  return await DogBreed.create(dogBreeds).then((dogBreeds: IDogBreed[]) => {
    console.log('Dog Breeds initialised');
    return dogBreeds;
  });
};

const initDogVaccines = async (): Promise<IDogVaccine[]> => {
  return await DogVaccine.create(dogVaccines).then(
    (dogVaccines: IDogVaccine[]) => {
      console.log('Dog Vaccines initialised');
      return dogVaccines;
    }
  );
};

const initCountries = async (): Promise<ICountry[]> => {
  return await Country.create(countries).then((countries: ICountry[]) => {
    console.log('Countries initialised');
    return countries;
  });
};

const initAdmin = async (): Promise<IUser> => {
  return await BuyerProfile.create(adminBuyerProfile).then(
    async (buyerProfile: IBuyerProfile) => {
      return await BusinessProfile.create(adminBusinessProfile).then(
        async (businessProfile: IBusinessProfile) => {
          return await User.create({
            buyerProfile: buyerProfile._id,
            businessProfile: businessProfile._id,
            email: admin.email,
            password: admin.password
          }).then((user: IUser) => {
            console.log('Admin initialised');
            return user;
          });
        }
      );
    }
  );
};

const initDogs = async (
  dogBreeds: IDogBreed[],
  dogVaccines: IDogVaccine[],
  countries: ICountry[]
) => {
  const numDogs = 10;
  let dogList: IDog[] = [];

  for (let i = 0; i < numDogs; i++) {
    // Randomly select 1-2 dog breeds
    const numBreeds = Math.floor(Math.random() * 2) + 1;
    const breedIds = [];
    for (let j = 0; j < numBreeds; j++) {
      const breedIndex = Math.floor(Math.random() * dogBreeds.length);
      breedIds.push(dogBreeds[breedIndex]._id);
    }

    // Randomly select 0-3 non-core dog vaccines
    const numNonCoreVaccines = Math.floor(Math.random() * 4);
    const nonCoreVaccineIds = [];
    const nonCoreVaccines = dogVaccines.filter((v) => !v.isCore);
    for (let j = 0; j < numNonCoreVaccines; j++) {
      const vaccineIndex = Math.floor(Math.random() * nonCoreVaccines.length);
      nonCoreVaccineIds.push(nonCoreVaccines[vaccineIndex]._id);
    }

    // Create the dog object with random values
    const dog: Omit<IDog, '_id' | 'createdAt' | 'updatedAt'> = {
      breeds: breedIds,
      vaccines: [
        ...dogVaccines.filter((v) => v.isCore).map((v) => v._id),
        ...nonCoreVaccineIds
      ],
      origin: countries[Math.floor(Math.random() * countries.length)]._id,
      name: `Dog ${i + 1}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      birthdate: getRandomBirthdate(),
      size: sizes[Math.floor(Math.random() * sizes.length)],
      weight: Math.floor(Math.random() * 50) + 1,
      hairCoat: hairCoats[Math.floor(Math.random() * hairCoats.length)],
      isHypoallergenic: Math.random() < 0.5,
      isMicrochipped: Math.random() < 0.5,
      isNeutered: Math.random() < 0.5,
      isHdbApproved: Math.random() < 0.5,
      avsLicenseNumber: getRandomAVS()
    };

    // Save the dog object to the database
    await new Dog(dog)
      .save()
      .then((dog: IDog) => dogList.push(dog))
      .catch((error: any) => console.log('Error creating Dog:', error));
  }
  console.log('Dogs initialised');
  return dogList;
};

const initPetListings = async (admin: IUser, dogList: IDog[]) => {
  let petListings: IPetListing[] = [];

  for (const dog of dogList) {
    await PetListing.create({
      lister: admin._id,
      price: Math.floor(Math.random() * 10000) + 1,
      description: 'Lorem ipsum, this is a description.',
      saleType: saleTypes[Math.floor(Math.random() * saleTypes.length)],
      media: generateMedia(mediaTypes),
      animal: dog._id,
      species: speciesTypes[0] // Dog
    })
      .then((petListing: IPetListing) => {
        petListings.push(petListing);
      })
      .catch((error: any) => console.log('Error creating Pet Listing:', error));
  }

  console.log('Pet Listings initialised');
  return petListings;
};

export const initialiseData = async (): Promise<void> => {
  let dogBreeds: IDogBreed[] | undefined;
  let dogVaccines: IDogVaccine[] | undefined;
  let countries: ICountry[] | undefined;
  let admin: IUser | undefined;
  let dogs: IDog[] | undefined;
  let petListings: IPetListing[] | undefined;

  try {
    console.log('Initialising Data...');
    await db.asPromise();
    dogBreeds = await initDogBreeds();
    dogVaccines = await initDogVaccines();
    countries = await initCountries();
    admin = await initAdmin();

    dogs = await initDogs(dogBreeds, dogVaccines, countries);
    petListings = await initPetListings(admin, dogs);

    console.log('Data initialisation complete');
  } catch (error: any) {
    console.log('Error initialising data, wiping...');
    if (dogBreeds) {
      await DogBreed.deleteMany({ _id: { $in: dogBreeds.map((d) => d._id) } });
    }
    if (dogVaccines) {
      await DogVaccine.deleteMany({
        _id: { $in: dogVaccines.map((d) => d._id) }
      });
    }
    if (countries) {
      await Country.deleteMany({ _id: { $in: countries.map((c) => c._id) } });
    }
    if (admin) {
      await User.deleteOne({ _id: admin._id });
      await BuyerProfile.deleteOne({ _id: admin.buyerProfile });
      await BusinessProfile.deleteOne({ _id: admin.businessProfile });
    }
    if (dogs) {
      await Dog.deleteMany({ _id: { $in: dogs.map((d) => d._id) } });
    }
    if (petListings) {
      await PetListing.deleteMany({
        _id: { $in: petListings.map((p) => p._id) }
      });
    }
    console.log('Data wipe complete');
    console.log(error);
  } finally {
    db.close();
    console.log('Disconnected from MongoDB `' + db.name + '`');
    process.exit();
  }
};
// ----------------------------------------------------------------------------

// Main -----------------------------------------------------------------------
require('dotenv').config();
const db: Connection = require('./mongodb/db');
initialiseData();
// ----------------------------------------------------------------------------

// Utility Functions ----------------------------------------------------------
const getRandomBirthdate = () => {
  const today = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(today.getMonth() - 12);

  const randomTimestamp =
    Math.floor(Math.random() * (today.getTime() - twelveMonthsAgo.getTime())) +
    twelveMonthsAgo.getTime();
  const randomDate = new Date(randomTimestamp);

  return randomDate;
};

const getRandomAVS = (): string => {
  const numbers = '0123456789';

  let randomString = 'AS';
  randomString += Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  for (let i = 0; i < 3; i++) {
    const numberIndex = Math.floor(Math.random() * numbers.length);
    randomString += numbers[numberIndex];
  }

  return randomString;
};

const generateMedia = (mediaTypes: string[]) => {
  const numMedia = Math.floor(Math.random() * 4) + 1;
  const media = [];
  for (let i = 0; i < numMedia; i++) {
    media.push({
      type: mediaTypes[Math.floor(Math.random() * mediaTypes.length)],
      url: 'https://i.pinimg.com/1200x/a2/bd/c5/a2bdc5f89c08b4955867e62141bf614d.jpg'
    });
  }
  return media;
};
