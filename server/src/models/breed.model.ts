import { Schema } from "mongoose";
import { petAnimals } from "./pet.model";

const mongoose = require("mongoose");

const sizes = ["Small", "Medium", "Large"];
const hairCoats = ["Double", "Silky", "Wire", "Curly", "Hairless", "Long", "Medium", "Short"];

export interface IBreed {
  _id: Schema.Types.ObjectId;
  name: string;
  size: string;
  animal: string;

  // Dog specific
  hairCoat?: string;
  isHypoallergenic?: boolean;
  isHdbApproved?: boolean;

  // Cat specific...
  // ADD OTHER ANIMALS HERE
}

const breedSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, enum: sizes, required: true },
    animal: { type: String, enum: petAnimals, required: true },
    hairCoat: { type: String, enum: hairCoats, required: false },
    isHypoallergenic: { type: Boolean, required: false },
    isHdbApproved: { type: Boolean, required: false },
  },
  { collection: "breeds" }
);

module.exports = mongoose.model("Breed", breedSchema);
