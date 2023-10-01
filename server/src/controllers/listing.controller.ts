import { Request, Response } from 'express';
import { IListing } from '../models/listing/listing.model';
import { IPet } from '../models/listing/pet/pet.model';
import { IDog } from '../models/listing/pet/animal/dog/dog.model';

const { Listing, itemTypes, saleTypes, mediaTypes } = require('../models/listing/listing.model');
const { Pet, petTypes, genders } = require('../models/listing/pet/pet.model');
const { Dog, sizes, hairCoats } = require('../models/listing/pet/animal/dog/dog.model');

const createListing = async (req: Request, res: Response) => {
  try {
    const { listerId, price, description, itemType, saleType, media } = req.body;

    if (validateListing(req, res)) {
      return ;
    }

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
          .catch(async (error: any) => {
            req.params.id = createdItem[itemType.toLowerCase()]._id.toString();
            req.params.itemType = itemType;
            await deleteItem(req);

            throw new Error(error.message);
          });
      });
  } catch (error: any) {
    console.log('Error creating Listing:\n' + error.message);
    return res.status(500).json({ message: error.message });
  }
}

const createItem = async (req: Request, res: Response) => {
  const { itemType } = req.body;

  if (itemType === 'Pet') {
    return await createPet(req, res);
  }
}

const createPet = async (req: Request, res: Response) => {
  try {
    const { animalType, originId, gender, birthdate } = req.body;
    const { name } : { name?: string } = req.body;

    if (await validatePet(req, res)) {
      return ;
    }

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
          .catch(async (error: any) => {
            req.params.id = createdAnimal._id.toString();
            req.params.animalType = animalType;
            await deleteAnimal(req);

            throw new Error(error.message);
          });
      });
  } catch (error: any) {
    console.log('Error creating Pet:');
    throw new Error(error.message);
  }
}

const createAnimal = async (req: Request, res: Response) => {
  const { animalType } = req.body;

  if (animalType === 'Dog') {
    return await createDog(req, res)
  }
}

const createDog = async (req: Request, res: Response) => {
  try {
    const { breedIds, size, weight, hairCoat, isHypoallergenic, isMicrochipped, isNeutered, isPottyTrained, isHdbApproved } = req.body;

    if (validateDog(req, res)) {
      return ;
    }

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
    })
      .then((dog: IDog) => {
        console.log('Dog created successfully:', dog._id.toString());
        return { animal: dog };
      })
  } catch (error: any) {
    console.log('Error creating Dog:');
    throw new Error(error.message);
  }
}

