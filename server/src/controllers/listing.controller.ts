import { Request, Response } from 'express';
import { IDog } from '../models/listing/pet/animal/dog/dog.model';
import { IPet } from '../models/listing/pet/pet.model';
import { IListing } from '../models/listing/listing.model';

const { Listing } = require('../models/listing/listing.model');
const { Pet } = require('../models/listing/pet/pet.model');
const { Dog } = require('../models/listing/pet/animal/dog/dog.model');

const createListing = async (req: Request, res: Response) => {
  const { itemType } = req.body;

  if (itemType === 'Pet') {
    const { animalType } = req.body;
    if (animalType === 'Dog') {
      return await createListingWithDog(req, res);
    }
  }

  return res.status(400).json({ message: 'Invalid item type' });
};

const createListingWithDog = async (req: Request, res: Response) => {
  const {
    breeds,
    vaccines,
    size,
    weight,
    hairCoat,
    isHypoallergenic,
    isMicrochipped,
    isNeutered,
    isHdbApproved,
    avsLicenseNumber
  } = req.body;

  const { animalType, origin, gender, birthdate, name } = req.body;

  const { lister, price, description, itemType, saleType, media } = req.body;

  const animal = new Dog({
    breeds,
    vaccines,
    size,
    weight,
    hairCoat,
    isHypoallergenic,
    isMicrochipped,
    isNeutered,
    isHdbApproved,
    avsLicenseNumber,
    birthdate
  });

  const item = new Pet({
    animal: animal._id,
    animalType,
    origin,
    name,
    gender,
    birthdate
  });

  const listing = new Listing({
    lister,
    item: item._id,
    price,
    description,
    itemType,
    saleType,
    media
  });

  try {
    await animal.save().then((animal: IDog) => {
      console.log('Animal created successfully:', animal._id.toString());
      return animal;
    });
  } catch (err: any) {
    console.log('Error creating animal:');
    return handleError(req, res, err);
  }

  try {
    await item.save().then((item: IPet) => {
      console.log('Item created successfully:', item._id.toString());
      return item;
    });
  } catch (err: any) {
    console.log('Error creating item:');
    req.params.id = animal._id.toString();
    req.params.animalType = animalType;
    await deleteAnimal(req);
    return handleError(req, res, err);
  }

  try {
    await listing.save().then((listing: IListing) => {
      console.log('Listing created successfully:', listing._id.toString());
      return listing;
    });
  } catch (err: any) {
    console.log('Error creating listing:');
    req.params.id = item._id.toString();
    req.params.itemType = itemType;
    await deleteItem(req);
    return handleError(req, res, err);
  }

  return res.status(201).json(listing);
};

const deleteListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id)
      .then(async (deletedListing: IListing) => {
        console.log(
          'Listing deleted successfully:',
          deletedListing._id.toString()
        );

        req.params.id = deletedListing.item.toString();
        req.params.itemType = deletedListing.itemType;

        return res.json({
          listing: deletedListing,
          item: await deleteItem(req)
        });
      })
      .catch((error: any) => {
        console.log('Error deleting Listing:\n' + error.message);
        return handleError(req, res, error);
      });
  } catch (error: any) {
    console.log('Unforeseen error deleting Listing:\n' + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req: Request) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await deletePet(req);
  }
};

const deletePet = async (req: Request) => {
  const { id } = req.params;

  return await Pet.findByIdAndDelete(id)
    .then(async (deletedPet: IPet) => {
      console.log('Pet deleted successfully:', deletedPet._id.toString());

      req.params.id = (deletedPet.animal as any)._id.toString();
      req.params.animalType = deletedPet.animalType;

      return { item: { pet: deletedPet, animal: await deleteAnimal(req) } };
    })
    .catch((error: any) => {
      console.log('Error deleting Pet:');
      throw error;
    });
};

const deleteAnimal = async (req: Request) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await deleteDog(req);
  }
};

const deleteDog = async (req: Request) => {
  const { id } = req.params;

  return await Dog.findByIdAndDelete(id)
    .then((deletedDog: IDog) => {
      console.log('Dog deleted successfully:', deletedDog._id.toString());
      return { animal: deletedDog };
    })
    .catch((error: any) => {
      console.log('Error deleting Dog:');
      throw error;
    });
};

const handleError = async (req: Request, res: Response, error: any) => {
  const errors = [];

  if (error.name === 'ValidationError') {
    errors.push(
      Object.keys(error.errors).map((key: string) => error.errors[key].message)
    );
  }

  if (error.name == 'CastError') {
    errors.push(error.message);
    return res.status(400).json({ message: error.message });
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join('\n') });
  }

  return res.status(500).json({ message: error.message });
};


module.exports = { createListing, deleteListing };
