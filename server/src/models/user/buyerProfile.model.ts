import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IBuyerProfile {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Buyer's profile
  firstName: string;
  lastName: string;
  favouriteListings?: Schema.Types.ObjectId[];
  profilePic?: string;
  contactNumber?: string;
  bio?: string;
}

const buyerProfileSchema = new Schema(
  {
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },

    // Buyer's profile
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    favouriteListings: [{ type: Schema.Types.ObjectId, ref: 'Listing', required: false }],
    profilePic: { type: String, required: false },
    contactNumber: { type: String, required: false },
    bio: { type: String, required: false }
  },
  { collection: 'buyerProfiles' }
);

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);
