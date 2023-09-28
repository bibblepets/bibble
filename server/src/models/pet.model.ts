import { Schema } from 'mongoose';

const mongoose = require('mongoose');

export const petSpecies = ['Dog']; // Add other species here: 'Cat', 'Bird', 'Fish', 'Reptile', etc.
const genders = ['Male', 'Female'];

export interface IPet {
    _id: Schema.Types.ObjectId;
    listingId: Schema.Types.ObjectId;
    name?: string;
    species: string;
    gender: string;
    birthdate: Date;
}

const PetSchema = new Schema(
    {
        listingId: { type: Schema.Types.ObjectId, immutable: true, ref: 'Listing', required: true },
        name: { type: String, required: false },
        species: { type: String, enum: petSpecies, required: true },
        gender: { type: String, enum: genders, required: false },
        birthdate: { type: Date, required: true }
    },
    { collection: 'pets' }
);

module.exports = mongoose.model('Pet', PetSchema);
