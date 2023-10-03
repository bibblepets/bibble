import { Request, Response } from 'express';

import { IPetListing } from '../models/listing/pet-listing.model';
import { IDog } from '../models/listing/animal/dog/dog.model';

const { handleError, mapSpeciesToFunction } = require('../utils/util');

const PetListing = require('../models/listing/pet-listing.model');
const Dog = require('../models/listing/animal/dog/dog.model');

const createPetListing = async (req: Request, res: Response) => {
  let animal;

  try {
    animal = await createAnimal(req, res);
  } catch (error: any) {
    return handleError(req, res, error);
  }

  const { lister, price, description, saleType, media, species } = req.body;

  const petListing = new PetListing({
    lister,
    price,
    description,
    saleType,
    media,
    animal: animal._id,
    species
  });

  try {
    return await petListing.save().then((petListing: IPetListing) => {
      console.log('Pet listing created:', petListing._id.toString());
      return res.status(201).json(petListing);
    });
  } catch (error: any) {
    console.log('Error creating Pet listing:');
    console.log(error.message);
    req.params.id = animal._id.toString();
    await deleteAnimalById(req, res);
    return handleError(req, res, error);
  }
};

const createAnimal = async (req: Request, res: Response) => {
  const { species } = req.body;

  const funcToExecute = mapSpeciesToFunction(species, [createDog]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  throw new Error(
    '`' + species + '` is not a valid enum value for path `species`.'
  );
};

const createDog = async (req: Request, res: Response) => {
  const {
    breeds,
    vaccines,
    origin,
    name,
    gender,
    birthdate,
    size,
    weight,
    hairCoat,
    isHypoallergenic,
    isMicrochipped,
    isNeutered,
    isHdbApproved,
    avsLicenseNumber
  } = req.body;

  const dog = new Dog({
    breeds,
    vaccines,
    origin,
    name,
    gender,
    birthdate,
    size,
    weight,
    hairCoat,
    isHypoallergenic,
    isMicrochipped,
    isNeutered,
    isHdbApproved,
    avsLicenseNumber
  });

  return await dog
    .save()
    .then((dog: IDog) => {
      console.log('Dog created:', dog._id.toString());
      return dog;
    })
    .catch((error: any) => {
      console.log('Error creating Dog:');
      console.log(error.message);
      throw error;
    });
};

const getAllPetListings = async (req: Request, res: Response) => {
  return await PetListing.find()
    .then((petListings: IPetListing[]) => {
      console.log('Pet listings found:', petListings.length);
      return res.status(200).json(petListings);
    })
    .catch((error: any) => {
      console.log('Error finding Pet listings:');
      console.log(error.message);
      return handleError(req, res, error);
    });
};

const getAllPetListingsBySpecies = async (req: Request, res: Response) => {
  const { species } = req.params;

  return await PetListing.find({ species })
    .then((petListings: IPetListing[]) => {
      console.log('Pet listings found:', petListings.length);
      return res.status(200).json(petListings);
    })
    .catch((error: any) => {
      console.log('Error finding Pet listings:');
      console.log(error.message);
      return handleError(req, res, error);
    });
};

const getPetListingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  return await PetListing.findById(id)
    .then(async (petListing: IPetListing) => {
      if (!petListing) {
        return res.status(404).json({ message: 'Pet listing not found.' });
      }

      console.log('Pet listing found:', petListing._id.toString());
      return res.status(200).json(petListing);
    })
    .catch((error: any) => {
      console.log('Error finding Pet listing:');
      console.log(error.message);
      return handleError(req, res, error);
    });
};

const updatePetListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, description, media } = req.body;

  return await PetListing.findByIdAndUpdate(
    id,
    {
      price,
      description,
      media
    },
    { new: true, runValidators: true }
  )
    .then(async (petListing: IPetListing) => {
      if (!petListing) {
        return res.status(404).json({ message: 'Pet listing not found.' });
      }

      console.log('Pet listing updated:', petListing._id.toString());

      req.params.id = (petListing.animal as any)._id.toString();
      req.params.species = petListing.species;
      await updateAnimalById(req, res);

      return res.status(200).json(petListing);
    })
    .catch((error: any) => {
      console.log('Error updating Pet listing:');
      console.log(error.message);
      return handleError(req, res, error);
    });
};

const updateAnimalById = async (req: Request, res: Response) => {
  const { species } = req.params;

  const funcToExecute = mapSpeciesToFunction(species, [updateDogById]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  throw new Error(
    '`' + species + '` is not a valid enum value for path `species`.'
  );
};

const updateDogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    vaccines,
    name,
    gender,
    birthdate,
    size,
    weight,
    hairCoat,
    isHypoallergenic,
    isMicrochipped,
    isNeutered,
    isHdbApproved,
    avsLicenseNumber
  } = req.body;

  return await Dog.findByIdAndUpdate(
    id,
    {
      vaccines,
      name,
      gender,
      birthdate,
      size,
      weight,
      hairCoat,
      isHypoallergenic,
      isMicrochipped,
      isNeutered,
      isHdbApproved,
      avsLicenseNumber
    },
    { new: true, runValidators: true }
  )
    .then((dog: IDog) => {
      if (!dog) {
        return res
          .status(404)
          .json({ message: 'Dog for pet listing not found.' });
      }

      console.log('Dog updated:', dog._id.toString());
      return dog;
    })
    .catch((error: any) => {
      console.log('Error updating Dog:');
      console.log(error.message);
      throw error;
    });
};

const deletePetListingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  return await PetListing.findByIdAndDelete(id)
    .then(async (petListing: IPetListing) => {
      if (!petListing) {
        return res.status(404).json({ message: 'Pet listing not found.' });
      }

      console.log('Pet listing deleted:', petListing._id.toString());

      req.params.id = (petListing.animal as any)._id.toString();
      req.params.species = petListing.species;
      await deleteAnimalById(req, res);

      return res.status(204).json(petListing);
    })
    .catch((error: any) => {
      console.log('Error deleting Pet listing:');
      console.log(error.message);
      return handleError(req, res, error);
    });
};

const deleteAnimalById = async (req: Request, res: Response) => {
  const { species } = req.params;

  const funcToExecute = mapSpeciesToFunction(species, [deleteDogById]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  throw new Error(
    '`' + species + '` is not a valid enum value for path `species`.'
  );
};

const deleteDogById = async (req: Request, res: Response) => {
  const { id } = req.params;

  return await Dog.findByIdAndDelete(id)
    .then((dog: IDog) => {
      if (!dog) {
        return res
          .status(404)
          .json({ message: 'Dog for pet listing not found.' });
      }
      console.log('Dog deleted:', dog._id.toString());
      return dog;
    })
    .catch((error: any) => {
      console.log('Error deleting Dog:');
      console.log(error.message);
      throw error;
    });
};

module.exports = {
  createPetListing,
  getAllPetListings,
  getAllPetListingsBySpecies,
  getPetListingById,
  updatePetListingById,
  deletePetListingById
};
