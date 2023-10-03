import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface IDogBreed {
  _id: Schema.Types.ObjectId;
  name: string;
}

const dogBreedSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "dogBreeds" }
);

module.exports = mongoose.model("DogBreed", dogBreedSchema);
