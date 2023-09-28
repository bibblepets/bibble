import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export const petAnimals = ['Dog']; // Add other animals here: 'Cat', 'Rabbit', 'Guinea Pig', 'Hamster', 'Gerbil', 'Mouse', 'Chinchilla'
const genders = ['Male', 'Female'];

export interface IPet {
  _id: Schema.Types.ObjectId;
  animalId: Schema.Types.ObjectId;
  name?: string;
  animalType: string;
  gender: string;
  birthdate: Date;
}

const PetSchema = new Schema(
  {
    animalId: { type: Schema.Types.ObjectId, immutable: true, refPath: 'animalType', required: true },
    name: { type: String, required: false },
    animalType: { type: String, enum: petAnimals, required: true },
    gender: { type: String, enum: genders, required: false },
    birthdate: { type: Date, required: true }
  },
  { collection: 'pets' }
);

module.exports = mongoose.model('Pet', PetSchema);
