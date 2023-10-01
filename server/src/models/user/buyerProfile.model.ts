import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IBuyerProfile {
  _id: Schema.Types.ObjectId;
  profileId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Buyer's profile
  firstName: string;
  lastName: string;
  profilePic?: string;
  contactNumber?: string;
  bio?: string;
}

const buyerProfileSchema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },

    // Buyer's profile
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, required: false },
    contactNumber: { type: String, required: false },
    bio: { type: String, required: false }
  },
  { collection: 'buyerProfiles' }
);

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);
