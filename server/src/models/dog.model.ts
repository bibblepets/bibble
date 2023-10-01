import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IDog {
  _id: Schema.Types.ObjectId;
  breedIds: Schema.Types.ObjectId[];
  weight: number;
  isMixedBreed: boolean;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isPottyTrained: boolean;
}

const DogSchema = new Schema(
  {
    breedIds: [{ type: Schema.Types.ObjectId, immutable: true, ref: 'Breed', required: true }],
    weight: { type: Number, required: true },
    isMixedBreed: { type: Boolean, immutable: true, required: true },
    isMicrochipped: { type: Boolean, required: true },
    isNeutered: { type: Boolean, required: true },
    isPottyTrained: { type: Boolean, required: true }
  },
  { collection: 'dogs' }
);

module.exports = mongoose.model('Dog', DogSchema);