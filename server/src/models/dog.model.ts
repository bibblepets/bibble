import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IDog {
  _id: Schema.Types.ObjectId;
  breedId: Schema.Types.ObjectId;
  originId: Schema.Types.ObjectId;
  weight: number;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isPottyTrained: boolean;
}

const DogSchema = new Schema(
  {
    breedId: { type: Schema.Types.ObjectId, immutable: true, ref: 'Breed', required: true },
    originId: { type: Schema.Types.ObjectId, immutable: true, ref: 'Country', required: true },
    weight: { type: Number, required: true },
    isMicrochipped: { type: Boolean, required: true },
    isNeutered: { type: Boolean, required: true },
    isPottyTrained: { type: Boolean, required: true }
  },
  { collection: 'dogs' }
);

module.exports = mongoose.model('Dog', DogSchema);