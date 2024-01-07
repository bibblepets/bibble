import { Response } from 'express';
import { BibbleError, FieldAssertionError } from '../errors/errors.class';
import { handleError } from '../utils/util';
import {
  ListingModel,
  ICreateListingRequest,
  IUpdateListingRequest,
  IGetAllListingsRequest,
  IGetAllListingsBySpeciesRequest,
  IGetListingByIdRequest,
  IDeleteListingByIdRequest,
  IGetMyListingsRequest,
  IUpdateListingMediaRequest
} from '../models/listing/listing.model';
import { DogModel } from '../models/listing/animal/dog/dog.model';
import { IMedia } from '../models/listing/media.model';
import { listingBucketName, putMedia } from '../services/s3';

require('../models/country.model');
const {
  Listing
}: {
  Listing: ListingModel;
} = require('../models/listing/listing.model');
const {
  Dog
}: { Dog: DogModel } = require('../models/listing/animal/dog/dog.model');
require('../models/listing/animal/breed.model');
require('../models/listing/animal/vaccine.model');

export const createListing = async (
  req: ICreateListingRequest,
  res: Response
) => {
  // // Extract fields from request body
  // // Pet listing fields
  // const { user, price, description, saleType, media, animal, species } =
  //   req.body;
  // let createdAnimal;
  // let createdListing;
  // try {
  //   // Validate request
  //   console.log('Validating request body...');
  //   await validateCreateAnimal(req);
  //   await Listing.validate(
  //     {
  //       lister: user._id,
  //       price: price,
  //       description: description,
  //       saleType: saleType,
  //       media: media,
  //       species: species
  //     },
  //     ['lister', 'price', 'description', 'saleType', 'media', 'species']
  //   );
  //   console.log('Request body validated.');
  //   // Create animal
  //   console.log('Creating animal...');
  //   createdAnimal = await createAnimal(req);
  //   console.log('Animal created.', createdAnimal._id);
  //   // Create pet listing
  //   console.log('Creating pet listing...');
  //   createdListing = await Listing.create({
  //     lister: user._id,
  //     price: price,
  //     description: description,
  //     saleType: saleType,
  //     media: media,
  //     animal: createdAnimal,
  //     species: species
  //   });
  //   console.log('Pet listing created.', createdListing._id);
  //   // Populate pet listing
  //   console.log('Populating pet listing...');
  //   const populatedListing = await createdListing.populateAll();
  //   console.log('Pet listing populated.');
  //   return res.status(201).json({
  //     listing: populatedListing,
  //     message: 'Pet listing created successfully.'
  //   });
  // } catch (error: any) {
  //   if (createdAnimal) {
  //     console.log('Deleting animal...');
  //     await createdAnimal.deleteOne();
  //     console.log('Animal deleted.');
  //   }
  //   if (createdListing) {
  //     console.log('Deleting pet listing...');
  //     await createdListing.deleteOne();
  //     console.log('Pet listing deleted.');
  //   }
  //   return handleError(res, error);
  // }
};

const validateCreateAnimal = async (req: ICreateListingRequest) => {
  const { species } = req.body;

  if (species == 'Dog') {
    return await Dog.validate(req.body.animal);
  } // else if...
};

const createAnimal = async (req: ICreateListingRequest) => {
  const { species } = req.body;
  let createdAnimal;

  if (species == 'Dog') {
    createdAnimal = await Dog.create(req.body.animal);
  } // else if...

  if (!createdAnimal) {
    throw new BibbleError('Error creating animal.');
  }

  return createdAnimal;
};

export const getAllListings = async (
  req: IGetAllListingsRequest,
  res: Response
) => {
  // try {
  //   const allListings = await Listing.find()
  //     .then(
  //       async (listings) =>
  //         await Promise.all(
  //           listings.map(async (listing) => await listing.populateAll())
  //         )
  //     )
  //     .then((listings) =>
  //       listings.sort(
  //         (a, b) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       )
  //     );
  //   return res.status(200).json(allListings);
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
  return res.status(200).json([]);
};

export const getAllListingsBySpecies = async (
  req: IGetAllListingsBySpeciesRequest,
  res: Response
) => {
  // const { species } = req.params;
  // try {
  //   const speciesListings = await Listing.find({ species }).then(
  //     async (listings) =>
  //       await Promise.all(
  //         listings.map(async (listing) => await listing.populateAll())
  //       )
  //   );
  //   return res.status(200).json(speciesListings);
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
};

export const getListingById = async (
  req: IGetListingByIdRequest,
  res: Response
) => {
  // const { id } = req.params;
  // try {
  //   const listing = await Listing.findById(id).then(
  //     async (listing) => await listing?.populateAll()
  //   );
  //   return res.status(200).json(listing);
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
};

export const getMyListings = async (
  req: IGetMyListingsRequest,
  res: Response
) => {
  // const { user } = req.body;
  // try {
  //   console.log('Getting my listings...');
  //   const myListings = await Listing.find({ lister: user._id }).then(
  //     async (listings) =>
  //       await Promise.all(
  //         listings.map(async (listing) => await listing.populateAll())
  //       )
  //   );
  //   return res.status(200).json(myListings);
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
  return res.json(200).json([]);
};

