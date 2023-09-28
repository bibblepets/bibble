import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const hairCoats = ['Short', 'Medium', 'Long'];

export interface IDog {
    _id: Schema.Types.ObjectId;
    petId: Schema.Types.ObjectId;
    breedId: Schema.Types.ObjectId;
    originId: Schema.Types.ObjectId;
    weight: number;
    haircoat: string;
    avsLicense: string;
    isMicrochipped: boolean;
    isHdbApproved: boolean;
    isNeutered: boolean;
    isPottyTrained: boolean;
}

const DogSchema = new Schema(
    {
        petId: { type: Schema.Types.ObjectId, immutable: true, ref: 'Pet', required: true },
        breedId: { type: Schema.Types.ObjectId, immutable: true, ref: 'Breed', required: true },
        originId: { type: Schema.Types.ObjectId, immutable: true, ref: 'Country', required: true },
        weight: { type: Number, required: true },
        haircoat: { type: String, enum: hairCoats, required: true },
        avsLicense: { type: String, required: true },
        isMicrochipped: { type: Boolean, required: true },
        isHdbApproved: { type: Boolean, required: true },
        isNeutered: { type: Boolean, required: true },
        isPottyTrained: { type: Boolean, required: true }
    },
    { collection: 'dogs' }
);

module.exports = mongoose.model('Dog', DogSchema);