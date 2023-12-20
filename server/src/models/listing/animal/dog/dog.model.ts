import mongoose, { Schema, Model } from 'mongoose';
import {
  IAnimal,
  ICreateAnimalRequest,
  IUpdateAnimalRequest,
  genders,
  sizes,
  validateAVSLicenseNumber
} from '../animal.model';
import { IBreed } from '../breed.model';
import { ICountry } from '../../../country.model';
import { IVaccine } from '../vaccine.model';

const hairCoats = [
  'Double',
  'Silky',
  'Wire',
  'Curly',
  'Hairless',
  'Long',
  'Medium',
  'Short'
];
const legalTags = [
  'isHypoallergenic',
  'isMicrochipped',
  'isNeutered',
  'isHdbApproved'
];

export interface IDog extends IAnimal {
  hairCoat: string;
  isHypoallergenic: boolean;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isHdbApproved: boolean;
}

export interface DogModel extends Model<IDog> {}

export interface ICreateDogRequest extends ICreateAnimalRequest {
  body: Omit<
    IDog,
    '_id' | 'createdAt' | 'updatedAt' | 'breeds' | 'vaccines' | 'origin'
  > & {
    breeds: IBreed['_id'][];
    vaccines: IVaccine['_id'][];
    origin: ICountry['_id'];
  };
}

export interface IUpdateDogRequest extends IUpdateAnimalRequest {
  body: Partial<ICreateDogRequest['body']>;
}

const dogSchema = new Schema(
  {
    breeds: [
      {
        type: Schema.Types.ObjectId,
        immutable: true,
        ref: 'Breed',
        required: [true, 'Please specify at least one breed for this dog.'],
        cast: 'Dog Breed ID of `{VALUE}` is invalid.'
      }
    ],
    vaccines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vaccine',
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
      min: [0.1, 'Weight must be greater than 0.'],
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
      default: false,
      cast: '`{VALUE}` is not a boolean.'
    },
    isMicrochipped: {
      type: Boolean,
      default: false,
      cast: '`{VALUE}` is not a boolean.'
    },
    isNeutered: {
      type: Boolean,
      default: false,
      cast: '`{VALUE}` is not a boolean.'
    },
    isHdbApproved: {
      type: Boolean,
      default: false,
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

const Dog = mongoose.model<IDog, DogModel>('Dog', dogSchema);

module.exports = { Dog, hairCoats, legalTags };

function determineIsHDBApproved(dogBreed: IBreed): boolean {
  // TODO: Implement HDB approval logic
  // Possible future plan: Automatically determine HDB approval instead of requiring user input
  return true;
}

function determineIsHypoallergenic(dogBreed: IBreed): boolean {
  // TODO: Implement hypoallergenic logic
  // Possible future plan: Automatically determine hypoallergenic status instead of requiring user input
  return true;
}
