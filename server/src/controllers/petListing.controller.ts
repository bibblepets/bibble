import { Response } from 'express';
import { handleError } from '../utils/util';
import {
  PetListingModel,
  ICreatePetListingRequest,
  IUpdatePetListingRequest,
  IGetAllPetListingsRequest,
  IGetAllPetListingsBySpeciesRequest,
  IGetPetListingByIdRequest,
  IDeletePetListingByIdRequest
} from '../models/listing/petListing.model';
import { DogModel } from '../models/listing/animal/dog/dog.model';

require('../models/country.model');
const {
  PetListing
}: {
  PetListing: PetListingModel;
} = require('../models/listing/petListing.model');
const {
  Dog
}: { Dog: DogModel } = require('../models/listing/animal/dog/dog.model');
require('../models/listing/animal/breed.model');
require('../models/listing/animal/vaccine.model');

export const createPetListing = async (
  req: ICreatePetListingRequest,
  res: Response
) => {
  // Extract fields from request body
  // Pet listing fields
  const { lister, price, description, saleType, media, animal, species } =
    req.body;

  let createdAnimal;
  let createdPetListing;

  try {
    // Validate request
    console.log('Validating request body...');
    if (!lister.businessProfile) {
      return res
        .status(400)
        .json({ message: 'A Business profile is required to make a listing.' });
    }
    await validateCreateAnimal(req);
    await PetListing.validate(
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
    createdAnimal = await createAnimal(req);
    console.log('Animal created.', createdAnimal._id);

    // Create pet listing
    console.log('Creating pet listing...');
    createdPetListing = await PetListing.create({
      lister: lister,
      price: price,
      description: description,
      saleType: saleType,
      media: media,
      animal: createdAnimal,
      species: species
    });
    console.log('Pet listing created.', createdPetListing._id);

    // Populate pet listing
    console.log('Populating pet listing...');
    const populatedPetListing = await createdPetListing.populate([
      { path: 'lister', populate: { path: 'buyerProfile businessProfile' } },
      { path: 'animal', populate: { path: 'breeds vaccines origin' } }
    ]);
    console.log('Pet listing populated.');

    return res.status(201).json({
      petListing: populatedPetListing,
      message: 'Pet listing created successfully.'
    });
  } catch (error: any) {
    if (createdAnimal) {
      console.log('Deleting animal...');
      await createdAnimal.deleteOne();
      console.log('Animal deleted.');
    }

    if (createdPetListing) {
      console.log('Deleting pet listing...');
      await createdPetListing.deleteOne();
      console.log('Pet listing deleted.');
    }

    return handleError(res, error);
  }
};

const validateCreateAnimal = async (req: ICreatePetListingRequest) => {
  const { species } = req.body;

  if (species == 'Dog') {
    return await Dog.validate(req.body.animal);
  } // else if...
};

const createAnimal = async (req: ICreatePetListingRequest) => {
  const { species } = req.body;
  let createdAnimal;

  if (species == 'Dog') {
    createdAnimal = await Dog.create(req.body.animal);
  } // else if...

  if (!createdAnimal) {
    throw new Error('Error creating animal.');
  }

  return createdAnimal;
};

export const getAllPetListings = async (
  req: IGetAllPetListingsRequest,
  res: Response
) => {
  try {
    const allPetListings = await PetListing.find().populate([
      { path: 'lister', populate: { path: 'buyerProfile businessProfile' } },
      { path: 'animal', populate: { path: 'breeds vaccines origin' } }
    ]);
    return res.status(200).json(allPetListings);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const getAllPetListingsBySpecies = async (
  req: IGetAllPetListingsBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  try {
    const speciesPetListings = await PetListing.find({ species }).populate([
      { path: 'lister', populate: { path: 'buyerProfile businessProfile' } },
      { path: 'animal', populate: { path: 'breeds vaccines origin' } }
    ]);
    return res.status(200).json(speciesPetListings);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const getPetListingById = async (
  req: IGetPetListingByIdRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const petListing = await PetListing.findById(id).then(
      async (petListing) =>
        await petListing?.populate([
          {
            path: 'lister',
            populate: { path: 'buyerProfile businessProfile' }
          },
          { path: 'animal', populate: { path: 'breeds vaccines origin' } }
        ])
    );
    return res.status(200).json(petListing);
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const updatePetListingById = async (
  req: IUpdatePetListingRequest,
  res: Response
) => {
  const { id } = req.params;
  const { price, description, media } = req.body;

  try {
    // Get pet listing
    const petListing = await PetListing.findById(id);

    if (!petListing) {
      return res.status(404).json({ message: 'Pet listing not found.' });
    }

    const listerId = petListing.lister;
    const species = petListing.species;
    const animalId = petListing.animal;

    // Validate request
    console.log('Validating request body...');
    console.log('Validating Animal request body...');
    await validateUpdateAnimal(req, species);

    if (price || description || media) {
      console.log('Validating Pet Listing request body...');
      const petListingPathsToValidate: string[] = [
        'price',
        'description',
        'media'
      ].filter((key: string) => req.body[key as keyof typeof req.body]);
      await PetListing.validate(
        { price, description, media },
        petListingPathsToValidate
      );
    }
    console.log('Request body validated.');

    // Update animal
    console.log('Updating animal...');
    const updatedAnimal = await updateAnimal(req, species, animalId.toString());
    console.log('Animal updated.', updatedAnimal._id);

    // Update pet listing
    console.log('Updating pet listing...');
    await petListing.updateOne({
      price: price,
      description: description,
      media: media
    });
    console.log('Pet listing updated.', petListing._id);

    // Populate pet listing
    console.log('Populating pet listing...');
    const updatedPetListing = await PetListing.findById(id);
    const populatedPetListing = await updatedPetListing?.populate([
      { path: 'lister', populate: { path: 'buyerProfile businessProfile' } },
      { path: 'animal', populate: { path: 'breeds vaccines origin' } }
    ]);

    return res.status(200).json({
      petListing: populatedPetListing,
      message: 'Pet listing updated successfully.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};

const validateUpdateAnimal = async (
  req: IUpdatePetListingRequest,
  species: string
) => {
  if (species == 'Dog') {
    console.log('Validating Dog request body...');
    return await Dog.validate(req.body.animal, Object.keys(req.body.animal));
  } // else if...
};

const updateAnimal = async (
  req: IUpdatePetListingRequest,
  species: string,
  animalId: string
) => {
  let updatedAnimal;

  if (species == 'Dog') {
    updatedAnimal = await Dog.findByIdAndUpdate(animalId, req.body.animal, {
      new: true
    });
  } // else if...

  if (!updatedAnimal) {
    throw new Error('Animal not found.');
  }
  return updatedAnimal;
};

export const deletePetListingById = async (
  req: IDeletePetListingByIdRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const petListing = await PetListing.findById(id);

    if (!petListing) {
      return res.status(404).json({ message: 'Pet listing not found.' });
    }

    const species = petListing.species;
    const animalId = petListing.animal;

    // Delete animal in pet listing
    console.log('Deleting animal in pet listing...');
    const deletedAnimal = await deleteAnimalById(
      req,
      species,
      animalId.toString()
    );
    console.log('Animal in pet listing deleted.', deletedAnimal?._id);

    // Delete pet listing
    console.log('Deleting pet listing...');
    await petListing.deleteOne();
    console.log('Pet listing deleted.', petListing._id);

    return res
      .status(200)
      .json({ message: 'Pet listing deleted successfully.' });
  } catch (error: any) {
    return handleError(res, error);
  }
};

const deleteAnimalById = async (
  req: IDeletePetListingByIdRequest,
  species: string,
  animalId: string
) => {
  if (species == 'Dog') {
    return await Dog.findByIdAndDelete(animalId);
  } // else if...

  throw new Error('Error deleting animal.');
};
