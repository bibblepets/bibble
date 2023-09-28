import { Schema } from "mongoose";
import { petSpecies } from "./pet.model";

const mongoose = require("mongoose");

const sizes = ["Small", "Medium", "Large"];

export interface IBreed {
  _id: Schema.Types.ObjectId;
  name: string;
  size: string;
  species: string;
  isHypoallergenic: boolean;
}

const breedSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, enum: sizes, required: true },
    species: { type: String, enum: petSpecies, required: true },
    isHypoallergenic: { type: Boolean, required: true },
  },
  { collection: "breeds" }
);

module.exports = mongoose.model("Breed", breedSchema);
