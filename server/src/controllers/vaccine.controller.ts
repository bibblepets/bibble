import { Request, Response } from 'express';
import { IDogVaccine } from '../models/listing/animal/dog/dog-vaccine.model';

const { handleError, mapSpeciesToFunction } = require('../utils/util');

const DogVaccine = require('../models/listing/animal/dog/dog-vaccine.model');

const createVaccines = async (req: Request, res: Response) => {
  const { species } = req.params;

  const funcToExecute = mapSpeciesToFunction(species, [createDogVaccines]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  return res.status(400).json({
    message: '`' + species + '` is not a valid enum value for path `species`.'
  });
};

const createDogVaccines = async (req: Request, res: Response) => {
  const { vaccines } = req.body;

  await DogVaccine.insertMany(vaccines)
    .then((dogVaccines: IDogVaccine[]) => {
      console.log(
        'Dog Vaccines created successfully: ' + dogVaccines.length.toString()
      );
      return res.json({ vaccines: dogVaccines });
    })
    .catch((error: Error) => {
      let message = 'Error creating Vaccines: ' + error.message;
      return res.status(500).json({ message: message });
    });
};

const createVaccine = async (req: Request, res: Response) => {
  const { species } = req.body;

  const funcToExecute = mapSpeciesToFunction(species, [createDogVaccine]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  return res.status(400).json({
    message: '`' + species + '` is not a valid enum value for path `species`.'
  });
};

const createDogVaccine = async (req: Request, res: Response) => {
  const params: IDogVaccine = req.body;

  await DogVaccine.create(params)
    .then((dogVaccine: IDogVaccine) => {
      console.log(
        'Dog Vaccine created successfully: ' + dogVaccine._id.toString()
      );
      return res.json({ vaccine: dogVaccine });
    })
    .catch((error: Error) => {
      let message = 'Error creating Vaccine: ' + error.message;
      return res.status(500).json({ message: message });
    });
};

const getVaccinesBySpecies = async (req: Request, res: Response) => {
  const { species } = req.params;

  const funcToExecute = mapSpeciesToFunction(species, [getDogVaccines]);

  if (funcToExecute) {
    return await funcToExecute(req, res);
  }

  return res.status(400).json({
    message: '`' + species + '` is not a valid enum value for path `species`.'
  });
};

const getDogVaccines = async (req: Request, res: Response) => {
  await DogVaccine.find()
    .then((dogVaccines: IDogVaccine[]) => {
      console.log('Dog Vaccines retrieved successfully: ' + dogVaccines.length);
      return res.json({ vaccines: dogVaccines });
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Dog Vaccines: ' + error.message;
      return res.status(500).json({ message: message });
    });
};

module.exports = {
  createVaccines,
  createVaccine,
  getVaccinesBySpecies
};
