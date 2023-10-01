import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const sizes = ["Small", "Medium", "Large"];
const hairCoats = ["Double", "Silky", "Wire", "Curly", "Hairless", "Long", "Medium", "Short"];

export interface IDog {
  _id: Schema.Types.ObjectId;
  breedIds: Schema.Types.ObjectId[];
  size: string;
  weight: number;
  hairCoat: string;
  isHypoallergenic: boolean;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isPottyTrained: boolean;
  isHdbApproved: boolean;
}

const DogSchema = new Schema(
  {
    breedIds: [{ type: Schema.Types.ObjectId, immutable: true, ref: 'Breed', required: true }],
    size: { type: String, enum: sizes, required: true },
    weight: { type: Number, required: true },
    hairCoat: { type: String, enum: hairCoats, required: true },
    isHypoallergenic: { type: Boolean, required: true },
    isMicrochipped: { type: Boolean, required: true },
    isNeutered: { type: Boolean, required: true },
    isPottyTrained: { type: Boolean, required: true },
    isHdbApproved: { type: Boolean, required: true }
  },
  { collection: 'dogs' }
);

module.exports = mongoose.model('Dog', DogSchema);