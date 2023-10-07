import { Model, Schema } from 'mongoose';

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
      required: [true, 'Please specify the lister for this listing.'],
      autopopulate: true
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    saleType: {
      type: String,
      enum: saleTypes,
      immutable: true,
      required: [true, 'Please specify the sale type for this listing.']
    },
    media: [{ type: { type: String, enum: mediaTypes }, url: String }],
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    animal: {
      type: Schema.Types.ObjectId,
      immutable: true,
      refPath: 'species',
      required: [true, 'Please specify the animal for this listing.'],
      autopopulate: true
    },
    species: {
      type: String,
      enum: speciesTypes,
      immutable: true,
      required: [
        true,
        'Please specify the species of the animal for this listing.'
      ]
    }
  },
  { collection: 'petListings' }
);

petListingSchema.plugin(require('mongoose-autopopulate'));

const PetListing: Model<IPetListing> = mongoose.model(
  'PetListing',
  petListingSchema
);

module.exports = { PetListing, saleTypes, mediaTypes, speciesTypes };
