import { Request, Response } from 'express';
import { IDogVaccine } from '../models/listing/pet/animal/dog/dog-vaccine.model';

const DogVaccine = require('../models/listing/pet/animal/dog/dog-vaccine.model');

const createVaccine = async (req: Request, res: Response) => {
  const { animal } = req.body;

  if (animal === 'Dog') {
    return await createDogVaccine(req, res);
  }
};

const createDogVaccine = async (req: Request, res: Response) => {
  const { name } = req.body;

  await DogVaccine.create({
    name
  })
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

const getVaccinesByAnimal = async (req: Request, res: Response) => {
  const { animal } = req.params;

  if (animal === 'Dog') {
    return await getDogVaccines(req, res);
  }
};

const getDogVaccines = async (req: Request, res: Response) => {
  await DogVaccine.find({})
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
  createVaccine,
  getVaccinesByAnimal
};