import { Request, Response } from 'express';
import { IDogBreed } from '../models/listing/pet/animal/dog/dogBreed.model';

const DogBreed = require('../models/listing/pet/animal/dog/dogBreed.model');

const createBreed = async (req: Request, res: Response) => {
  const { animal } = req.body;
  
  if (animal === 'Dog') {
    return await createDogBreed(req, res);
  }
}

const createDogBreed = async (req: Request, res: Response) => {
  const { name, size, hairCoat, isHypoallergenic, isHdbApproved } = req.body;

  if (
    typeof hairCoat === 'undefined'
    || typeof isHypoallergenic === 'undefined' 
    || typeof isHdbApproved === 'undefined'
    )
  {
    return res.json({ message: 'Please enter hairCoat, isHypoallergenic and isHdbApproved.' });
  }

  await DogBreed.create({
    name,
    size,
    hairCoat,
    isHypoallergenic,
    isHdbApproved
  })
    .then((dogBreed: IDogBreed) => {
      console.log('Dog Breed created successfully: ' + dogBreed._id.toString());
      return res.json({ breed: dogBreed });
    })
    .catch((error: Error) => {
      let message = 'Error creating Breed: ' + error.message;
      return res.json({ message: message });
    });
}

const getBreedsByAnimal = async (req: Request, res: Response) => {
  const { animal } = req.params;

  if (animal === 'Dog') {
    return await getDogBreeds(req, res);
  }
}

const getDogBreeds = async (req: Request, res: Response) => {
  await DogBreed.find({})
    .then((dogBreeds: IDogBreed[]) => {
      console.log('Dog Breeds retrieved successfully: ' + dogBreeds.length);
      return res.json({ breeds: dogBreeds });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Dog Breeds: ' + error.message;
      return res.json({ message: message });
    });
}

module.exports = {
  createBreed,
  getBreedsByAnimal
}
