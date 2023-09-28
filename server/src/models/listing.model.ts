import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const listingItemTypes = ['Pet']; // Add more types here: 'Service', 'Product', etc.
const listingSaleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
const mediaTypes = ['image', 'video'];

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
    itemType: { type: String, enum: listingItemTypes, required: true },
    saleType: { type: String, enum: listingSaleTypes, required: true },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
    media: [{ type: { type: String, enum: mediaTypes }, url: String }]
  },
  { collection: 'listings' }
);

module.exports = mongoose.model('Listing', ListingSchema);
  