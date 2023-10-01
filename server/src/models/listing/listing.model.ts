import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const itemTypes = ['Pet']; // Add more types here: 'Service', 'Product', etc.
const saleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
const mediaTypes = ['image']; // Add more types here: 'video', etc.

export interface IListing {
  _id: Schema.Types.ObjectId;
  listerId: Schema.Types.ObjectId;
  itemId: Schema.Types.ObjectId;
  price: number;
  description: string;
  itemType: string;
  saleType: string;
  media: { type: string, url: string }[];
  createdAt: Date;
  updatedAt: Date;
}
  
const ListingSchema = new Schema(
  {
    listerId: { type: Schema.Types.ObjectId, immutable: true, required: true },
    itemId: { type: Schema.Types.ObjectId, immutable: true, refPath: 'itemType', required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    itemType: { type: String, enum: itemTypes, immutable: true, required: true },
    saleType: { type: String, enum: saleTypes, immutable: true, required: true },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    media: [{ type: { type: String, enum: mediaTypes }, url: String }]
  },
  { collection: 'listings' }
);

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = { Listing, itemTypes, saleTypes, mediaTypes };
  