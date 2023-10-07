import { Request, Response } from 'express';
import { IDogBreed } from '../models/listing/animal/dog/dogBreed.model';
import { handleError, mapSpeciesToFunction } from '../utils/util';

const DogBreed = require('../models/listing/animal/dog/dogBreed.model');

const createBreeds = async (req: Request, res: Response) => {
  const { species } = req.params;

  const funcToExecute = mapSpeciesToFunction(species, [createDogBreeds]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  return res.status(400).json({
    message: '`' + species + '` is not a valid enum value for path `species`.'
  });
}

const createDogBreeds = async (req: Request, res: Response) => {
  const { breeds } = req.body;

  await DogBreed.insertMany(breeds)
    .then((dogBreeds: IDogBreed[]) => {
      console.log(
        'Dog Breeds created successfully: ' + dogBreeds.length.toString()
      );
      return res.json({ breeds: dogBreeds });
    })
    .catch((error: any) => {
      let message = 'Error creating Breeds: ' + error.message;
      return res.status(500).json({ message: message });
    });
};

const createBreed = async (req: Request, res: Response) => {
  const { species } = req.body;

  const funcToExecute = mapSpeciesToFunction(species, [createDogBreed]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  return res.status(400).json({
    message: '`' + species + '` is not a valid enum value for path `species`.'
  });
};

const createDogBreed = async (req: Request, res: Response) => {
  const params: IDogBreed = req.body;

  return await DogBreed.create(params)
    .then((dogBreed: IDogBreed) => {
      console.log('Dog Breed created successfully: ' + dogBreed._id.toString());
      return res.json({ breed: dogBreed });
    })
    .catch((error: any) => {
      let message = 'Error creating Breed: ' + error.message;
      return res.json({ message: message });
    });
};

const getBreedsBySpecies = async (req: Request, res: Response) => {
  const { species } = req.params;

  const funcToExecute = mapSpeciesToFunction(species, [getDogBreeds]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  return res.status(400).json({
    message: '`' + species + '` is not a valid enum value for path `species`.'
  });
};

const getDogBreeds = async (req: Request, res: Response) => {
  await DogBreed.find({})
    .then((dogBreeds: IDogBreed[]) => {
      console.log('Dog Breeds retrieved successfully: ' + dogBreeds.length);
      return res.json({ breeds: dogBreeds });
    })
    .catch((error: any) => {
      let message = 'Error retrieving Dog Breeds: ' + error.message;
      return res.json({ message: message });
    });
};

module.exports = {
  createBreeds,
  createBreed,
  getBreedsBySpecies
};
