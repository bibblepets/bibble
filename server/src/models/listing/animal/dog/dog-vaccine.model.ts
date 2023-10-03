import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface IDogVaccine {
  _id: Schema.Types.ObjectId;
  name: string;
  isCore: boolean;
}

const dogVaccineSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    isCore: { type: Boolean, required: true }
  },
  { collection: "dogVaccines" }
);

module.exports = mongoose.model("DogVaccine", dogVaccineSchema);