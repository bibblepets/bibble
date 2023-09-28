import { Request, Response } from 'express';
import { IListing } from '../models/listing.model';
import { IPet } from '../models/pet.model';
import { IDog } from '../models/dog.model';

const Listing = require('../models/listing.model');
const Pet = require('../models/pet.model');
const Dog = require('../models/dog.model');

const createListing = async (req: Request, res: Response) => {
  const { listerId, price, description, itemType, saleType, media } = req.body;

  await createItem(req)
    .then( async (response: any) => {
      const createdItem = response.item;

      await Listing.create({
        listerId,
        itemId: createdItem[itemType.toLowerCase()]._id,
        price,
        description,
        itemType,
        saleType,
        media
      })
        .then((listing: IListing) => {
          console.log('Listing created successfully: ' + listing);
          return res.json({ listing: listing, item: createdItem });
        })
        .catch((error: Error) => {
          let message = 'Error creating Listing:\n' + error.message;
          return res.json({ message: message });
        });
    });
}

const createItem = async (req: Request) => {
  const { itemType } = req.body;

  if (itemType === 'Pet') {
    return await createPet(req);
  }
}

const createPet = async (req: Request) => {
  const { animalType, gender, birthdate } = req.body;
  const { name } : { name?: string } = req.body;

  return await createAnimal(req)
    .then( async (response: any) => {
      const createdAnimal = response.animal;

      return await Pet.create({
        animalId: createdAnimal._id,
        animalType,
        name,
        gender,
        birthdate,
      })
        .then((pet: IPet) => {
          console.log('Pet created successfully: ' + pet);
          return { item: { pet: pet, animal: createdAnimal }};
        })
        .catch((error: Error) => {
          let message = 'Error creating Pet:\n' + error.message;
          throw new Error(message);
        });
    });
}

const createAnimal = async (req: Request) => {
  const { animalType } = req.body;

  if (animalType === 'Dog') {
    return await createDog(req)
  }
}

const createDog = async (req: Request) => {
  const { breedId, originId, weight, isMicrochipped, isNeutered, isPottyTrained } = req.body;

  return await Dog.create({
    breedId,
    originId,
    weight,
    isMicrochipped,
    isNeutered,
    isPottyTrained
  })
    .then((dog: IDog) => {
      console.log('Dog created successfully: ' + dog);
      return { animal: dog };
    })
    .catch((error: Error) => {
      let message = 'Error creating Dog:\n' + error.message;
      throw new Error(message);
    });
}

const getAllListings = async (req: Request, res: Response) => {
  await Listing.find()
    .then(async (listings: IListing[]) => {
      console.log('Listings retrieved successfully: ' + listings);
      return res.json({ listings: listings });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Listings:\n' + error.message;
      return res.json({ message: message });
    });
}

const getListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Listing.findById(id)
    .then(async (listing: IListing) => {
      console.log('Listing retrieved successfully: ' + listing);

      req.params.id = listing.itemId.toString();
      req.params.itemType = listing.itemType;

      const retrievedItem = await getItem(req, res)
        .then((response: any) => response);

      return res.json({ listing: listing, item: retrievedItem.pet, animal: retrievedItem.animal });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Listing:\n' + error.message;
      return res.json({ message: message });
    });
}

const getItem = async (req: Request, res: Response) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await getPet(req, res);
  }
}

const getPet = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Pet.findById(id)
    .then(async (pet: IPet) => {
      console.log('Pet retrieved successfully: ' + pet);

      req.params.id = pet.animalId.toString();
      req.params.animalType = pet.animalType;

      const retrievedAnimal = await getAnimal(req, res)
        .then((response: any) => response);
      
      return res.json({ item: pet, animal: retrievedAnimal.animal });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Pet:\n' + error.message;
      return res.json({ message: message });
    });
}

const getAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await getDog(req, res);
  }
}

