import { Schema } from "mongoose";

const mongoose = require("mongoose");

const sizes = ["Small", "Medium", "Large"];
const hairCoats = ["Double", "Silky", "Wire", "Curly", "Hairless", "Long", "Medium", "Short"];

export interface IDogBreed {
  _id: Schema.Types.ObjectId;
  name: string;
  size: string;
  hairCoat: string;
  isHypoallergenic: boolean;
  isHdbApproved: boolean;
}

const dogBreedSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, enum: sizes, required: true },
    hairCoat: { type: String, enum: hairCoats, required: true },
    isHypoallergenic: { type: Boolean, required: true },
    isHdbApproved: { type: Boolean, required: true },
  },
  { collection: "dogBreeds" }
);

module.exports = mongoose.model("DogBreed", dogBreedSchema);
