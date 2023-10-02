import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const petTypes = ['Dog']; // Add other animals here: 'Cat', 'Rabbit', 'Guinea Pig', 'Hamster', 'Gerbil', 'Mouse', 'Chinchilla'
const genders = ['Male', 'Female'];

export interface IPet {
  _id: Schema.Types.ObjectId;
  animal: Schema.Types.ObjectId;
  origin: Schema.Types.ObjectId;
  name?: string;
  animalType: string;
  gender: string;
  birthdate: Date;
}

const petSchema = new Schema(
  {
    animal: { type: Schema.Types.ObjectId, immutable: true, refPath: 'animalType', required: true, autopopulate: true },
    origin: { type: Schema.Types.ObjectId, immutable: true, ref: 'Country', required: true, autopopulate: true },
    name: { type: String, required: false },
    animalType: { type: String, enum: petTypes, immutable: true, required: true },
    gender: { type: String, enum: genders, required: false },
    birthdate: { type: Date, required: true }
  },
  { collection: 'pets' }
);

petSchema.plugin(require('mongoose-autopopulate'));

const Pet = mongoose.model('Pet', petSchema);

module.exports = { Pet, petTypes, genders };
