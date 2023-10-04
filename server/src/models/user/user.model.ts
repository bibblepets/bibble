import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IUser {
  _id: Schema.Types.ObjectId;
  buyerProfile: Schema.Types.ObjectId;
  businessProfile?: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    buyerProfile: {
      type: Schema.Types.ObjectId,
      ref: 'BuyerProfile',
      immutable: true,
      required: true,
      autopopulate: true
    },
    businessProfile: {
      type: Schema.Types.ObjectId,
      ref: 'BusinessProfile',
      immutable: true,
      required: false,
      autopopulate: true
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true
    },
    password: { type: String, required: true },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() }
  },
  { collection: 'users' }
);

userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User', userSchema);
