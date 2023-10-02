import { Request, Response } from 'express';
import { IDogBreed } from '../models/listing/pet/animal/dog/dog-breed.model';

const DogBreed = require('../models/listing/pet/animal/dog/dog-breed.model');

const createBreed = async (req: Request, res: Response) => {
  const { animal } = req.body;

  if (animal === 'Dog') {
    return await createDogBreed(req, res);
  }
};

const createDogBreed = async (req: Request, res: Response) => {
  const { name } = req.body;

  await DogBreed.create({
    name
  })
    .then((dogBreed: IDogBreed) => {
      console.log('Dog Breed created successfully: ' + dogBreed._id.toString());
      return res.json({ breed: dogBreed });
    })
    .catch((error: Error) => {
      let message = 'Error creating Breed: ' + error.message;
      return res.json({ message: message });
    });
};

const getBreedsByAnimal = async (req: Request, res: Response) => {
  const { animal } = req.params;

  if (animal === 'Dog') {
    return await getDogBreeds(req, res);
  }
};

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
};

module.exports = {
  createBreed,
  getBreedsByAnimal
};
