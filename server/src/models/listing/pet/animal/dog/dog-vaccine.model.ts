import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface IDogVaccine {
  _id: Schema.Types.ObjectId;
  name: string;
}

const dogVaccineSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "dogVaccines" }
);

module.exports = mongoose.model("DogVaccine", dogVaccineSchema);