const getDog = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Dog.findById(id)
    .then(async (dog: IDog) => {
      console.log('Dog retrieved successfully: ' + dog);
      return res.json({ animal: dog });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Dog:\n' + error.message;
      return res.json({ message: message });
    });
}

const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, description, itemType, saleType, media } = req.body;

  await Listing.findByIdAndUpdate(id, {
    price,
    description,
    itemType,
    saleType,
    media
  }, { new: true })
    .then( async (updatedListing: IListing) => {
      console.log('Listing updated successfully:', updatedListing);
      
      req.params.id = updatedListing.itemId.toString();

      const updatedItem = await updateItem(req, res)
        .then((response: any) => response);
      
      return res.json({ listing: updatedListing, item: updatedItem.pet, animal: updatedItem.animal });
    })
    .catch((error: Error) => {
      let message = 'Error updating Listing:\n' + error.message;
      return res.json({ message: message });
    });
}

const updateItem = async (req: Request, res: Response) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await updatePet(req, res);
  }
}

const updatePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, gender, birthdate } = req.body;

  await Pet.findByIdAndUpdate(id, {
    name,
    gender,
    birthdate
  }, { new: true })
    .then( async (updatedPet: IPet) => {
      console.log('Pet updated successfully:', updatedPet);
      
      req.params.id = updatedPet.animalId.toString();
      req.params.animalType = updatedPet.animalType;

      const updatedAnimal = await updateAnimal(req, res)
        .then((response: any) => response);

      return res.json({ item: updatedPet, animal: updatedAnimal.animal });
    })
    .catch((error: Error) => {
      let message = 'Error updating Pet:\n' + error.message;
      return res.json({ message: message });
    });
}

const updateAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await updateDog(req, res);
  }
}

const updateDog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { breedId, originId, weight, isMicrochipped, isNeutered, isPottyTrained } = req.body;

  await Dog.findByIdAndUpdate(id, {
    breedId,
    originId,
    weight,
    isMicrochipped,
    isNeutered,
    isPottyTrained
  }, { new: true })
    .then((updatedDog: IDog) => {
      console.log('Dog updated successfully:', updatedDog);
      return res.json({ animal: updatedDog });
    })
    .catch((error: Error) => {
      let message = 'Error updating Dog:\n' + error.message;
      return res.json({ message: message });
    });
}

const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Listing.findByIdAndRemove(id)
    .then(async (deletedListing: IListing) => {
      console.log('Listing deleted successfully:', deletedListing);

      req.params.id = deletedListing.itemId.toString();

      const deletedItem = await deleteItem(req, res)
        .then((response: any) => response);
      
      return res.json({ listing: deletedListing, item: deletedItem.pet, animal: deletedItem.animal });
    })
    .catch((error: Error) => {
      let message = 'Error deleting Listing:\n' + error.message;
      return res.json({ message: message });
    });
}

const deleteItem = async (req: Request, res: Response) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await deletePet(req, res);
  }
}

const deletePet = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Pet.findByIdAndRemove(id)
    .then(async (deletedPet: IPet) => {
      console.log('Pet deleted successfully:', deletedPet);
      
      req.params.id = deletedPet.animalId.toString();
      req.params.animalType = deletedPet.animalType;

      const deletedAnimal = await deleteAnimal(req, res)
        .then((response: any) => response);

      return res.json({ item: deletedPet, animal: deletedAnimal.animal });
    })
    .catch((error: Error) => {
      let message = 'Error deleting Pet:\n' + error.message;
      return res.json({ message: message });
    });
}

const deleteAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await deleteDog(req, res);
  }
}

const deleteDog = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Dog.findByIdAndRemove(id)
    .then((deletedDog: IDog) => {
      console.log('Dog deleted successfully:', deletedDog);
      return res.json({ animal: deletedDog });
    })
    .catch((error: Error) => {
      let message = 'Error deleting Dog:\n' + error.message;
      return res.json({ message: message });
    });
}

module.exports = {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing
};
