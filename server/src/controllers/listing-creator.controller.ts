import { Request, Response } from 'express';
import { assertFields, handleError } from '../utils/util';
import {
  ICreateListingCreatorRequest,
  IUpdateBiographyRequest,
  IUpdateBiologyRequest,
  IUpdateLegalRequest,
  IUpdateMediaRequest,
  IUpdateMedicalRequest,
  IUpdatePriceRequest,
  IUpdateListingCreatorRequest,
  ListingCreatorModel
} from '../models/listing/listing-creator.model';
import {
  IAnimal,
  ICreateAnimalRequest
} from '../models/listing/animal/animal.model';
import {
  ICreateListingRequest,
  ListingModel
} from '../models/listing/listing.model';
import { DogModel } from '../models/listing/animal/dog/dog.model';

const {
  Listing
}: { Listing: ListingModel } = require('../models/listing/listing.model');
const {
  ListingCreator
}: {
  ListingCreator: ListingCreatorModel;
} = require('../models/listing/listing-creator.model');
const {
  Dog
}: { Dog: DogModel } = require('../models/listing/animal/dog/dog.model');

export const getAllMyListingCreators = async (req: Request, res: Response) => {
  try {
    const listingCreators = await ListingCreator.find();
    return res.status(200).json(listingCreators);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const getListingCreatorById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const listingCreator = await ListingCreator.findById(id);
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const createListingCreator = async (
  req: ICreateListingCreatorRequest,
  res: Response
) => {
  try {
    const { saleType, user } = req.body;

    const listingCreator = await ListingCreator.create({
      stage: 0,
      saleType: saleType,
      lister: user._id
    });
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(201).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateListingCreatorById = async (
  req: IUpdateListingCreatorRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const listingCreator = await ListingCreator.findByIdAndUpdate(
      id, {
        ...req.body
      },
      { new: true }
    );
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateBiology = async (
  req: IUpdateBiologyRequest,
  res: Response
) => {
  try {
    const { _id, stage, species, breeds, user } = req.body;

    assertFields(['_id', 'stage', 'species', 'breeds'], req);

    const listingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage,
        biology: {
          species,
          breeds
        }
      },
      { new: true }
    );
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateBiography = async (
  req: IUpdateBiographyRequest,
  res: Response
) => {
  try {
    const { _id, stage, origin, gender, birthdate, description, user } = req.body;

    assertFields(
      ['_id', 'stage', 'origin', 'gender', 'birthdate', 'description'],
      req
    );

    const listingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage,
        biography: {
          origin,
          gender,
          birthdate,
          description
        }
      },
      { new: true }
    );
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateMedical = async (
  req: IUpdateMedicalRequest,
  res: Response
) => {
  try {
    const { _id, stage, size, weight, hairCoat, vaccines, user } = req.body;

    assertFields(
      ['_id', 'stage', 'size', 'weight', 'hairCoat', 'vaccines'],
      req
    );

    const listingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage,
        medical: {
          size,
          weight,
          hairCoat,
          vaccines
        }
      },
      { new: true }
    );
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateLegal = async (req: IUpdateLegalRequest, res: Response) => {
  try {
    const { _id, stage, avsLicenseNumber, legalTags, user } = req.body;

    assertFields(['_id', 'stage', 'avsLicenseNumber'], req);

    const listingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage,
        legal: {
          avsLicenseNumber,
          legalTags
        }
      },
      { new: true }
    );
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updateMedia = async (req: IUpdateMediaRequest, res: Response) => {
  // TODO TITUS
};

export const updatePrice = async (req: IUpdatePriceRequest, res: Response) => {
  try {
    const { _id, stage, price, user } = req.body;

    assertFields(['_id', 'stage', 'price'], req);

    const listingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage,
        price
      },
      { new: true }
    );
    const populatedListingCreator = await populateFields(listingCreator);

    return res.status(200).json(populatedListingCreator);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const createListing = async (
  req: ICreateListingRequest,
  res: Response
) => {
  let createdAnimal;
  let createdListing;

  try {
    const { listingCreatorId } = req.body;

    assertFields(['listingCreatorId'], req);

    const listingCreator = await ListingCreator.findById(listingCreatorId);
    const populatedListingCreator = await populateFields(listingCreator);

    const lister = populatedListingCreator.lister;
    const price = populatedListingCreator.price;
    const description = populatedListingCreator.biography?.description;
    const saleType = populatedListingCreator.saleType;
    const media = populatedListingCreator.media;
    const species = populatedListingCreator.biology?.species;
    const animal = {
      breeds: populatedListingCreator.biology?.breeds,
      vaccines: populatedListingCreator.medical?.vaccines,
      origin: populatedListingCreator.biography?.origin,
      name: undefined,
      gender: populatedListingCreator.biography?.gender,
      birthdate: populatedListingCreator.biography?.birthdate,
      size: populatedListingCreator.medical?.size,
      weight: populatedListingCreator.medical?.weight,
      hairCoat: populatedListingCreator.medical?.hairCoat,
      ...populatedListingCreator.legal?.legalTags?.reduce(
        (obj: Record<string, boolean>, tag: string) => {
          obj[tag] = true;
          return obj;
        },
        {}
      ),
      avsLicenseNumber: populatedListingCreator.legal?.avsLicenseNumber
    } as ICreateAnimalRequest['body'];

    // Validate request
    console.log('Validating request body...');
    // TODO: Validate lister in middleware
    await validateCreateAnimal(species, animal);
    await Listing.validate(
      {
        lister: lister,
        price: price,
        description: description,
        saleType: saleType,
        media: media,
        species: species
      },
      ['lister', 'price', 'description', 'saleType', 'media', 'species']
    );
    console.log('Request body validated.');

    // Create animal
    console.log('Creating animal...');
    createdAnimal = await createAnimal(species, animal);
    console.log('Animal created.', createdAnimal._id);

    // Create pet listing
    console.log('Creating pet listing...');
    createdListing = await Listing.create({
      lister: lister,
      price: price,
      description: description,
      saleType: saleType,
      media: media,
      animal: createdAnimal,
      species: species
    });
    console.log('Pet listing created.', createdListing._id);

    // Populate pet listing
    console.log('Populating pet listing...');
    const populatedListing = await createdListing.populate([
      { path: 'lister', populate: { path: 'buyerProfile businessProfile' } },
      { path: 'animal', populate: { path: 'breeds vaccines origin' } }
    ]);
    console.log('Pet listing populated.');

    // Delete listing creator
    console.log('Deleting listing creator...');
    const listingCreatorToDelete = await ListingCreator.findById(listingCreatorId);
    await listingCreatorToDelete!.deleteOne();
    console.log('Listing creator deleted.');

    return res.status(201).json({
      listing: populatedListing,
      message: 'Pet listing created successfully.'
    });
  } catch (error: any) {
    if (createdAnimal) {
      console.log('Deleting animal...');
      await createdAnimal.deleteOne();
      console.log('Animal deleted.');
    }

    if (createdListing) {
      console.log('Deleting pet listing...');
      await createdListing.deleteOne();
      console.log('Pet listing deleted.');
    }

    return handleError(res, error);
  }
};

const validateCreateAnimal = async (
  species: string,
  animal: ICreateAnimalRequest['body']
) => {
  if (species == 'Dog') {
    return await Dog.validate(animal);
  } // else if...
};

const createAnimal = async (
  species: string,
  animal: ICreateAnimalRequest['body']
) => {
  let createdAnimal;

  if (species == 'Dog') {
    createdAnimal = await Dog.create(animal);
  } // else if...

  if (!createdAnimal) {
    throw new BibbleError('Error creating animal.');
  }

  return createdAnimal;
};


async function populateFields(listingCreator: any) {
  const populatedListingCreator = await listingCreator.populate([
    'lister',
    'biology.breeds',
    'biography.origin',
    'medical.vaccines'
  ]);

  return populatedListingCreator;
}
