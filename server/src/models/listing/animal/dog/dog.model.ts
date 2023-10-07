import { Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';
import { IDogBreed } from './dogBreed.model';
import { ICountry } from '../../../country.model';
import { IDogVaccine } from './dogVaccine.model';

export const sizes = ['Small', 'Medium', 'Large'];
export const hairCoats = [
  'Double',
  'Silky',
  'Wire',
  'Curly',
  'Hairless',
  'Long',
  'Medium',
  'Short'
];
export const genders = ['Male', 'Female'];

export interface IDog {
  _id: Schema.Types.ObjectId;
  breeds: Schema.Types.ObjectId[];
  vaccines?: Schema.Types.ObjectId[] | undefined;
  origin: Schema.Types.ObjectId;
  name?: string | undefined;
  gender: string;
  birthdate: Date;
  size: string;
  weight: number;
  hairCoat: string;
  isHypoallergenic: boolean;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isHdbApproved: boolean;
  avsLicenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrUpdateDogRequest extends Request {
  body: Omit<
    IDog,
    '_id' | 'createdAt' | 'updatedAt' | 'breeds' | 'vaccines' | 'origin'
  > & {
    breeds: IDogBreed[];
    vaccines: IDogVaccine[];
    origin: ICountry;
  };
}

const dogSchema = new Schema(
  {
    breeds: [
      {
        type: Schema.Types.ObjectId,
        immutable: true,
        ref: 'DogBreed',
        required: [true, 'Please specify at least one breed for this dog.'],
        cast: 'Dog Breed ID of `{VALUE}` is invalid.'
      }
    ],
    vaccines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DogVaccine',
        required: false
      }
    ],
    origin: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: 'Country',
      required: [true, 'Please specify the country of origin of this dog.'],
      cast: 'Country ID of `{VALUE}` is invalid.'
    },
    name: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      enum: {
        values: genders,
        message: 'Gender of `{VALUE}` is neither `Male` nor `Female`.'
      },
      required: [true, 'Please specify the gender of this dog.']
    },
    birthdate: {
      type: Date,
      required: [true, 'Please specify the birthdate of this dog.'],
      case: 'Birthdate of `{VALUE}` is invalid.'
    },
    size: {
      type: String,
      enum: {
        values: sizes,
        message: 'Size of `{VALUE}` is neither `Small`, `Medium` nor `Large`.'
      },
      required: true
    },
    weight: {
      type: Number,
      min: [1, 'Weight must be greater than 0.'],
      required: [true, 'Please specify the weight of this dog.'],
      cast: 'Weight of `{VALUE}` is invalid.'
    },
    hairCoat: {
      type: String,
      enum: {
        values: hairCoats,
        message: 'Hair coat of `{VALUE}` is invalid.'
      },
      required: [true, 'Please specify the hair coat of this dog.']
    },
    isHypoallergenic: {
      type: Boolean,
      required: [true, 'Please specify whether this dog is hypoallergenic.'],
      cast: '`{VALUE}` is not a boolean.'
    },
    isMicrochipped: {
      type: Boolean,
      required: [true, 'Please specify whether this dog is microchipped.'],
      cast: '`{VALUE}` is not a boolean.'
    },
    isNeutered: {
      type: Boolean,
      required: [true, 'Please specify whether this dog is neutered.'],
      cast: '`{VALUE}` is not a boolean.'
    },
    isHdbApproved: {
      type: Boolean,
      required: [true, 'Please specify whether this dog is approved for HDBs.'],
      cast: '`{VALUE}` is not a boolean.'
    },
    avsLicenseNumber: {
      type: String,
      required: [true, 'Please specify the AVS license number of this dog.'],
      validate: [
        validateAVSLicenseNumber,
        'AVS license number of `{VALUE}` is invalid.'
      ],
      unique: true
    }
  },
  { collection: 'dogs', timestamps: true }
);

const Dog = mongoose.model<IDog, Model<IDog>>('Dog', dogSchema);

export default Dog;

function validateAVSLicenseNumber(avsLicenseNumber: string): boolean {
  // TODO: Implement AVS license number validation
  return true;
}

function determineIsHDBApproved(dogBreed: IDogBreed): boolean {
  // TODO: Implement HDB approval logic
  // Possible future plan: Automatically determine HDB approval instead of requiring user input
  return true;
}

function determineIsHypoallergenic(dogBreed: IDogBreed): boolean {
  // TODO: Implement hypoallergenic logic
  // Possible future plan: Automatically determine hypoallergenic status instead of requiring user input
  return true;
}
