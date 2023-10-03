import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export const bibbleTiers = ['Basic', 'Verified', 'Partner', 'Super'];

export interface IBusinessProfile {
  _id: Schema.Types.ObjectId;
  profileId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Business profile
  bibbleTier: string;
  businessName: string;
  businessPic?: string;
  businessBio?: string;
  businessAddress: string;
  businessContact: string;
  businessEmail: string;
}

const businessProfileSchema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },

    // Business profile
    bibbleTier: { type: String, enum: bibbleTiers, required: true },
    businessName: { type: String, required: true },
    businessPic: { type: String, required: false },
    businessBio: { type: String, required: false },
    businessAddress: { type: String, required: true },
    businessContact: { type: String, required: true },
    businessEmail: { type: String, required: true }
  },
  { collection: 'businessProfiles' }
);

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);