import { Schema } from "mongoose";

const mongoose = require("mongoose");


export interface IProfile {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  buyerProfileId: Schema.Types.ObjectId;
  businessProfileId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    buyerProfileId: { type: Schema.Types.ObjectId, required: true },
    businessProfileId: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() },
  },
  { collection: "profiles" }
);

module.exports = mongoose.model("Profile", profileSchema);