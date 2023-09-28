import { Schema } from "mongoose";

const mongoose = require("mongoose");

export interface ICountry {
  _id: Schema.Types.ObjectId;
  name: string;
}

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "countries" }
);

module.exports = mongoose.model("Country", countrySchema);