export const updateListingById = async (
  req: IUpdateListingRequest,
  res: Response
) => {
  // const { id } = req.params;
  // const { price, description, media, user } = req.body;
  // try {
  //   // Get pet listing
  //   const listing = await Listing.findById(id);
  //   if (!listing) {
  //     return res.status(404).json({ message: 'Pet listing not found.' });
  //   }
  //   const listerId = listing.lister;
  //   const species = listing.species;
  //   const animalId = listing.animal;
  //   // Validate request
  //   console.log('Validating request body...');
  //   if (listerId.toString() !== user._id.toString()) {
  //     throw new BibbleError('Unauthorized.');
  //   }
  //   console.log('Validating Animal request body...');
  //   await validateUpdateAnimal(req, species);
  //   if (price || description || media) {
  //     console.log('Validating Pet Listing request body...');
  //     const listingPathsToValidate: string[] = [
  //       'price',
  //       'description',
  //       'media'
  //     ].filter((key: string) => req.body[key as keyof typeof req.body]);
  //     await Listing.validate(
  //       { price, description, media },
  //       listingPathsToValidate
  //     );
  //   }
  //   console.log('Request body validated.');
  //   // Update animal
  //   console.log('Updating animal...');
  //   const updatedAnimal = await updateAnimal(req, species, animalId.toString());
  //   console.log('Animal updated.', updatedAnimal._id);
  //   // Update pet listing
  //   console.log('Updating pet listing...');
  //   await listing.updateOne(req.body, { new: true });
  //   console.log('Pet listing updated.', listing._id);
  //   // Populate pet listing
  //   console.log('Populating pet listing...');
  //   const updatedListing = await Listing.findById(id).then(async (listing) =>
  //     listing?.populateAll()
  //   );
  //   return res.status(200).json({
  //     listing: updatedListing,
  //     message: 'Pet listing updated successfully.'
  //   });
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
};

export const updateListingMediaById = async (
  req: IUpdateListingMediaRequest,
  res: Response
) => {
  // try {
  //   const { id } = req.params;
  //   const { mediaNames, user } = req.body;
  //   const files = req.files as Express.Multer.File[];
  //   // Validate request
  //   if ((!mediaNames || mediaNames.length === 0) && files.length === 0) {
  //     throw new BibbleError('Please provide at least one photo.');
  //   }
  //   let media: Omit<IMedia, '_id'>[] | undefined;
  //   if (Array.isArray(mediaNames) && mediaNames.length > 0) {
  //     media = mediaNames.map((name) => ({ name, url: undefined }));
  //   }
  //   const uploadedMedia = await putMedia(id, files, media, listingBucketName);
  //   // Update pet listing
  //   const updatedListing = await Listing.findByIdAndUpdate(
  //     id,
  //     {
  //       media: uploadedMedia
  //     },
  //     { new: true }
  //   ).then(async (listing) => await listing?.populateAll());
  //   return res.status(200).json({
  //     listing: updatedListing,
  //     message: 'Pet listing media updated successfully.'
  //   });
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
};

const validateUpdateAnimal = async (
  req: IUpdateListingRequest,
  species: string
) => {
  //   if (species == 'Dog') {
  //     console.log('Validating Dog request body...');
  //     return await Dog.validate(
  //       req.body.animal,
  //       Object.keys(req.body.animal ? req.body.animal : {})
  //     );
  //   } // else if...
};

const updateAnimal = async (
  req: IUpdateListingRequest,
  species: string,
  animalId: string
) => {
  // let updatedAnimal;
  // if (species == 'Dog') {
  //   updatedAnimal = await Dog.findByIdAndUpdate(animalId, req.body.animal, {
  //     new: true
  //   });
  // } // else if...
  // if (!updatedAnimal) {
  //   throw new BibbleError('Animal not found.');
  // }
  // return updatedAnimal;
};

export const deleteListingById = async (
  req: IDeleteListingByIdRequest,
  res: Response
) => {
  // const { id } = req.params;
  // try {
  //   const listing = await Listing.findById(id);
  //   if (!listing) {
  //     return res.status(404).json({ message: 'Pet listing not found.' });
  //   }
  //   const species = listing.species;
  //   const animalId = listing.animal;
  //   // Delete animal in pet listing
  //   console.log('Deleting animal in pet listing...');
  //   const deletedAnimal = await deleteAnimalById(
  //     req,
  //     species,
  //     animalId.toString()
  //   );
  //   console.log('Animal in pet listing deleted.', deletedAnimal?.value?._id);
  //   // Delete pet listing
  //   console.log('Deleting pet listing...');
  //   await listing.deleteOne();
  //   console.log('Pet listing deleted.', listing._id);
  //   return res
  //     .status(200)
  //     .json({ message: 'Pet listing deleted successfully.' });
  // } catch (error: any) {
  //   return handleError(res, error);
  // }
};

const deleteAnimalById = async (
  req: IDeleteListingByIdRequest,
  species: string,
  animalId: string
) => {
  // if (species == 'Dog') {
  //   return await Dog.findByIdAndDelete(animalId);
  // } // else if...
  // throw new BibbleError('Error deleting animal.');
};
