import { Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';
import { ICreateOrUpdateDogRequest } from './animal/dog/dog.model';
import { IUser } from '../user/user.model';

export const saleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
export const mediaTypes = ['Image']; // Add more types here: 'video', etc.
export const speciesTypes = ['Dog']; // Add other animals here: 'Cat', 'Rabbit', 'Guinea Pig', 'Hamster', 'Gerbil', 'Mouse', 'Chinchilla'
export const saleStatuses = ['Available', 'Sold', 'Expired'];

export interface IPetListing {
  _id: Schema.Types.ObjectId;
  lister: Schema.Types.ObjectId;
  price: number;
  description: string;
  saleType: string;
  saleStatus: string;
  media: { type: string; url: string }[];
  animal: Schema.Types.ObjectId;
  species: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrUpdatePetListingRequest extends Request {
  body: Omit<
    IPetListing,
    '_id' | 'createdAt' | 'updatedAt' | 'lister' | 'animal'
  > & {
    lister: IUser;
    animal: ICreateOrUpdateDogRequest['body']; // Add other animals here: ICreateOrUpdateCatRequest['body'], etc.
  };
}

export interface IGetAllPetListingsRequest extends Request {}

export interface IGetAllPetListingsBySpeciesRequest extends Request {
  params: {
    species: string;
  };
}

export interface IGetPetListingByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface IDeletePetListingByIdRequest extends Request {
  params: {
    id: string;
  };
}

const PetListingSchema = new Schema(
  {
    lister: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: 'User',
      required: [true, 'Please specify the lister of this listing.']
    },
    price: { 
      type: Number, 
      required: [true, 'Please specify the price of this listing.'],
      cast: 'Price of `{VALUE}` is invalid.'
    },
    description: { 
      type: String, 
      required: [true, 'Please provide a description for this listing.'] },
    saleType: {
      type: String,
      enum: {
        values: saleTypes,
        message: 'Sale type of `{VALUE}` is not supported.'
      },
      immutable: true,
      required: [true, 'Please specify the sale type of this listing.']
    },
    saleStatus: {
      type: String,
      enum: {
        values: saleStatuses,
        message: 'Sale status of `{VALUE}` is invalid.'
      },
      required: [true, 'Please specify the sale status of this listing.']
    },
    media: [
      {
        type: {
          type: String,
          enum: {
            values: mediaTypes,
            message: 'Media type of `{VALUE}` is not yet supported.'
          },
          required: [true, 'Please specify the media type of this asset.']
        },
        url: {
          type: String,
          required: [true, 'Please specify the URL of this asset.']
        }
      }
    ],
    animal: {
      type: Schema.Types.ObjectId,
      immutable: true,
      refPath: 'species',
      required: [true, 'Please specify the animal in this listing.']
    },
    species: {
      type: String,
      enum: {
        values: speciesTypes,
        message: 'Animal species of `{VALUE}` is not yet supported.'
      },
      immutable: true,
      required: [
        true,
        'Please specify the species of the animal in this listing.'
      ]
    }
  },
  { collection: 'petListings', timestamps: true }
);

const PetListing = mongoose.model<IPetListing, Model<IPetListing>>(
  'PetListing',
  PetListingSchema
);

export default PetListing;
