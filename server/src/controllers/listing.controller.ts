import { Request, Response } from 'express';
import { IListing } from '../models/listing/listing.model';
import { IPet } from '../models/listing/pet/pet.model';
import { IDog } from '../models/listing/pet/animal/dog/dog.model';

const {
  Listing,
  itemTypes,
  saleTypes,
  mediaTypes
} = require('../models/listing/listing.model');
const { Pet, petTypes, genders } = require('../models/listing/pet/pet.model');
const {
  Dog,
  sizes,
  hairCoats
} = require('../models/listing/pet/animal/dog/dog.model');

const createListing = async (req: Request, res: Response) => {
  try {
    const { listerId, price, description, itemType, saleType, media } =
      req.body;

    await createItem(req, res).then(async (response: any) => {
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
        .catch(async (error: any) => {
          req.params.id = createdItem[itemType.toLowerCase()]._id.toString();
          req.params.itemType = itemType;
          await deleteItem(req);

          console.log('Error creating Listing:\n' + error.message);
          return handleError(req, res, error);
        });
    });
  } catch (error: any) {
    console.log('Unforeseen error creating Listing:\n' + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const createItem = async (req: Request, res: Response) => {
  const { itemType } = req.body;

  if (itemType === 'Pet') {
    return await createPet(req, res);
  }
};

const createPet = async (req: Request, res: Response) => {
  try {
    const { animalType, originId, gender, birthdate } = req.body;
    const { name }: { name?: string } = req.body;

    return await createAnimal(req, res).then(async (response: any) => {
      const createdAnimal = response.animal;

      return await Pet.create({
        animalId: createdAnimal._id,
        animalType,
        originId,
        name,
        gender,
        birthdate
      })
        .then((pet: IPet) => {
          console.log('Pet created successfully:', pet._id.toString());
          return { item: { pet: pet, animal: createdAnimal } };
        })
        .catch(async (error: any) => {
          req.params.id = createdAnimal._id.toString();
          req.params.animalType = animalType;
          await deleteAnimal(req);

          throw error;
        });
    });
  } catch (error: any) {
    console.log('Error creating Pet:');
    throw error;
  }
};

const createAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.body;

  if (animalType === 'Dog') {
    return await createDog(req, res);
  }
};

const createDog = async (req: Request, res: Response) => {
  try {
    const {
      breedIds,
      size,
      weight,
      hairCoat,
      isHypoallergenic,
      isMicrochipped,
      isNeutered,
      isPottyTrained,
      isHdbApproved
    } = req.body;

    return await Dog.create({
      breedIds,
      size,
      weight,
      hairCoat,
      isHypoallergenic,
      isMicrochipped,
      isNeutered,
      isPottyTrained,
      isHdbApproved
    }).then((dog: IDog) => {
      console.log('Dog created successfully:', dog._id.toString());
      return { animal: dog };
    });
  } catch (error: any) {
    console.log('Error creating Dog:');
    throw error;
  }
};

const getAllListings = async (req: Request, res: Response) => {
  try {
    await Listing.find()
      .then(async (listings: IListing[]) => {
        console.log(
          'Listings retrieved successfully: [\n' +
            listings
              .map((listing: IListing) => listing._id.toString())
              .join(',\n') +
            '\n]'
        );
        return res.json({ listings: listings });
      })
      .catch((error: any) => {
        console.log('Error retrieving Listings: ' + error);
        return res.status(500).json({ message: error.message });
      });
  } catch (error: any) {
    console.log('Unforeseen error retrieving Listings:\n' + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Listing.findById(id)
      .then(async (listing: IListing) => {
        console.log('Listing retrieved successfully:', listing._id.toString());

        req.params.id = listing.itemId.toString();
        req.params.itemType = listing.itemType;

        return res.json({ listing: listing, item: await getItem(req, res) });
      })
      .catch((error: any) => {
        console.log('Error retrieving Listing:\n' + error);
        return handleError(req, res, error);
      });
  } catch (error: any) {
    console.log('Unforeseen error retrieving Listing:\n' + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getItem = async (req: Request, res: Response) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await getPet(req, res);
  }
};

const getPet = async (req: Request, res: Response) => {
  const { id } = req.params;

  return await Pet.findById(id)
    .then(async (pet: IPet) => {
      console.log('Pet retrieved successfully:', pet._id.toString());

      req.params.id = pet.animalId.toString();
      req.params.animalType = pet.animalType;

      return { pet: pet, animal: await getAnimal(req, res) };
    })
    .catch((error: any) => {
      console.log('Error retrieving Pet:');
      throw error;
    });
};

const getAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await getDog(req, res);
  }
};

const getDog = async (req: Request, res: Response) => {
  const { id } = req.params;

  return await Dog.findById(id)
    .then((dog: IDog) => {
      console.log('Dog retrieved successfully:', dog._id.toString());
      return dog;
    })
    .catch((error: any) => {
      console.log('Error retrieving Dog:');
      throw error;
    });
};

const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { price, description, media } = req.body;

    await Listing.findByIdAndUpdate(
      id,
      {
        price,
        description,
        media
      },
      { new: true, runValidators: true }
    )
      .then(async (updatedListing: IListing) => {
        console.log(
          'Listing updated successfully:',
          updatedListing._id.toString()
        );

        req.params.id = updatedListing.itemId.toString();
        req.params.itemType = updatedListing.itemType;

        return res.json({
          listing: updatedListing,
          item: await updateItem(req, res)
        });
      })
      .catch((error: any) => {
        console.log('Error updating Listing:\n' + error.message);
        return handleError(req, res, error);
      });
  } catch (error: any) {
    console.log('Unforeseen error updating Listing:\n' + error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req: Request, res: Response) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await updatePet(req, res);
  }
};

const updatePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, birthdate } = req.body;

  return await Pet.findByIdAndUpdate(
    id,
    {
      name,
      birthdate
    },
    { new: true, runValidators: true }
  )
    .then(async (updatedPet: IPet) => {
      console.log('Pet updated successfully:', updatedPet._id.toString());

      req.params.id = updatedPet.animalId.toString();
      req.params.animalType = updatedPet.animalType;

      return {
        item: { pet: updatedPet, animal: await updateAnimal(req, res) }
      };
    })
    .catch((error: any) => {
      console.log('Error updating Pet:\n' + error.message);
      throw error;
    });
};

const updateAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await updateDog(req, res);
  }
};

const updateDog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    size,
    weight,
    hairCoat,
    isHypoallergenic,
    isMicrochipped,
    isNeutered,
    isPottyTrained,
    isHdbApproved
  } = req.body;

  return await Dog.findByIdAndUpdate(
    id,
    {
      size,
      weight,
      hairCoat,
      isHypoallergenic,
      isMicrochipped,
      isNeutered,
      isPottyTrained,
      isHdbApproved
    },
    { new: true, runValidators: true }
  )
    .then((updatedDog: IDog) => {
      console.log('Dog updated successfully:', updatedDog._id.toString());
      return { animal: updatedDog };
    })
    .catch((error: any) => {
      console.log('Error updating Dog:\n' + error.message);
      throw error;
    });
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

        req.params.id = deletedListing.itemId.toString();
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

      req.params.id = deletedPet.animalId.toString();
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

  throw error;
};

module.exports = {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing
};