const getAllListings = async (req: Request, res: Response) => {
  await Listing.find()
    .then(async (listings: IListing[]) => {
      console.log('Listings retrieved successfully: [\n' + listings.map((listing: IListing) => listing._id.toString()).join(',\n') + '\n]');
      return res.json({ listings: listings });
    })
    .catch((error: any) => {
      console.log('Error retrieving Listings: ' + error)
      return res.status(500).json({ message: error.message });
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
    .catch((error: any) => {
      console.log('Error retrieving Listing:\n' + error);
      return res.status(500).json({ message: error.message });
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
    .catch((error: any) => {
      console.log('Error retrieving Pet:\n' + error);
      res.status(500).json({ message: error.message });
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
    .catch((error: any) => {
      console.log('Error retrieving Dog:\n' + error);
      res.status(500).json({ message: error.message });
    });
}

const updateListing = async (req: Request, res: Response) => {
  try {
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
  } catch(error: any) {
    console.log('Error updating Listing:\n' + error.message);
    return res.json({ message: error.message });
  };
}

const updateItem = async (req: Request) => {
  const { itemType } = req.params;

  if (itemType === 'Pet') {
    return await updatePet(req);
  }
}

const updatePet = async (req: Request) => {
  try {
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
  } catch(error: any) {
    console.log('Error updating Pet:');
    throw new Error(error.message);
  };
}

const updateAnimal = async (req: Request) => {
  const { animalType } = req.params;

  if (animalType === 'Dog') {
    return await updateDog(req);
  }
}

const updateDog = async (req: Request) => {
  try {
    const { id } = req.params;
    const { size, weight, hairCoat, isHypoallergenic, isMicrochipped, isNeutered, isPottyTrained, isHdbApproved } = req.body;

    if (size && !sizes.includes(size)) {
      throw new Error('Invalid size: `' + size + '`');
    }
  
    if (hairCoat && !hairCoats.includes(hairCoat)) {
      throw new Error('Invalid hairCoat: `' + hairCoat + '`');
    }
  
    return await Dog.findByIdAndUpdate(id, {
      size,
      weight,
      hairCoat,
      isHypoallergenic,
      isMicrochipped,
      isNeutered,
      isPottyTrained,
      isHdbApproved
    }, { new: true })
      .then((updatedDog: IDog) => {
        console.log('Dog updated successfully:', updatedDog._id.toString());
        return { animal: updatedDog };
      })
  } catch (error: any) {
    console.log('Error updating Dog:');
    throw new Error(error.message);
  }
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
    .catch((error: any) => {
      console.log('Error deleting Listing:\n' + error.message)
      return res.json({ message: error.message });
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
    .catch((error: any) => {
      console.log('Error deleting Pet:\n' + error.message)
      throw new Error(error.message);
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
    .catch((error: any) => {
      console.log('Error deleting Dog:\n' + error.message)
      throw new Error(error.message);
    });
}

const validateListing = (req: Request, res: Response) => {
  const { listerId, price, description, itemType, saleType, media } = req.body;

  if (!listerId) {
    return res.status(400).json({ message: 'Missing listerId' });
  }

  if (!price) {
    return res.status(400).json({ message: 'Missing price' });
  }

  if (isNaN(price)) {
    return res.status(400).json({ message: 'Invalid price: `' + price + '`' });
  }

  if (!description) {
    return res.status(400).json({ message: 'Missing description' });
  }

  if (!itemType) {
    return res.status(400).json({ message: 'Missing itemType' });
  }

  if (!saleType) {
    return res.status(400).json({ message: 'Missing saleType' });
  }

  if (!itemTypes.includes(itemType)) {
    return res.status(400).json({ message: 'Invalid itemType: `' + itemType + '`' });
  }

  if (!saleTypes.includes(saleType)) {
    return res.status(400).json({ message: 'Invalid saleType: `' + saleType + '`' });
  }

  if (media && media.length > 0) {
    media.forEach((media: { type: string, url: string }) => {
      if (!mediaTypes.includes(media.type)) {
        return res.status(400).json({ message: 'Invalid media type: `' + media.type + '`' });
      }
    });
  }

  return false;
}

const validatePet = async (req: Request, res: Response) => {
  const { animalType, gender, birthdate } = req.body;

  if (!animalType) {
    return res.status(400).json({ message: 'Missing animalType' });
  }

  if (!petTypes.includes(animalType)) {
    return res.status(400).json({ message: 'Invalid animalType: `' + animalType + '`' });
  }

  if (!gender) {
    return res.status(400).json({ message: 'Missing gender' });
  }

  if (!genders.includes(gender)) {
    return res.status(400).json({ message: 'Invalid gender: `' + gender + '`' });
  }

  if (!birthdate) {
    return res.status(400).json({ message: 'Missing birthdate' });
  }

  if (isNaN(Date.parse(birthdate))) {
    return res.status(400).json({ message: 'Invalid birthdate: `' + birthdate + '`' });
  }

  return false;
}

const validateDog = (req: Request, res: Response) => {
  const { size, weight, hairCoat, isHypoallergenic, isMicrochipped, isNeutered, isPottyTrained, isHdbApproved } = req.body;

  if (!size) {
    return res.status(400).json({ message: 'Missing size' });
  }

  if (!sizes.includes(size)) {
    return res.status(400).json({ message: 'Invalid size: `' + size + '`' });
  }

  if (!weight) {
    return res.status(400).json({ message: 'Missing weight' });
  }

  if (isNaN(weight)) {
    return res.status(400).json({ message: 'Invalid weight: `' + weight + '`' });
  }

  if (!hairCoat) {
    return res.status(400).json({ message: 'Missing hairCoat' });
  }

  if (!hairCoats.includes(hairCoat)) {
    return res.status(400).json({ message: 'Invalid hairCoat: `' + hairCoat + '`' });
  }

  if (typeof isHypoallergenic === 'undefined') {
    return res.status(400).json({ message: 'Missing isHypoallergenic' });
  }

  if (typeof isMicrochipped === 'undefined') {
    return res.status(400).json({ message: 'Missing isMicrochipped' });
  }

  if (typeof isNeutered === 'undefined') {
    return res.status(400).json({ message: 'Missing isNeutered' });
  }

  if (typeof isPottyTrained === 'undefined') {
    return res.status(400).json({ message: 'Missing isPottyTrained' });
  }

  if (typeof isHdbApproved === 'undefined') {
    return res.status(400).json({ message: 'Missing isHdbApproved' });
  }

  return false;
}

module.exports = {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing
};
