import { Request } from 'express';
import mongoose, { Schema, Model, Document } from 'mongoose';
import {
  ICreateDogRequest,
  IUpdateDogRequest,
  IDog
} from './animal/dog/dog.model';
import { IUser } from '../user/user.model';

const saleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
const mediaTypes = ['Image']; // Add more types here: 'video', etc.
const speciesTypes = ['Dog']; // Add other animals here: 'Cat', 'Rabbit', 'Guinea Pig', 'Hamster', 'Gerbil', 'Mouse', 'Chinchilla'
const saleStatuses = ['Available', 'Sold', 'Expired'];

export interface IPetListing {
  _id: Schema.Types.ObjectId;
  lister: IUser['_id'];
  price: number;
  description: string;
  saleType: string;
  saleStatus: string;
  media: { type: string; url: string }[];
  animal: IDog['_id']; // Add other animals here: ICat['_id'], etc.
  species: string;
  createdAt: Date;
  updatedAt: Date;
  expiryDate: Date;
}

interface IPetListingMethods {
  updateSaleStatus(): void;
}

export interface PetListingModel
  extends Model<IPetListing, {}, IPetListingMethods> {}

export interface ICreatePetListingRequest extends Request {
  body: Omit<
    IPetListing,
    '_id' | 'createdAt' | 'updatedAt' | 'expiryDate' | 'lister' | 'animal'
  > & {
    lister: IUser;
    animal: ICreateDogRequest['body']; // Add other animals here: ICreateCatRequest['body'], etc.
  };
}

export interface IUpdatePetListingRequest extends Request {
  body: Partial<Omit<ICreatePetListingRequest['body'], 'animal'>> & {
    animal: IUpdateDogRequest['body']; // Add other animals here: IUpdateCatRequest['body'], etc.
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

const PetListingSchema = new Schema<
  IPetListing,
  PetListingModel,
  IPetListingMethods
>(
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
      required: [true, 'Please provide a description for this listing.']
    },
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
      default: 'Available' // CHANGE TITUS: Changed required to default
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
    },
    expiryDate: {
      type: Date,
      immutable: true
      // CHANGED TITUS: Removed required
    }
  },
  { collection: 'petListings', timestamps: true }
);

PetListingSchema.method('updateSaleStatus', function () {
  if (this.saleStatus === 'Sold' || this.saleStatus === 'Expired') {
    return;
  }

  if (new Date() >= this.expiryDate) {
    this.saleStatus = 'Expired';
  } else {
    this.saleStatus = 'Available';
  }
});

PetListingSchema.pre('validate', function (next) {
  if (this.isNew) {
    this.saleStatus = 'Available';
    this.createdAt = new Date();
    const expiryDate = new Date(this.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30); // Set expiration date to 30 days after creation date
    this.expiryDate = expiryDate;
  }

  next();
});

PetListingSchema.pre('save', function (next) {
  this.updateSaleStatus(); // Update sale status based on expiration date
  
  next();
});

PetListingSchema.post(
  'findOne',
  function (
    doc:
      | (Document<unknown, {}, IPetListing> &
          Omit<
            IPetListing &
              Required<{
                _id: Schema.Types.ObjectId;
              }>,
            'updateSaleStatus'
          > &
          IPetListingMethods)
      | null
  ) {
    if (!doc) {
      return;
    }

    doc.updateSaleStatus(); // Update sale status based on expiration date
    doc.save();
  }
);

const PetListing = mongoose.model<IPetListing, PetListingModel>(
  'PetListing',
  PetListingSchema
);

module.exports = {
  PetListing,
  saleTypes,
  mediaTypes,
  speciesTypes,
  saleStatuses
};
