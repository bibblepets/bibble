import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const sizes = ["Small", "Medium", "Large"];
const hairCoats = ["Double", "Silky", "Wire", "Curly", "Hairless", "Long", "Medium", "Short"];

export interface IDog {
  _id: Schema.Types.ObjectId;
  breeds: Schema.Types.ObjectId[];
  vaccines: Schema.Types.ObjectId[];
  size: string;
  weight: number;
  hairCoat: string;
  isHypoallergenic: boolean;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isHdbApproved: boolean;
  avsLicenseNumber: string;
}

const dogSchema = new Schema(
  {
    breeds: [{ type: Schema.Types.ObjectId, immutable: true, ref: 'DogBreed', required: true, autopopulate: true }],
    vaccines: [{ type: Schema.Types.ObjectId, ref: 'DogVaccine', required: true, autopopulate: true }],
    size: { type: String, enum: sizes, required: true },
    weight: { type: Number, required: true },
    hairCoat: { type: String, enum: hairCoats, required: true },
    isHypoallergenic: { type: Boolean, required: true },
    isMicrochipped: { type: Boolean, required: true },
    isNeutered: { type: Boolean, required: true },
    isHdbApproved: { type: Boolean, required: true },
    avsLicenseNumber: { type: String, required: true }
  },
  { collection: 'dogs' }
);

dogSchema.plugin(require('mongoose-autopopulate'));

const Dog = mongoose.model('Dog', dogSchema);

module.exports = { Dog, sizes, hairCoats };