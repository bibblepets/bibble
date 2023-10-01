import { Request, Response } from 'express';
import { IListing } from '../models/listing.model';
import { IPet } from '../models/pet.model';
import { IDog } from '../models/dog.model';

const Listing = require('../models/listing.model');
const Pet = require('../models/pet.model');
const Dog = require('../models/dog.model');

const createListing = async (req: Request, res: Response) => {
  const { listerId, price, description, itemType, saleType, media } = req.body;

  await createItem(req, res)
    .then(async (response: any) => {
      if (!response) {
        return ;
      }
      
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
          console.log('Listing created successfully:', listing._id.toString());
          return res.json({ listing: listing, item: createdItem });
        })
        .catch(async (error: Error) => {
          req.params.id = createdItem[itemType.toLowerCase()]._id.toString();
          req.params.itemType = itemType;
          await deleteItem(req);

          return res.status(500).json({ message: error });
        });
    });
}

const createItem = async (req: Request, res: Response) => {
  const { itemType } = req.body;

  if (itemType === 'Pet') {
    return await createPet(req, res);
  }
}

const createPet = async (req: Request, res: Response) => {
  const { animalType, originId, gender, birthdate } = req.body;
  const { name } : { name?: string } = req.body;

  return await createAnimal(req, res)
    .then(async (response: any) => {
      if (!response) {
        return ;
      }
      const createdAnimal = response.animal;

      return await Pet.create({
        animalId: createdAnimal._id,
        animalType,
        originId,
        name,
        gender,
        birthdate,
      })
        .then((pet: IPet) => {
          console.log('Pet created successfully:', pet._id.toString());
          return { item: { pet: pet, animal: createdAnimal }};
        })
        .catch(async (error: Error) => {
          req.params.id = createdAnimal._id.toString();
          req.params.animalType = animalType;
          await deleteAnimal(req);

          let message = 'Error creating Pet: ' + error.message;
          res.status(500).json({ message: message });
        });
    });
}

const createAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.body;

  if (animalType === 'Dog') {
    return await createDog(req, res)
  }
}

const createDog = async (req: Request, res: Response) => {
  const { breedId, weight, isMicrochipped, isNeutered, isPottyTrained } = req.body;

  return await Dog.create({
    breedId,
    weight,
    isMicrochipped,
    isNeutered,
    isPottyTrained
  })
    .then((dog: IDog) => {
      console.log('Dog created successfully:', dog._id.toString());
      return { animal: dog };
    })
    .catch((error: Error) => {
      let message = 'Error creating Dog: ' + error.message;
      res.status(500).json({ message: message });
    });
}

const getAllListings = async (req: Request, res: Response) => {
  await Listing.find()
    .then(async (listings: IListing[]) => {
      console.log('Listings retrieved successfully: ' + listings);
      return res.json({ listings: listings });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Listings: ' + error.message;
      return res.status(500).json({ message: message });
    });
}

const getListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Listing.findById(id)
    .then(async (listing: IListing) => {
      console.log('Listing retrieved successfully:', listing._id.toString());

      req.params.id = listing.itemId.toString();
      req.params.itemType = listing.itemType;

      return res.json({ listing: listing, item: await getItem(req, res) });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Listing: ' + error.message;
      return res.status(500).json({ message: message });
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

  return await Pet.findById(id)
    .then(async (pet: IPet) => {
      console.log('Pet retrieved successfully:', pet._id.toString());

      req.params.id = pet.animalId.toString();
      req.params.animalType = pet.animalType;

      return { pet: pet, animal: await getAnimal(req, res) };
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Pet: ' + error.message;
      return res.status(500).json({ message: message });
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

  return await Dog.findById(id)
    .then((dog: IDog) => {
      console.log('Dog retrieved successfully:', dog._id.toString());
      return dog;
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Dog:\n' + error.message;
      return res.status(500).json({ message: message });
    });
}

const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, description, media } = req.body;

  await Listing.findByIdAndUpdate(id, {
    price,
    description,
    media
  }, { new: true })
    .then(async (updatedListing: IListing) => {
      console.log('Listing updated successfully:', updatedListing._id.toString());
      
      req.params.id = updatedListing.itemId.toString();
      req.params.itemType = updatedListing.itemType;
      
      return res.json({ listing: updatedListing, item: await updateItem(req) });
    })
    .catch((error: Error) => {
      let message = 'Error updating Listing:\n' + error.message;
      return res.json({ message: message });
    });
}

const updateItem = async (req: Request) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await updatePet(req);
  }
}

const updatePet = async (req: Request) => {
  const { id } = req.params;
  const { name, birthdate } = req.body;

  return await Pet.findByIdAndUpdate(id, {
    name,
    birthdate
  }, { new: true })
    .then(async (updatedPet: IPet) => {
      console.log('Pet updated successfully:', updatedPet._id.toString());

      req.params.id = updatedPet.animalId.toString();
      req.params.animalType = updatedPet.animalType;

      return { item: { pet: updatedPet, animal: await updateAnimal(req) }};
    })
    .catch((error: Error) => {
      let message = 'Error updating Pet:\n' + error.message;
      throw new Error(message);
    });
}

const updateAnimal = async (req: Request) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await updateDog(req);
  }
}

const updateDog = async (req: Request) => {
  const { id } = req.params;
  const { weight, isMicrochipped, isNeutered, isPottyTrained } = req.body;

  return await Dog.findByIdAndUpdate(id, {
    weight,
    isMicrochipped,
    isNeutered,
    isPottyTrained
  }, { new: true })
    .then((updatedDog: IDog) => {
      console.log('Dog updated successfully:', updatedDog._id.toString());
      return { animal: updatedDog };
    })
    .catch((error: Error) => {
      let message = 'Error updating Dog:\n' + error.message;
      throw new Error(message);
    });
}

const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id)
    .then(async (deletedListing: IListing) => {
      console.log('Listing deleted successfully:', deletedListing._id.toString());

      req.params.id = deletedListing.itemId.toString();
      req.params.itemType = deletedListing.itemType;

      return res.json({ listing: deletedListing, item: await deleteItem(req) });
    })
    .catch((error: Error) => {
      let message = 'Error deleting Listing:\n' + error.message;
      return res.json({ message: message });
    });
}

const deleteItem = async (req: Request) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await deletePet(req);
  }
}

const deletePet = async (req: Request) => {
  const { id } = req.params;

  return await Pet.findByIdAndDelete(id)
    .then(async (deletedPet: IPet) => {
      console.log('Pet deleted successfully:', deletedPet._id.toString());

      req.params.id = deletedPet.animalId.toString();
      req.params.animalType = deletedPet.animalType;

      return { item: { pet: deletedPet, animal: await deleteAnimal(req) }};
    })
    .catch((error: Error) => {
      let message = 'Error deleting Pet:\n' + error.message;
      throw new Error(message);
    });
}

const deleteAnimal = async (req: Request) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await deleteDog(req);
  }
}

const deleteDog = async (req: Request) => {
  const { id } = req.params;

  return await Dog.findByIdAndDelete(id)
    .then((deletedDog: IDog) => {
      console.log('Dog deleted successfully:', deletedDog._id.toString());
      return { animal: deletedDog };
    })
    .catch((error: Error) => {
      let message = 'Error deleting Dog:\n' + error.message;
      throw new Error(message);
    });
}

module.exports = {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing
};
