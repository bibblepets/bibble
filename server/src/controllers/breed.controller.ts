import { Request, Response } from 'express';
import { IBreed } from '../models/breed.model';

const Breed = require('../models/breed.model');

const createBreed = async (req: Request, res: Response) => {
  const { animal } = req.body;
  
  if (animal === 'Dog') {
    return await createDogBreed(req, res);
  }
}

const createDogBreed = async (req: Request, res: Response) => {
  const { name, size, animal, hairCoat, isHypoallergenic, isHdbApproved } = req.body;

  if (
    typeof hairCoat === 'undefined'
    || typeof isHypoallergenic === 'undefined' 
    || typeof isHdbApproved === 'undefined'
    )
  {
    return res.json({ message: 'Please enter hairCoat, isHypoallergenic and isHdbApproved.' });
  }

  await Breed.create({
    name,
    size,
    animal,
    hairCoat,
    isHypoallergenic,
    isHdbApproved
  })
    .then((breed: IBreed) => {
      console.log(`${breed.animal} Breed created successfully: ` + breed);
      return res.json({ breed: breed });
    })
    .catch((error: Error) => {
      let message = 'Error creating Breed:\n' + error.message;
      return res.json({ message: message });
    });
}

const getAllBreeds = async (req: Request, res: Response) => {
  await Breed.find()
    .then((breeds: IBreed[]) => {
      console.log('Breeds retrieved successfully: ' + breeds);
      return res.json({ breeds: breeds });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Breeds:\n' + error.message;
      return res.json({ message: message });
    });
}

const getBreedsByAnimal = async (req: Request, res: Response) => {
  const { animal } = req.params;

  await Breed.find({ animal: animal })
    .then((breeds: IBreed[]) => {
      console.log('Breeds retrieved successfully: ' + breeds);
      return res.json({ breeds: breeds });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Breeds:\n' + error.message;
      return res.json({ message: message });
    });
}

module.exports = {
  createBreed,
  getAllBreeds,
  getBreedsByAnimal
}
