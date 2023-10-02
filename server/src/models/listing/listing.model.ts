import { Schema, Model } from 'mongoose';

const mongoose = require('mongoose');
const { Pet } = require('./pet/pet.model');

const itemTypes = ['Pet']; // Add more types here: 'Service', 'Product', etc.
const saleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
const mediaTypes = ['image']; // Add more types here: 'video', etc.

export interface IListing {
  _id: Schema.Types.ObjectId;
  lister: Schema.Types.ObjectId;
  item: Schema.Types.ObjectId;
  price: number;
  description: string;
  itemType: string;
  saleType: string;
  media: { type: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema(
  {
    lister: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    item: {
      type: Schema.Types.ObjectId,
      immutable: true,
      refPath: 'itemType',
      required: true,
      autopopulate: true,
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    itemType: {
      type: String,
      enum: itemTypes,
      immutable: true,
      required: true
    },
    saleType: {
      type: String,
      enum: saleTypes,
      immutable: true,
      required: true
    },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    media: [{ type: { type: String, enum: mediaTypes }, url: String }]
  },
  { collection: 'listings' }
);

listingSchema.plugin(require('mongoose-autopopulate'));

const Listing = mongoose.model('Listing', listingSchema);

module.exports = { Listing, itemTypes, saleTypes, mediaTypes };
