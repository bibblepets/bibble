import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const saleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
const mediaTypes = ['Image']; // Add more types here: 'video', etc.

const speciesTypes = ['Dog']; // Add other animals here: 'Cat', 'Rabbit', 'Guinea Pig', 'Hamster', 'Gerbil', 'Mouse', 'Chinchilla'

export interface IPetListing {
  _id: Schema.Types.ObjectId;
  lister: Schema.Types.ObjectId;
  price: number;
  description: string;
  saleType: string;
  media: { type: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
  animal: Schema.Types.ObjectId;
  species: string;
}

const petListingSchema = new Schema(
  {
    lister: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    saleType: {
      type: String,
      enum: saleTypes,
      immutable: true,
      required: true
    },
    media: [{ type: { type: String, enum: mediaTypes }, url: String }],
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    animal: {
      type: Schema.Types.ObjectId,
      immutable: true,
      refPath: 'species',
      required: true,
      autopopulate: true
    },
    species: {
      type: String,
      enum: speciesTypes,
      immutable: true,
      required: true
    }
  },
  { collection: 'petListings' }
);

petListingSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PetListing', petListingSchema);
